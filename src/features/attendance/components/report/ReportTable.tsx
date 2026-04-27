import React from "react";
import { Student } from "../../types/attendance.types";
import { ReportRow } from "./ReportRow";

interface ReportTableProps {
  students: Student[];
  reportData: Record<string, { present: number, absent: number }>;
}

export const ReportTable: React.FC<ReportTableProps> = ({ students, reportData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {students.map((student) => (
        <ReportRow 
          key={student.id} 
          student={student} 
          data={reportData[student.id] || { present: 0, absent: 0 }} 
        />
      ))}
      {students.length === 0 && (
        <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50/50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
          No students found for this month.
        </div>
      )}
    </div>
  );
};
