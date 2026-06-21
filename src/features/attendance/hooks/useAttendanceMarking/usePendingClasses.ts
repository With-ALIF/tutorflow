import { useState, useCallback } from "react";
import { supabase } from "../../../../lib/supabase";
import { Student } from "../../types/attendance.types";
import { Routine } from "../../../routine/types/routine.types";
import { PendingClass, CaughtUpClass } from "./types";
import { getPastDatesList, getGmt6Basis } from "./timezoneHelpers";

export const usePendingClasses = () => {
  const [pendingClasses, setPendingClasses] = useState<PendingClass[]>([]);
  const [caughtUpClasses, setCaughtUpClasses] = useState<CaughtUpClass[]>([]);
  const [loadingPending, setLoadingPending] = useState(false);

  const fetchPendingClasses = useCallback(async (studentsList: Student[], routinesList: Routine[]) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || studentsList.length === 0 || routinesList.length === 0) return;
    setLoadingPending(true);
    try {
      const pastDatesList = getPastDatesList();
      const base = getGmt6Basis();
      const todayDateStr = `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, '0')}-${String(base.getDate()).padStart(2, '0')}`;
      const allDateStrings = Array.from(new Set([...pastDatesList.map(item => item.date), todayDateStr]));
      
      let attendanceRecords: any[] = [];
      if (allDateStrings.length > 0) {
        const { data, error } = await supabase
          .from("attendance")
          .select("*")
          .eq("user_id", user.id)
          .in("date", allDateStrings);
          
        if (error) throw error;
        attendanceRecords = data || [];
      }

      // Sort pastDatesList chronologically (oldest first)
      const sortedPastDatesList = [...pastDatesList].sort((a, b) => a.date.localeCompare(b.date));

      const pending: PendingClass[] = [];
      const caughtUp: CaughtUpClass[] = [];

      // Get unique batch names
      const batchNames = Array.from(new Set(routinesList.map(r => r.batchName)));

      for (const batchName of batchNames) {
        // Find students in this batch
        const batchStudents = studentsList.filter(s => s.batch === batchName);
        if (batchStudents.length === 0) continue;
        const studentIds = batchStudents.map(s => s.id);

        // Find all unique dates and shifts where attendance was actually completed for this batch
        const actualAttendances: { date: string; shift: string }[] = [];
        const seenActual = new Set<string>();

        for (const r of attendanceRecords) {
          if (studentIds.includes(r.student_id)) {
            const shiftStr = r.shift || "Morning";
            const key = `${r.date}_${shiftStr}`;
            if (!seenActual.has(key)) {
              seenActual.add(key);
              actualAttendances.push({ date: r.date, shift: shiftStr });
            }
          }
        }

        // Gather all scheduled slots for this batch during the 4-day window
        const scheduledSlots: { date: string; shift: "Morning" | "Evening"; routine: Routine }[] = [];
        for (const item of sortedPastDatesList) {
          const scheduledRoutines = routinesList.filter(r => r.day === item.dayName && r.batchName === batchName);
          for (const r of scheduledRoutines) {
            // Check if any student in this batch had already joined before/on this date
            const joinedStudents = batchStudents.filter(s => {
              const joinDateOnly = s.join_date ? s.join_date.split('T')[0] : "";
              return !joinDateOnly || joinDateOnly <= item.date;
            });
            if (joinedStudents.length === 0) continue;

            const rShift = (r.shift || "Morning") as "Morning" | "Evening";
            scheduledSlots.push({
              date: item.date,
              shift: rShift,
              routine: r
            });
          }
        }

        // Match scheduled slots to actual attendances
        const consumedActualKeys = new Set<string>();

        // Step 1: Assign exact matches
        const unmatchedSlots: typeof scheduledSlots = [];
        for (const slot of scheduledSlots) {
          const exactKey = `${slot.date}_${slot.shift}`;
          if (seenActual.has(exactKey)) {
            consumedActualKeys.add(exactKey);
          } else {
            unmatchedSlots.push(slot);
          }
        }

        // Step 2: For unmatched slots, assign any unused actual attendance on or after the slot's date
        let unusedActuals = actualAttendances.filter(a => !consumedActualKeys.has(`${a.date}_${a.shift}`));
        unusedActuals.sort((a, b) => a.date.localeCompare(b.date));

        for (const slot of unmatchedSlots) {
          const matchIdx = unusedActuals.findIndex(a => a.date >= slot.date);
          if (matchIdx !== -1) {
            // This slot is successfully covered by a subsequent extra class/catch-up
            caughtUp.push({
              batchName: slot.routine.batchName,
              originalDate: slot.date,
              coveredDate: unusedActuals[matchIdx].date,
              shift: slot.shift
            });
            unusedActuals.splice(matchIdx, 1);
          } else {
            // No match found, this slot is truly pending
            pending.push({
              batchName: slot.routine.batchName,
              day: slot.routine.day,
              date: slot.date,
              shift: slot.shift,
              subject: slot.routine.subject,
              room: slot.routine.room,
              color: slot.routine.color
            });
          }
        }
      }

      setPendingClasses(pending);
      setCaughtUpClasses(caughtUp);
    } catch (err) {
      console.error("Error fetching pending classes:", err);
    } finally {
      setLoadingPending(false);
    }
  }, []);

  return { pendingClasses, caughtUpClasses, loadingPending, fetchPendingClasses, setPendingClasses };
};
