import React from "react";
import { Student, AttendanceStatus } from "../../types/attendance.types";
import { StatusButtons } from "./StatusButtons";

interface StudentRowProps {
  student: Student;
  currentStatus: AttendanceStatus | undefined;
  onStatusChange: (studentId: string, status: AttendanceStatus) => void;
}

export const StudentRow: React.FC<StudentRowProps> = ({ 
  student, 
  currentStatus, 
  onStatusChange 
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-slate-200/60 dark:border-slate-700 shadow-sm transition-all group relative">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {student.photo ? (
              <img 
                src={student.photo} 
                alt={student.name} 
                className="w-14 h-14 rounded-[1.25rem] object-cover shadow-sm ring-2 ring-slate-50 dark:ring-slate-700" 
                referrerPolicy="no-referrer" 
              />
            ) : (
              <div className="w-14 h-14 rounded-[1.25rem] bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-lg font-black text-indigo-600 dark:text-indigo-400 transition-all">
                {student.name.charAt(0)}
              </div>
            )}
            <div>
              <h4 className="font-black text-slate-900 dark:text-white text-lg tracking-tight leading-tight">{student.name}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Student</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2 text-right">
            <span className="px-3 py-1 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-100 dark:border-slate-700">
              Class {student.class}
            </span>
            {student.batch && (
              <span className="text-[9px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest px-1">
                {student.batch}
              </span>
            )}
          </div>
        </div>

        <div className="pt-2">
          <StatusButtons 
            studentId={student.id} 
            currentStatus={currentStatus} 
            onStatusChange={onStatusChange} 
          />
        </div>
      </div>
    </div>
  );
};
