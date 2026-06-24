import { format } from "date-fns";
import { supabase } from "../../../lib/supabase";
import { Student } from "../../../types/student";
import { FeeRecord } from "../../../types/fee";
import { AttendanceRecord } from "../../../types/attendance";
import { Stats } from "../types/dashboard.types";

export const fetchDashboardData = async (): Promise<Stats> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return {
      totalStudents: 0,
      monthlyIncome: 0,
      dueFees: 0,
      recentActivity: [],
      upcomingFees: []
    };
  }
  
  try {
    const { data: students, error: studentsError } = await supabase
      .from("students")
      .select("*")
      .eq("user_id", user.id);
      
    if (studentsError) throw studentsError;
    const totalStudents = students.length;

    const studentsMap = new Map<string, string>();
    students.forEach(student => {
      studentsMap.set(student.id, student.name);
    });
    const studentIds = new Set(studentsMap.keys());

    const currentMonth = format(new Date(), 'yyyy-MM');
    
    const { data: fees, error: feesError } = await supabase
      .from("fees")
      .select("*")
      .eq("user_id", user.id);
    
    if (feesError) throw feesError;
    
    let monthlyIncome = 0;
    let totalDueBalance = 0;
    const upcomingFees: any[] = [];

    fees.forEach(data => {
      if (data.fee_month !== currentMonth) return;
      if (!studentIds.has(data.student_id)) return;
      if (data.status === 'paid') {
        monthlyIncome += data.amount;
      } else if (data.status === 'due' || data.status === 'pending') {
        totalDueBalance += data.amount;
        upcomingFees.push({ 
          ...data,
          studentName: studentsMap.get(data.student_id) || 'Unknown Student'
        });
      }
    });

    const { data: attendanceData, error: attendanceError } = await supabase
      .from("attendance")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (attendanceError) throw attendanceError;

    const recentActivity = attendanceData
      .map(data => {
        return {
          ...data,
          studentName: studentsMap.get(data.student_id) || 'Unknown Student'
        };
      })
      .sort((a, b) => {
        // Primary Sort: Date Descending
        const dateCompare = b.date.localeCompare(a.date);
        if (dateCompare !== 0) return dateCompare;
        // Secondary Sort: Created At Descending (most recently saved sessions of that date)
        return b.created_at.localeCompare(a.created_at);
      })
      .slice(0, 7); // Take top 7 sorted records

    return {
      totalStudents,
      monthlyIncome,
      dueFees: totalDueBalance,
      recentActivity,
      upcomingFees: upcomingFees.slice(0, 5)
    };
  } catch (error) {
    console.error('Dashboard Error: ', error);
    throw error;
  }
};

