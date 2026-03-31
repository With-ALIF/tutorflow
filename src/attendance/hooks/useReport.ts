import { useState, useEffect, useContext } from "react";
import { auth, db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { AttendanceRecord } from "../types";
import { ToastContext } from "../../context/ToastContext";

export const useReport = (reportMonth: string) => {
  const { showToast } = useContext(ToastContext);
  const [reportData, setReportData] = useState<Record<string, { present: number, absent: number }>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMonthlyReport = async () => {
      setLoading(true);
      try {
        if (!auth.currentUser) return;
        const startDate = `${reportMonth}-01`;
        const endDate = `${reportMonth}-31`;
        
        const q = query(
          collection(db, "attendance"), 
          where("userId", "==", auth.currentUser.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const data: Record<string, { present: number, absent: number }> = {};
        
        querySnapshot.docs.forEach(doc => {
          const record = doc.data() as AttendanceRecord;
          if (record.date >= startDate && record.date <= endDate) {
            if (!data[record.student_id]) {
              data[record.student_id] = { present: 0, absent: 0 };
            }
            if (record.status === 'present') {
              data[record.student_id].present++;
            } else {
              data[record.student_id].absent++;
            }
          }
        });
        
        setReportData(data);
      } catch (err) {
        console.error("Error fetching monthly report:", err);
        showToast("Failed to fetch monthly report", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchMonthlyReport();
  }, [reportMonth]);

  return { reportData, loading };
};
