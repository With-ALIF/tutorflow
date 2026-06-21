export type AttendanceStatus = 'present' | 'absent' | 'cleared' | 'caught_up';

export interface AttendanceRecord {
  id: string;
  student_id: string;
  user_id: string;
  date: string;
  status: AttendanceStatus;
  created_at: string;
  shift?: 'Morning' | 'Evening' | string;
}

export type ActiveTab = 'mark' | 'history' | 'report' | 'calendar';
