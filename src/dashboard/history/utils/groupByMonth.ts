import { format, parseISO } from "date-fns";
import { AttendanceRecord } from "../../types/attendance.types";

export function groupByMonth(records: AttendanceRecord[]): Record<string, AttendanceRecord[]> {
  return records.reduce((acc, record) => {
    const month = format(parseISO(record.date), "MMMM yyyy");
    if (!acc[month]) acc[month] = [];
    acc[month].push(record);
    return acc;
  }, {} as Record<string, AttendanceRecord[]>);
}
