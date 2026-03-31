export interface Student {
  id: string;
  name: string;
  class: string;
  phone: string;
  monthly_fee?: number;
  lectures_per_month?: number;
  photo?: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  userId: string;
  date: string;
  status: 'present' | 'absent';
  created_at: string;
}

export type AttendanceStatus = 'present' | 'absent';
export type ActiveTab = 'mark' | 'history' | 'report';
