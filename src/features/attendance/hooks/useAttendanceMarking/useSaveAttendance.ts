import { useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { saveAttendance, addFee } from "../../services/attendanceService";
import { Student, AttendanceStatus } from "../../types/attendance.types";
import { getAttendanceCount, hasFeeForMonth, isEligibleForFee } from "../../utils/attendanceUtils";
import { notifyAttendance } from "@/src/utils/telegramService";
import { Routine } from "../../../routine/types/routine.types";

interface SaveParams {
  records: Record<string, AttendanceStatus>;
  students: Student[];
  allStudents: Student[];
  date: string;
  shift: "Morning" | "Evening";
  routines: Routine[];
  setInitialRecords: (recs: Record<string, AttendanceStatus>) => void;
  fetchPendingClasses: (studentsList: Student[], routinesList: Routine[]) => Promise<void>;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export const useSaveAttendance = () => {
  const [saving, setSaving] = useState(false);

  const handleSave = async (params: SaveParams) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setSaving(true);
    const {
      records,
      students,
      allStudents,
      date,
      shift,
      routines,
      setInitialRecords,
      fetchPendingClasses,
      showToast
    } = params;

    try {
      const { data: allAttendance, error: attError } = await supabase
        .from("attendance")
        .select("*")
        .eq("user_id", user.id);
      
      const { data: allFees, error: feesError } = await supabase
        .from("fees")
        .select("*")
        .eq("user_id", user.id);

      if (attError) throw attError;
      if (feesError) throw feesError;

      const currentFees = allFees || [];

      for (const [key, status] of Object.entries(records) as [string, AttendanceStatus][]) {
        let studentId = key;
        let recordShift: string = shift;

        // If key is studentId_shift format
        if (key.includes('_')) {
          const firstUnderscore = key.indexOf('_');
          studentId = key.substring(0, firstUnderscore);
          recordShift = key.substring(firstUnderscore + 1) as "Morning" | "Evening" | string;
        }

        if (!students.find(s => s.id === studentId)) continue;

        await saveAttendance(studentId, date, recordShift, status);

        const student = students.find(s => s.id === studentId);
        if (student) {
          const lecturesPerMonth = student.lectures_per_month || 12;
          let count = getAttendanceCount(allAttendance || [], studentId, 'present');
          
          const existingRecord = allAttendance?.find(
            a => a.student_id === studentId && a.date === date && a.shift === recordShift
          );
          
          const isStatusChanged = !existingRecord || existingRecord.status !== status;

          if (status === 'present') {
            if (!existingRecord || existingRecord.status !== 'present') {
              count++;
            }

            if (isEligibleForFee(count, lecturesPerMonth)) {
              const recordMonth = date.slice(0, 7);
              if (!hasFeeForMonth(currentFees, studentId, recordMonth)) {
                await addFee(studentId, student.monthly_fee || 0, date, recordMonth);
                currentFees.push({ student_id: studentId, fee_month: recordMonth } as any);
              }
            }
          }

          if (isStatusChanged && (status === 'present' || status === 'absent')) {
            try {
              await notifyAttendance({
                studentName: student.name,
                studentTelegramChatId: student.telegram_chat_id,
                status,
                date,
                shift: recordShift,
                currentLectureCount: count,
                lecturesPerMonth
              });
            } catch (notifyErr) {
              console.error("Failed to send telegram notification:", notifyErr);
            }
          }
        }
      }
      setInitialRecords(records);
      await fetchPendingClasses(allStudents, routines);
      showToast("Attendance saved successfully!");
    } catch (err: any) {
      showToast(err.message || "Failed to save attendance", "error");
    } finally {
      setSaving(false);
    }
  };

  return { saving, handleSave };
};
