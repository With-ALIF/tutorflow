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
  if (students.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-12 lg:p-20 border border-slate-200/60 dark:border-slate-700 shadow-sm text-center">
        <div className="flex flex-col items-center gap-4 max-w-xs mx-auto">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center text-slate-300 dark:text-slate-700 shadow-inner">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">No classes scheduled</h4>
            <p className="text-sm text-slate-400 font-medium">There are no batch routines defined for this day in your schedule.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {students.map((student) => (
        <StudentRow 
          key={student.id} 
          student={student} 
          currentStatus={records[student.id]} 
          onStatusChange={onStatusChange} 
        />
      ))}
    </div>
  );
};
