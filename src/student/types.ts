// src/student/types.ts
export interface Student {
  id: string;
  name: string;
  class: string;
  photo?: string;
  email: string;
  phone: string;
  address: string;
  attendanceRate: number;
  dueFees: number;
}
