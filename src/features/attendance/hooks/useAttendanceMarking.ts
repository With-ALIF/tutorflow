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

  const addExtraBatch = useCallback((batchName: string) => {
    setExtraBatches(prev => {
      if (prev.includes(batchName)) return prev;
      return [...prev, batchName];
    });
    showToast(`Loaded ${batchName} on the active list!`, "success");
    // Scroll to the panel after a short delay to allow rendering
    setTimeout(() => {
      const el = document.getElementById('attendance-table-container');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [showToast]);

  const sessions = useMemo(() => {
    // 1. Start with all routinely scheduled classes for the day
    const sessionList = activeRoutines.map(r => ({ ...r, type: 'scheduled' as const }));
    
    // 2. Identify which batches are already covered by the scheduled list
    const routineBatchNames = new Set(activeRoutines.map(r => r.batchName));
    
    // 3. Add extra batches (manually added or historically marked) that aren't in today's routine
    const extraBatchNames = new Set(extraBatches);
    const markedStudentIds = new Set(Object.keys(records).map(k => k.split('_')[0]));
    const markedBatches = new Set(
      allStudents
        .filter(s => markedStudentIds.has(s.id))
        .map(s => s.batch || "")
        .filter(Boolean)
    );

    const nonRoutineBatches = Array.from(new Set([
      ...Array.from(extraBatchNames),
      ...Array.from(markedBatches)
    ])).filter(name => !routineBatchNames.has(name));

    // 4. Create "extra" session objects for those non-routine batches
    nonRoutineBatches.forEach(batchName => {
      sessionList.push({
        id: `extra_${batchName}`,
        batchName,
        subject: "Extra/Catch-up",
        startTime: "Manual",
        endTime: "-",
        day: "Any",
        shift: 'Morning' as const,
        color: "#64748b",
        type: 'extra' as const
      });
    });

    return sessionList;
  }, [activeRoutines, extraBatches, records, allStudents]);

  const students = useMemo(() => {
    const displayedBatchNames = new Set(sessions.map(s => s.batchName));
    return allStudents.filter(s => {
      if (!s.batch || !displayedBatchNames.has(s.batch)) return false;
      // Do not show students who joined after the currently selected date in the marking panel
      const joinDateOnly = s.join_date ? s.join_date.split('T')[0] : "";
      if (joinDateOnly && joinDateOnly > date) return false;
      return true;
    });
  }, [allStudents, sessions, date]);

  const filteredPendingClasses = useMemo(() => {
    const activeBatchNames = new Set(sessions.map(s => s.batchName));
    return pendingClasses.filter(pc => !activeBatchNames.has(pc.batchName));
  }, [pendingClasses, sessions]);

  const handleStatusChange = useCallback((studentId: string, status: AttendanceStatus, shift: string = 'Morning') => {
    setRecords(prev => {
      const newRecords = { ...prev };
      if (status === 'cleared') {
        const activeKeys = Object.keys(newRecords).filter(k => k.startsWith(`${studentId}_`) && k.endsWith(shift));
        activeKeys.forEach(k => { newRecords[k] = 'cleared'; });
      } else {
        newRecords[`${studentId}_${shift}`] = status;
      }
      return newRecords;
    });
  }, []);

  const handleUndo = useCallback(() => {
    setRecords(initialRecords);
  }, [initialRecords]);

  const handleSave = async (currentShift: 'Morning' | 'Evening') => {
    await saveHandler({
      records,
      students,
      allStudents,
      date,
      shift: currentShift,
      routines,
      setInitialRecords,
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
      const batchStudents = allStudents.filter(s => s.batch === item.batchName);
      if (batchStudents.length === 0) {
        showToast("No active students found in this batch.", "error");
        return;
      }
      
      const studentIds = batchStudents.map(s => s.id);
      
      await markAsCaughtUp(studentIds, item.date, takenDate, shift);
      
      showToast(`Marked ${item.batchName} as taken on ${takenDate} (${shift === 'Evening' ? 'Afternoon' : 'Morning'})`, "success");

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
            
            const recordShift = `CaughtUp_${takenDate}_${shift}`;
            const existingRecord = attendanceList.find(
              a => a.student_id === student.id && a.date === item.date && a.shift === recordShift
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
