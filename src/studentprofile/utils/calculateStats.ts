import { AttendanceRecord, Student } from "../types";

export const calculateStats = (attendance: AttendanceRecord[], student: Student) => {
  const totalPresent = attendance.filter(a => a.status === 'present').length;
  const lecturesPerMonth = student.lectures_per_month || 12;
  const monthsCompleted = Math.floor(totalPresent / lecturesPerMonth);
  const currentCycleAttendance = totalPresent % lecturesPerMonth;
  const progressPercentage = (currentCycleAttendance / lecturesPerMonth) * 100;
  
  return {
    totalPresent,
    totalAbsent: attendance.filter(a => a.status === 'absent').length,
    monthsCompleted,
    currentCycleAttendance,
    progressPercentage,
    lecturesPerMonth
  };
};
