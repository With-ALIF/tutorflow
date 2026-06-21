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
  return data as Student[];
};
