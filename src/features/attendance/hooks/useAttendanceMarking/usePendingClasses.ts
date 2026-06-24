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

      const sortedPastDatesList = [...pastDatesList].sort((a, b) => a.date.localeCompare(b.date));

      const pending: PendingClass[] = [];
      const caughtUp: CaughtUpClass[] = [];

      const classNames = Array.from(new Set(routinesList.map(r => r.className)));

      for (const className of classNames) {
        const batchStudents = studentsList.filter(s => 
          (s.class === className || s.name === className) && 
          s.status !== 'finished'
        );
        if (batchStudents.length === 0) continue;
        const studentIds = batchStudents.map(s => s.id);

        const actualAttendances: { date: string }[] = [];
        const seenActual = new Set<string>();

        for (const r of attendanceRecords) {
          if (studentIds.includes(r.student_id)) {
            const key = r.date;
            if (!seenActual.has(key)) {
              seenActual.add(key);
              actualAttendances.push({ date: r.date });
            }
          }
        }

        const scheduledSlots: { date: string; routine: Routine }[] = [];
        for (const item of sortedPastDatesList) {
          const scheduledRoutines = routinesList.filter(r => r.day === item.dayName && r.className === className);
          for (const r of scheduledRoutines) {
            const joinedStudents = batchStudents.filter(s => {
              const joinDateOnly = s.join_date ? s.join_date.split('T')[0] : "";
              if (!joinDateOnly) return true;
              return joinDateOnly <= item.date;
            });
            
            if (joinedStudents.length === 0) continue;

            scheduledSlots.push({
              date: item.date,
              routine: r
            });
          }
        }

        const consumedActualKeys = new Set<string>();

        const unmatchedSlots: typeof scheduledSlots = [];
        for (const slot of scheduledSlots) {
          const exactKey = slot.date;
          if (seenActual.has(exactKey)) {
            consumedActualKeys.add(exactKey);
          } else {
            unmatchedSlots.push(slot);
          }
        }

        let unusedActuals = actualAttendances.filter(a => !consumedActualKeys.has(a.date));
        unusedActuals.sort((a, b) => a.date.localeCompare(b.date));

        for (const slot of unmatchedSlots) {
          const matchIdx = unusedActuals.findIndex(a => a.date >= slot.date);
          if (matchIdx !== -1) {
            caughtUp.push({
              className: slot.routine.className,
              originalDate: slot.date,
              coveredDate: unusedActuals[matchIdx].date
            });
            unusedActuals.splice(matchIdx, 1);
          } else {
            pending.push({
              className: slot.routine.className,
              day: slot.routine.day,
              date: slot.date,
              subject: slot.routine.subject
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
