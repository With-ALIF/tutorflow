import { supabase } from "../../../lib/supabase";
import { Student } from "../types/attendance.types";

export const fetchStudents = async (): Promise<Student[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("user_id", user.id);
    
  if (error) throw error;
  if (!data) return [];

  return (data as any[]).map(s => ({
    ...s,
    monthly_fee: s.monthly_fee || 0,
    join_date: s.join_date || s.created_at || "",
    telegram_chat_id: s.telegram_chat_id || "",
    end_date: s.end_date || "",
    photo: s.photo || "",
    status: s.status || "active",
    class_days: s.class_days || [],
    lectures_per_month: s.lectures_per_month || 0,
    lectures_per_week: s.lectures_per_week || 0
  })) as Student[];
};
