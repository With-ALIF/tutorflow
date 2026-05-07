import { AttendanceRecord } from "../types/attendance.types";
import { format, parseISO } from "date-fns";

export const groupByMonth = (history: AttendanceRecord[]) => {
  return history.reduce((acc, record) => {
    const month = format(parseISO(record.date), "MMMM yyyy");
    if (!acc[month]) acc[month] = [];
    acc[month].push(record);
    return acc;
  }, {} as Record<string, AttendanceRecord[]>);
};
