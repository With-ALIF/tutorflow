import { useState, useEffect, useContext, useCallback } from "react";
import { ToastContext } from "../../../context/ToastContext";
import { fetchStudents } from "../services/studentService";
import { fetchDailyAttendance, saveAttendance, addFee } from "../services/attendanceService";
import { Student, AttendanceStatus } from "../types/attendance.types";
import { auth, db } from "../../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAttendanceCount, hasFeeForMonth, isEligibleForFee } from "../utils/attendanceUtils";

export const useAttendanceMarking = (date: string) => {
  const { showToast } = useContext(ToastContext);
  const [students, setStudents] = useState<Student[]>([]);
  const [records, setRecords] = useState<Record<string, AttendanceStatus>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [studentsData, attendanceData] = await Promise.all([
          fetchStudents(),
          fetchDailyAttendance(date)
        ]);
        setStudents(studentsData);
        setRecords(attendanceData);
      } catch (err) {
        showToast("Failed to load attendance data", "error");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [date, showToast]);

  const handleStatusChange = useCallback((studentId: string, status: AttendanceStatus) => {
    setRecords(prev => ({ ...prev, [studentId]: status }));
  }, []);

  const handleSave = async () => {
    if (!auth.currentUser) return;
    setSaving(true);
    try {
      const [allAttendanceSnapshot, allFeesSnapshot] = await Promise.all([
        getDocs(query(collection(db, "attendance"), where("userId", "==", auth.currentUser.uid))),
        getDocs(query(collection(db, "fees"), where("userId", "==", auth.currentUser.uid)))
      ]);

      const allAttendance = allAttendanceSnapshot.docs.map(doc => doc.data());
      const allFees = allFeesSnapshot.docs.map(doc => doc.data());

      for (const [studentId, status] of Object.entries(records) as [string, AttendanceStatus][]) {
        await saveAttendance(studentId, date, status);

        if (status === 'present') {
          const student = students.find(s => s.id === studentId);
          if (student) {
            const lecturesPerMonth = student.lectures_per_month || 12;
            let count = getAttendanceCount(allAttendance, studentId, 'present');
            
            const existingRecord = allAttendance.find(a => a.student_id === studentId && a.date === date);
            if (!existingRecord || existingRecord.status !== 'present') {
              count++;
            }

            if (isEligibleForFee(count, lecturesPerMonth)) {
              const recordMonth = date.slice(0, 7);
              if (!hasFeeForMonth(allFees, studentId, recordMonth)) {
                await addFee(studentId, student.monthly_fee || 0, date, recordMonth);
                allFees.push({ student_id: studentId, fee_month: recordMonth });
              }
            }
          }
        }
      }
      showToast("Attendance saved successfully!");
    } catch (err: any) {
      showToast(err.message || "Failed to save attendance", "error");
    } finally {
      setSaving(false);
    }
  };

  return { students, records, loading, saving, handleStatusChange, handleSave };
};
