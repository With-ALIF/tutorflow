import { useState, useEffect, useContext } from "react";
import { ToastContext } from "../../context/ToastContext";
import { fetchStudents } from "../services/studentService";
import { fetchDailyAttendance, saveAttendance, addFee } from "../services/attendanceService";
import { Student } from "../types/attendance.types";
import { auth, db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export const useAttendance = (date: string) => {
  const { showToast } = useContext(ToastContext);
  const [students, setStudents] = useState<Student[]>([]);
  const [records, setRecords] = useState<Record<string, 'present' | 'absent'>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const studentsData = await fetchStudents();
        setStudents(studentsData);
        const attendanceData = await fetchDailyAttendance(date);
        setRecords(attendanceData);
      } catch (err) {
        showToast("Failed to load attendance data", "error");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [date]);

  const handleStatusChange = (studentId: string, status: 'present' | 'absent') => {
    setRecords(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (!auth.currentUser) return;
      
      // Fetch all attendance and fees for the user
      const allAttendanceQ = query(collection(db, "attendance"), where("userId", "==", auth.currentUser.uid));
      const allAttendanceSnapshot = await getDocs(allAttendanceQ);
      const allAttendance = allAttendanceSnapshot.docs.map(doc => doc.data());
      
      const allFeesQ = query(collection(db, "fees"), where("userId", "==", auth.currentUser.uid));
      const allFeesSnapshot = await getDocs(allFeesQ);
      const allFees = allFeesSnapshot.docs.map(doc => doc.data());

      for (const [studentId, status] of Object.entries(records)) {
        await saveAttendance(studentId, date, status);

        if (status === 'present') {
          const student = students.find(s => s.id === studentId);
          if (student) {
            const lecturesPerMonth = student.lectures_per_month || 12;
            
            let count = allAttendance.filter((a: any) => a.student_id === studentId && a.status === 'present').length;
            const existingRecord = allAttendance.find((a: any) => a.student_id === studentId && a.date === date);
            if (!existingRecord || (existingRecord as any).status !== 'present') {
              count++;
            }

            if (count > 0 && count % lecturesPerMonth === 0) {
              const recordMonth = date.slice(0, 7);
              const feeExists = allFees.some((f: any) => f.student_id === studentId && f.fee_month === recordMonth);
              
              if (!feeExists) {
                await addFee(studentId, student.monthly_fee || 0, date, recordMonth);
                allFees.push({ student_id: studentId, fee_month: recordMonth } as any);
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
