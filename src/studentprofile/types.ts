export interface Student {
  id: string;
  name: string;
  class: string;
  phone: string;
  subject: string;
  address: string;
  monthly_fee: number;
  lectures_per_month: number;
  lectures_per_week: number;
  class_days: string[];
  join_date: string;
  photo?: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  date: string;
  status: 'present' | 'absent';
}

export interface FeeRecord {
  id: string;
  student_id: string;
  payment_date: string;
  amount: number;
  status: 'paid' | 'pending';
}
