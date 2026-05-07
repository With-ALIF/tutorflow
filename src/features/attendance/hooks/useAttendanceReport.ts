import { useState, useEffect } from "react";
import { db, auth } from "../../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { AttendanceRecord } from "../types/attendance.types";

export const useAttendanceReport = (month: string) => {
  const [data, setData] = useState<Record<string, { present: number, absent: number }>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        if (!auth.currentUser) return;
        const startDate = `${month}-01`;
        const endDate = `${month}-31`;
        
        const q = query(
          collection(db, "attendance"), 
          where("userId", "==", auth.currentUser.uid),
          where("date", ">=", startDate),
          where("date", "<=", endDate)
        );
        const querySnapshot = await getDocs(q);
        const reportData: Record<string, { present: number, absent: number }> = {};
        
        querySnapshot.docs.forEach(doc => {
          const record = doc.data() as AttendanceRecord;
          if (!reportData[record.student_id]) {
            reportData[record.student_id] = { present: 0, absent: 0 };
          }
          if (record.status === 'present') {
            reportData[record.student_id].present++;
          } else {
            reportData[record.student_id].absent++;
          }
        });
        setData(reportData);
      } catch (err) {
        console.error("Error fetching monthly report:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [month]);

  return { data, loading };
};
