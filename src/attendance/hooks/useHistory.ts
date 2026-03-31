import { useState, useEffect, useContext } from "react";
import { auth, db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { AttendanceRecord } from "../types";
import { ToastContext } from "../../context/ToastContext";

export const useHistory = (studentId: string) => {
  const { showToast } = useContext(ToastContext);
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!studentId) return;
    const fetchHistory = async () => {
      setLoading(true);
      try {
        if (!auth.currentUser) return;
        const q = query(collection(db, "attendance"), where("userId", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const historyData = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as AttendanceRecord))
          .filter(record => record.student_id === studentId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setHistory(historyData);
      } catch (err) {
        console.error("Error fetching student history:", err);
        showToast("Failed to fetch history", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [studentId]);

  return { history, loading };
};
