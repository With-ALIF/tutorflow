import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { ToastContext } from "../../../context/ToastContext";
import { fetchStudents } from "../services/studentService";
import { fetchDailyAttendance, markAsCaughtUp, addFee } from "../services/attendanceService";
import { Student, AttendanceStatus } from "../types/attendance.types";
import { supabase } from "../../../lib/supabase";
import { getAttendanceCount, hasFeeForMonth, isEligibleForFee } from "../utils/attendanceUtils";
import { notifyAttendance } from "../../../utils/telegramService";

import { usePendingClasses } from "./useAttendanceMarking/usePendingClasses";
import { useMarkingRoutines } from "./useAttendanceMarking/useMarkingRoutines";
import { useSaveAttendance } from "./useAttendanceMarking/useSaveAttendance";

export const useAttendanceMarking = (date: string) => {
  const { showToast } = useContext(ToastContext);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [records, setRecords] = useState<Record<string, AttendanceStatus>>({});
  const [initialRecords, setInitialRecords] = useState<Record<string, AttendanceStatus>>({});
  const [loading, setLoading] = useState(true);

  const { pendingClasses, caughtUpClasses, loadingPending, fetchPendingClasses } = usePendingClasses();
  const { routines, activeRoutines, setRoutines } = useMarkingRoutines(date);

  const { saving, handleSave: saveHandler } = useSaveAttendance();

  const [extraBatches, setExtraBatches] = useState<string[]>([]);

  // Clear extra/rescheduled batches when date changes
  useEffect(() => {
    setExtraBatches([]);
  }, [date]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [studentsData, attendanceData] = await Promise.all([
        fetchStudents(),
        fetchDailyAttendance(date)
      ]);
      const activeStudentsList = studentsData.filter(s => s.status !== 'finished');
      setAllStudents(activeStudentsList);
      
      // Since we unified shifts, but students might be displayed multiple times if they have multiple classes,
      // we'll handle the records carefully in the UI if needed.
      // For now, let's keep it simple: fetchDailyAttendance(date) returns records with studentId_shift keys.
      setRecords(attendanceData);
      setInitialRecords(attendanceData);
    } catch (err) {
      showToast("Failed to load attendance data", "error");
    } finally {
      setLoading(false);
    }
  }, [date, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (allStudents.length > 0 && routines.length > 0) {
      fetchPendingClasses(allStudents, routines);
    }
  }, [allStudents, routines, fetchPendingClasses]);

  const addExtraBatch = useCallback((className: string) => {
    setExtraBatches(prev => {
      if (prev.includes(className)) return prev;
      return [...prev, className];
    });
    showToast(`Loaded ${className} on the active list!`, "success");
    // Scroll to the panel after a short delay to allow rendering
    setTimeout(() => {
      const el = document.getElementById('attendance-table-container');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [showToast]);

  const sessions = useMemo(() => {
    // 1. Start with all routinely scheduled classes for the day that have active students
    // We filter activeRoutines to only include those where at least one active student exists
    const sessionList = activeRoutines
      .filter(r => allStudents.some(s => s.class === r.className || s.name === r.className))
      .map(r => ({ ...r, type: 'scheduled' as const }));
    
    // Track routine-covered students to prevent extra session duplicates
    const coveredMap = new Map<string, Set<string>>();
    sessionList.forEach(session => {
      const routineTime = session.startTime || '10:00';
      const batchStudents = allStudents.filter(s => s.class === session.className || s.name === session.className);
      batchStudents.forEach(s => {
        if (!coveredMap.has(s.id)) coveredMap.set(s.id, new Set());
        coveredMap.get(s.id)?.add(routineTime);
      });
    });
    
    // 2. Identify which batches are already covered by the scheduled list
    const routineClassNames = new Set(sessionList.map(r => r.className));
    
    // 3. Add extra batches (manually added or historically marked) that aren't in today's routine
    const extraClassNames = new Set(extraBatches);
    const markedStudentIds = new Set(Object.keys(records).map(k => k.split('_')[0]));
    
    // Improved marked batches logic: prioritize routine coverage
    const markedBatches = new Set<string>();
    allStudents.forEach(s => {
      // If student is already covered by a routine today, we ignore their existing records
      // so they don't trigger an redundant "Extra" session for the same day.
      if (coveredMap.has(s.id)) return;

      if (markedStudentIds.has(s.id)) {
        // Only if they have a record but are NOT in any routine today
        const names = [s.class, s.name].filter(Boolean) as string[];
        names.forEach(n => {
          if (!routineClassNames.has(n)) markedBatches.add(n);
        });
      }
    });

    const nonRoutineBatches = Array.from(new Set([
      ...Array.from(extraClassNames),
      ...Array.from(markedBatches)
    ])).filter(name => !routineClassNames.has(name));

    // 4. Create "extra" session objects for those non-routine batches
    nonRoutineBatches.forEach(className => {
      // Find all students for this batch
      const allBatchStudents = allStudents.filter(s => s.class === className || s.name === className);
      
      const foundTimes = new Set<string>();
      
      allBatchStudents.forEach(s => {
        // Look for any keys containing times, excluding CaughtUp
        Object.keys(records).forEach(k => {
          if (k.startsWith(`${s.id}_`)) {
            const timePart = k.split('_')[1];
            if (timePart && timePart !== 'CaughtUp') {
              foundTimes.add(timePart);
            }
          }
        });
      });
      
      // If none found (e.g. manually added via select), default to 10:00
      if (foundTimes.size === 0) {
        foundTimes.add('10:00');
      }
      
      foundTimes.forEach(time => {
        // Only include students NOT covered by a routine for this time
        const batchStudents = allBatchStudents.filter(s => !coveredMap.get(s.id)?.has(time));
        
        if (batchStudents.length > 0) {
          sessionList.push({
            id: `extra_${className}_${time}`,
            className,
            subject: "Extra/Catch-up",
            startTime: time,
            endTime: "-",
            day: "Any",
            shift: "Morning",
            type: 'extra' as const
          });
        }
      });
    });

    return sessionList;
  }, [activeRoutines, extraBatches, records, allStudents]);

  const students = useMemo(() => {
    const displayedClassNames = new Set(sessions.map(s => s.className));
    return allStudents.filter(s => {
      if (!displayedClassNames.has(s.class) && !displayedClassNames.has(s.name)) return false;
      // Do not show students who joined after the currently selected date in the marking panel
      const joinDateOnly = s.join_date ? s.join_date.split('T')[0] : "";
      if (joinDateOnly && joinDateOnly > date) return false;
      return true;
    });
  }, [allStudents, sessions, date]);

  const filteredPendingClasses = useMemo(() => {
    const activeClassNames = new Set(sessions.map(s => s.className));
    return pendingClasses.filter(pc => !activeClassNames.has(pc.className));
  }, [pendingClasses, sessions]);

  const handleStatusChange = useCallback((studentId: string, status: AttendanceStatus, time: string = '10:00') => {
    setRecords(prev => {
      const newRecords = { ...prev };
      if (status === 'cleared') {
        // Clear regular session records for this time
        const regularKey = `${studentId}_${time}`;
        if (newRecords[regularKey]) {
          newRecords[regularKey] = 'cleared';
        }
        
        // Also clear any caught-up records for this student on this date
        // Since we don't know the original date easily here, we clear any key that matches the pattern
        Object.keys(newRecords).forEach(k => {
          if (k.startsWith(`${studentId}_CaughtUp_`)) {
            newRecords[k] = 'cleared';
          }
        });
      } else {
        newRecords[`${studentId}_${time}`] = status;
      }
      return newRecords;
    });
  }, []);

  const handleUndo = useCallback(() => {
    setRecords(initialRecords);
  }, [initialRecords]);

  const handleSave = async (currentTime: string) => {
    await saveHandler({
      records,
      students,
      allStudents,
      date,
      shift: currentTime as any, // We pass time as the shift value to the handler
      routines,
      setInitialRecords,
      setRecords,
      fetchPendingClasses,
      showToast
    });
  };

  const handleMarkTaken = useCallback(async (item: any, takenDate: string, shift: 'Morning' | 'Evening') => {
    if (!takenDate) return;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(takenDate)) {
      showToast("Invalid date format. Please use YYYY-MM-DD.", "error");
      return;
    }

    try {
      const batchStudents = allStudents.filter(s => (s.class === item.className || s.name === item.className));
      if (batchStudents.length === 0) {
        showToast("No active students found in this class.", "error");
        return;
      }
      
      const studentIds = batchStudents.map(s => s.id);
      
      await markAsCaughtUp(studentIds, item.date, takenDate, shift);
      
      showToast(`Marked ${item.className} as taken on ${takenDate} (${shift === 'Evening' ? 'Afternoon' : 'Morning'})`, "success");

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const [{ data: allAttendance }, { data: allFees }] = await Promise.all([
            supabase.from("attendance").select("*").eq("user_id", user.id),
            supabase.from("fees").select("*").eq("user_id", user.id)
          ]);

          const currentFees = allFees || [];
          const attendanceList = allAttendance || [];

          for (const student of batchStudents) {
            const lecturesPerMonth = student.lectures_per_month || 12;
            let count = getAttendanceCount(attendanceList, student.id, 'present');
            
            const recordShift = `CaughtUp_${item.date}_${shift}`;
            const existingRecord = attendanceList.find(
              a => a.student_id === student.id && a.date === takenDate && a.shift === recordShift
            );

            if (!existingRecord) {
              count++;
            }

            if (isEligibleForFee(count, lecturesPerMonth)) {
              const recordMonth = takenDate.slice(0, 7);
              if (!hasFeeForMonth(currentFees, student.id, recordMonth)) {
                await addFee(student.id, student.monthly_fee || 0, takenDate, recordMonth);
                currentFees.push({ student_id: student.id, fee_month: recordMonth } as any);
              }
            }

            try {
              await notifyAttendance({
                studentName: student.name,
                studentTelegramChatId: student.telegram_chat_id,
                status: 'caught_up',
                date: takenDate,
                shift,
                currentLectureCount: count,
                lecturesPerMonth
              });
            } catch (notifyErr) {
              console.error(`Failed to send telegram notification for ${student.name}:`, notifyErr);
            }
          }
        }
      } catch (postSaveErr) {
        console.error("Error processing post-save fees and notifications:", postSaveErr);
      }

      await loadData();
      fetchPendingClasses(allStudents, routines);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to mark as taken", "error");
    }
  }, [allStudents, routines, fetchPendingClasses, showToast, loadData]);

  return { 
    students, 
    records, 
    sessions, 
    activeRoutines,
    loading, 
    saving, 
    handleStatusChange, 
    handleSave, 
    handleUndo,
    pendingClasses: filteredPendingClasses,
    caughtUpClasses,
    loadingPending,
    addExtraBatch,
    handleMarkTaken,
    refreshPending: () => fetchPendingClasses(allStudents, routines)
  };
};
