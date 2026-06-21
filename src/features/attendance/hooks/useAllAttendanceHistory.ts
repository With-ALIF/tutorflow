import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { AttendanceRecord } from "../types/attendance.types";

export const useAllAttendanceHistory = (activeTab?: string) => {
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only fetch if we are on the calendar tab or if no tab is provided
    if (activeTab && activeTab !== 'calendar') return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data, error } = await supabase
          .from("attendance")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: false });
          
        if (error) throw error;
        
        setHistory(data as AttendanceRecord[]);
      } catch (err) {
        console.error("Error fetching all attendance history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [activeTab]);

  return { history, loading };
};
