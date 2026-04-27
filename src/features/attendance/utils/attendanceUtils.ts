import { Student } from "../types/attendance.types";

export const getAttendanceCount = (
  attendance: any[],
  studentId: string,
  status: 'present' | 'absent'
): number => {
  return attendance.filter(a => a.student_id === studentId && a.status === status).length;
};

export const hasFeeForMonth = (
  fees: any[],
  studentId: string,
  month: string
): boolean => {
  return fees.some(f => f.student_id === studentId && f.fee_month === month);
};

export const isEligibleForFee = (
  count: number,
  lecturesPerMonth: number
): boolean => {
  return count > 0 && count % lecturesPerMonth === 0;
};
