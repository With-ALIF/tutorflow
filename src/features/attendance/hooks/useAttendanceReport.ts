import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { AttendanceRecord } from "../types/attendance.types";

export const useAttendanceReport = (month: string, activeTab?: string) => {
  const [data, setData] = useState<Record<string, { present: number, absent: number }>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only fetch if we are on the report tab or if no tab is provided
    if (activeTab && activeTab !== 'report') return;

    const fetchReport = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const [year, m] = month.split('-');
        const lastDay = new Date(parseInt(year), parseInt(m), 0).getDate();
        const startDate = `${month}-01`;
        const endDate = `${month}-${lastDay}`;
        
        const { data: records, error } = await supabase
          .from("attendance")
          .select("*")
          .eq("user_id", user.id)
          .gte("date", startDate)
          .lte("date", endDate);
          
        if (error) throw error;
        
        const reportData: Record<string, { present: number, absent: number }> = {};
        
        records?.forEach((record: AttendanceRecord) => {
          if (!reportData[record.student_id]) {
            reportData[record.student_id] = { present: 0, absent: 0 };
          }
          if (record.status === 'present' || record.status === 'caught_up') {
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
  }, [month, activeTab]);

  return { data, loading };
};
