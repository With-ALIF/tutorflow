export type AttendanceStatus = 'present' | 'absent';

export interface AttendanceRecord {
  id: string;
  student_id: string;
  userId: string;
  date: string;
  status: AttendanceStatus;
  created_at: string;
}

export type ActiveTab = 'mark' | 'history' | 'report';
