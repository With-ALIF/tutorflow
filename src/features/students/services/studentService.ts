import { supabase } from "../../../lib/supabase";
import { Student, NewStudent } from "../types/student.types";

export const studentService = {
  async fetchStudents(): Promise<Student[]> {
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
      class_time: s.class_time || "",
      lectures_per_month: s.lectures_per_month || 0,
      lectures_per_week: s.lectures_per_week || 0
    })) as Student[];
  },

  async addStudent(student: NewStudent): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated. Please login again.");
    
    const cleanDate = (dateStr: string | undefined) => (!dateStr || dateStr.trim() === "") ? null : dateStr;

    const { error } = await supabase
      .from("students")
      .insert({
        name: student.name,
        class: student.class,
        phone: student.phone,
        monthly_fee: student.monthly_fee,
        join_date: cleanDate(student.join_date),
        address: student.address,
        subject: student.subject,
        photo: student.photo,
        status: student.status,
        end_date: cleanDate(student.end_date),
        telegram_chat_id: student.telegram_chat_id,
        class_days: student.class_days || [],
        class_time: student.class_time || "",
        lectures_per_month: student.lectures_per_month || 0,
        lectures_per_week: student.lectures_per_week || 0,
        user_id: user.id
      });
      
    if (error) throw error;
  },

  async updateStudent(student: Student): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    
    const cleanDate = (dateStr: string | undefined) => (!dateStr || dateStr.trim() === "") ? null : dateStr;

    const { error } = await supabase
      .from("students")
      .update({
        name: student.name,
        class: student.class,
        phone: student.phone,
        monthly_fee: student.monthly_fee,
        join_date: cleanDate(student.join_date),
        address: student.address,
        subject: student.subject,
        photo: student.photo,
        status: student.status,
        end_date: cleanDate(student.end_date),
        telegram_chat_id: student.telegram_chat_id,
        class_days: student.class_days || [],
        class_time: student.class_time || "",
        lectures_per_month: student.lectures_per_month || 0,
        lectures_per_week: student.lectures_per_week || 0
      })
      .eq("id", student.id)
      .eq("user_id", user.id);
      
    if (error) throw error;
  },

  async deleteStudent(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("students")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;
  }
};
