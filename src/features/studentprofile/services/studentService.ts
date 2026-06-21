import { supabase } from "../../../lib/supabase";
import { Student } from "../../../types/student";
import { AttendanceRecord } from "../../../types/attendance";
import { FeeRecord } from "../../../types/fee";

export const fetchStudentData = async (id: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!id || !user) throw new Error("User not authenticated");

  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (studentError || !student) {
    return null;
  }

  const { data: attendance, error: attendanceError } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", user.id)
    .eq("student_id", id)
    .order("date", { ascending: false });

  if (attendanceError) throw attendanceError;

  const { data: fees, error: feesError } = await supabase
    .from("fees")
    .select("*")
    .eq("user_id", user.id)
    .eq("student_id", id)
    .order("payment_date", { ascending: false });

  if (feesError) throw feesError;
  
  return { student, attendance, fees };
};
