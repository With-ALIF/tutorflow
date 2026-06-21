import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { AttendanceRecord } from "../types/attendance.types";

export const useAttendanceHistory = (studentId: string, activeTab?: string) => {
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!studentId) return;
    if (activeTab && activeTab !== 'history') return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data, error } = await supabase
          .from("attendance")
          .select("*")
          .eq("user_id", user.id)
          .eq("student_id", studentId)
          .order("date", { ascending: false });
          
        if (error) throw error;
        
        setHistory(data as AttendanceRecord[]);
      } catch (err) {
        console.error("Error fetching student history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [studentId, activeTab]);

  return { history, loading };
};
