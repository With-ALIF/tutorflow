import React from "react";
import { Student, AttendanceStatus } from "../../types/attendance.types";
import { StudentRow } from "./StudentRow";

interface AttendanceTableProps {
  students: Student[];
  records: Record<string, AttendanceStatus>;
  onStatusChange: (studentId: string, status: AttendanceStatus) => void;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({ 
  students, 
  records, 
  onStatusChange 
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-widest font-bold border-b border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30">
            <th className="px-8 py-5">Student</th>
            <th className="px-8 py-5">Class</th>
            <th className="px-8 py-5 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
          {students.map((student) => (
            <StudentRow 
              key={student.id} 
              student={student} 
              currentStatus={records[student.id]} 
              onStatusChange={onStatusChange} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
