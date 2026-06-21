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
      monthly_fee: s.monthly_fee || s.monthlyfee || 0,
      guardian_name: s.guardian_name || s.guardianname || "",
      join_date: s.join_date || s.joindate || s.created_at || "",
      telegram_chat_id: s.telegram_chat_id || s.telegramchatid || "",
      end_date: s.end_date || s.enddate || "",
      photo: s.photo || "",
      status: s.status || "active",
      class_days: s.class_days || s.classdays || [],
      lectures_per_month: s.lectures_per_month || s.lecturespermonth || 0,
      lectures_per_week: s.lectures_per_week || s.lecturesperweek || 0
    })) as Student[];
  },

  async addStudent(student: NewStudent): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated. Please login again.");
    
    const cleanDate = (dateStr: string | undefined) => (!dateStr || dateStr.trim() === "") ? null : dateStr;

    const insertData: any = {
      name: student.name,
      class: student.class,
      phone: student.phone,
      batch: student.batch,
      monthly_fee: student.monthly_fee,
      join_date: cleanDate(student.join_date),
      address: student.address,
      subject: student.subject,
      guardian_name: student.guardian_name,
      photo: student.photo,
      status: student.status,
      end_date: cleanDate(student.end_date),
      telegram_chat_id: student.telegram_chat_id,
      class_days: student.class_days || [],
      lectures_per_month: student.lectures_per_month || 0,
      lectures_per_week: student.lectures_per_week || 0,
      user_id: user.id
    };

    if (student.id && student.id.trim() !== "") {
      insertData.id = student.id;
    }

    const { error } = await supabase
      .from("students")
      .insert(insertData);
      
    if (error) {
      if (error.code === '42703' || error.code === 'PGRST204' || error.message?.includes('column')) { // Try lowercase fallback
        const lowercaseData: any = {
          name: student.name,
          class: student.class,
          phone: student.phone,
          batch: student.batch,
          monthlyfee: student.monthly_fee,
          joindate: cleanDate(student.join_date),
          address: student.address,
          subject: student.subject,
          guardianname: student.guardian_name,
          photo: student.photo,
          status: student.status,
          enddate: cleanDate(student.end_date),
          telegramchatid: student.telegram_chat_id,
          classdays: student.class_days || [],
          lecturespermonth: student.lectures_per_month || 0,
          lecturesperweek: student.lectures_per_week || 0,
          user_id: user.id
        };
        let { error: secondError } = await supabase.from("students").insert(lowercaseData);
        if (secondError && (secondError.code === '42703' || secondError.code === 'PGRST204' || secondError.message?.includes('column'))) {
           console.warn("Database schema missing new columns (photo, etc). Falling back to minimal data.");
           // Fallback 3: Try without missing optional fields
           const minimalData: any = {
              name: student.name,
              class: student.class,
              phone: student.phone,
              batch: student.batch,
              monthlyfee: student.monthly_fee,
              joindate: cleanDate(student.join_date),
              address: student.address,
              subject: student.subject,
              guardianname: student.guardian_name,
              user_id: user.id
           };
           const { error: thirdError } = await supabase.from("students").insert(minimalData);
           if (thirdError) throw thirdError;
        } else if (secondError) {
           throw secondError;
        }
      } else {
        throw error;
      }
    }
  },

  async updateStudent(student: Student): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    
    const cleanDate = (dateStr: string | undefined) => (!dateStr || dateStr.trim() === "") ? null : dateStr;

    const updateData: any = {
      name: student.name,
      class: student.class,
      phone: student.phone,
      batch: student.batch,
      monthly_fee: student.monthly_fee,
      join_date: cleanDate(student.join_date),
      address: student.address,
      subject: student.subject,
      guardian_name: student.guardian_name,
      photo: student.photo,
      status: student.status,
      end_date: cleanDate(student.end_date),
      telegram_chat_id: student.telegram_chat_id,
      class_days: student.class_days || [],
      lectures_per_month: student.lectures_per_month || 0,
      lectures_per_week: student.lectures_per_week || 0
    };
    
    let { error } = await supabase
      .from("students")
      .update(updateData)
      .eq("id", student.id)
      .eq("user_id", user.id);
      
    if (error && (error.code === '42703' || error.code === 'PGRST204' || error.message?.includes('column'))) {
      const lowercaseUpdate: any = {
        name: student.name,
        class: student.class,
        phone: student.phone,
        batch: student.batch,
        monthlyfee: student.monthly_fee,
        joindate: cleanDate(student.join_date),
        address: student.address,
        subject: student.subject,
        guardianname: student.guardian_name,
        photo: student.photo,
        status: student.status,
        enddate: cleanDate(student.end_date),
        telegramchatid: student.telegram_chat_id,
        classdays: student.class_days || [],
        lecturespermonth: student.lectures_per_month || 0,
        lecturesperweek: student.lectures_per_week || 0
      };
      let { error: secondError } = await supabase
        .from("students")
        .update(lowercaseUpdate)
        .eq("id", student.id)
        .eq("user_id", user.id);
        
      if (secondError && (secondError.code === '42703' || secondError.code === 'PGRST204' || secondError.message?.includes('column'))) {
         console.warn("Database schema missing new columns (photo, etc). Falling back to minimal update.");
         const minimalUpdate: any = {
           name: student.name,
           class: student.class,
           phone: student.phone,
           batch: student.batch,
           monthlyfee: student.monthly_fee,
           joindate: cleanDate(student.join_date),
           address: student.address,
           subject: student.subject,
           guardianname: student.guardian_name
         };
         const { error: thirdError } = await supabase
           .from("students")
           .update(minimalUpdate)
           .eq("id", student.id)
           .eq("user_id", user.id);
         error = thirdError;
      } else {
         error = secondError;
      }
    }

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
