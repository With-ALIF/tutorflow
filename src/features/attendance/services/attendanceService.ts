import { supabase } from "../../../lib/supabase";
import { AttendanceStatus } from "../types/attendance.types";

export const fetchDailyAttendance = async (date: string, shift?: 'Morning' | 'Evening'): Promise<Record<string, AttendanceStatus>> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return {};

  let query = supabase
    .from("attendance")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", date);
  
  if (shift) {
    query = query.eq("shift", shift);
  }

  const { data, error } = await query;
  if (error) throw error;

  const records: Record<string, AttendanceStatus> = {};
  data.forEach(record => {
    const key = shift ? record.student_id : `${record.student_id}_${record.shift}`;
    records[key] = record.status;
  });
  return records;
};

export const saveAttendance = async (studentId: string, date: string, shift: 'Morning' | 'Evening' | string, status: AttendanceStatus | 'cleared') => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  if (status === 'cleared') {
    const { error } = await supabase
      .from("attendance")
      .delete()
      .eq("student_id", studentId)
      .eq("date", date)
      .eq("shift", shift)
      .eq("user_id", user.id);
    if (error) throw error;
  } else {
    // We don't force an ID so the DB can generate a UUID. 
    // We use student_id, date, shift for identification in the DB (requires a unique constraint on these columns).
    // If the user hasn't added the constraint yet, this might create duplicates, 
    // but it's better than crashing on invalid UUID.
    const { error } = await supabase
      .from("attendance")
      .upsert({
        student_id: studentId,
        user_id: user.id,
        date,
        shift,
        status,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'student_id,date,shift'
      });
    
    // Fallback if the unique constraint is missing
    if (error && error.code === '42703') { // column does not exist or similar error if onConflict is unsupported without index
       // try simple insert if they don't have the index yet
       const { error: insertError } = await supabase
        .from("attendance")
        .insert({
          student_id: studentId,
          user_id: user.id,
          date,
          shift,
          status,
          created_at: new Date().toISOString()
        });
       if (insertError) throw insertError;
    } else if (error) {
      throw error;
    }
  }
};

export const markAsCaughtUp = async (studentIds: string[], originalDate: string, caughtUpDate: string, shift: 'Morning' | 'Evening') => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const records = studentIds.map(studentId => ({
    student_id: studentId,
    user_id: user.id,
    date: originalDate,
    shift: `CaughtUp_${caughtUpDate}_${shift}`,
    status: 'caught_up',
    created_at: new Date().toISOString()
  }));

  const { error } = await supabase
    .from("attendance")
    .upsert(records, { onConflict: 'student_id,date,shift' });

  if (error && error.code === '42703') {
    const { error: insertError } = await supabase.from("attendance").insert(records);
    if (insertError) throw insertError;
  } else if (error) {
    throw error;
  }
};

export const addFee = async (studentId: string, amount: number, date: string, month: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("fees")
    .insert({
      student_id: studentId,
      user_id: user.id,
      amount,
      payment_date: date,
      fee_month: month,
      status: 'due',
      created_at: new Date().toISOString()
    });
  if (error) throw error;
};
