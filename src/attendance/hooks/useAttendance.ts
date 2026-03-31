import { useState, useEffect, useContext } from "react";
import { auth } from "../../firebase";
import { ToastContext } from "../../context/ToastContext";
import { fetchAttendanceByDate, saveAttendance } from "../services/attendanceService";
import { Student } from "../types";

export const useAttendance = (date: string, students: Student[]) => {
  const { showToast } = useContext(ToastContext);
  const [records, setRecords] = useState<Record<string, 'present' | 'absent'>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadAttendance = async () => {
      if (!auth.currentUser) return;
      try {
        const data = await fetchAttendanceByDate(auth.currentUser.uid, date);
        setRecords(data);
      } catch (err) {
        console.error("Error fetching daily attendance:", err);
        showToast("Failed to fetch attendance", "error");
      }
    };
    loadAttendance();
  }, [date]);

  const handleStatusChange = (studentId: string, status: 'present' | 'absent') => {
    setRecords(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (!auth.currentUser) return;
      await saveAttendance(auth.currentUser.uid, date, records, students);
      showToast("Attendance saved successfully!");
    } catch (err: any) {
      console.error("Error saving attendance:", err);
      showToast(err.message || "Failed to save attendance", "error");
    } finally {
      setSaving(false);
    }
  };

  return { records, handleStatusChange, handleSave, saving };
};
