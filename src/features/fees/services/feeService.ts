import { supabase } from "../../../lib/supabase";
import { Student } from "../../../types/student";
import { FeeRecord } from "../../../types/fee";

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

export const fetchFees = async (studentsData: Student[]): Promise<FeeRecord[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  
  const { data, error } = await supabase
    .from("fees")
    .select("*")
    .eq("user_id", user.id);
    
  if (error) throw error;
  
  return data
    .map((fee: any) => {
      const student = studentsData.find(s => s.id === fee.student_id);
      return {
        ...fee,
        students: student ? { 
          name: student.name, 
          photo: student.photo,
          join_date: student.join_date 
        } : null
      };
    })
    .filter((fee: any) => fee.students !== null)
    .sort((a: any, b: any) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime()) as FeeRecord[];
};

export const updateFeeStatus = async (id: string, status: 'paid' | 'unpaid'): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  
  const { error } = await supabase
    .from("fees")
    .update({
      status,
      payment_date: new Date().toISOString().split('T')[0]
    })
    .eq("id", id)
    .eq("user_id", user.id);
    
  if (error) throw error;
};

export const markFeeAsPaid = async (id: string): Promise<void> => {
  await updateFeeStatus(id, 'paid');
};

export const markFeeAsUnpaid = async (id: string): Promise<void> => {
  await updateFeeStatus(id, 'unpaid');
};

export const deleteFee = async (id: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  
  const { error } = await supabase
    .from("fees")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
    
  if (error) throw error;
};

export const updatePayment = async (id: string, paymentData: any): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  
  const { error } = await supabase
    .from("fees")
    .update({
      ...paymentData
    })
    .eq("id", id)
    .eq("user_id", user.id);
    
  if (error) throw error;
};

export const addPayment = async (paymentData: any): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  
  const { error } = await supabase
    .from("fees")
    .insert({
      ...paymentData,
      user_id: user.id,
      created_at: new Date().toISOString()
    });
    
  if (error) throw error;
};
