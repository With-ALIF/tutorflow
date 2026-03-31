import React from "react";
import { Student } from "../../types/attendance.types";
import { ReportRow } from "./ReportRow";

interface ReportTableProps {
  students: Student[];
  reportData: Record<string, { present: number, absent: number }>;
}

export const ReportTable: React.FC<ReportTableProps> = ({ students, reportData }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-widest font-bold border-b border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30">
            <th className="px-8 py-5">Student</th>
            <th className="px-8 py-5 text-center">Present</th>
            <th className="px-8 py-5 text-center">Absent</th>
            <th className="px-8 py-5 text-center">Attendance %</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
          {students.map((student) => (
            <ReportRow 
              key={student.id} 
              student={student} 
              data={reportData[student.id] || { present: 0, absent: 0 }} 
            />
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan={4} className="px-8 py-12 text-center text-slate-500">
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
