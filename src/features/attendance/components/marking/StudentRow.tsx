import React from "react";
import { Student, AttendanceStatus } from "../../types/attendance.types";
import { StatusButtons } from "./StatusButtons";

interface StudentRowProps {
  student: Student;
  currentStatus: AttendanceStatus | undefined;
  caughtUpDate?: string;
  onStatusChange: (studentId: string, status: AttendanceStatus) => void;
}

export const StudentRow: React.FC<StudentRowProps> = ({ 
  student, 
  currentStatus, 
  caughtUpDate,
  onStatusChange 
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-4 sm:p-6 border border-slate-200/60 dark:border-slate-700 shadow-sm transition-all group relative">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {student.photo ? (
              <img 
                src={student.photo} 
                alt={student.name} 
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-[1.25rem] object-cover shadow-sm ring-2 ring-slate-50 dark:ring-slate-700 shrink-0" 
                referrerPolicy="no-referrer" 
              />
            ) : (
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[1.25rem] bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-lg font-black text-indigo-600 dark:text-indigo-400 transition-all shrink-0">
                {student.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <h4 className="font-black text-slate-900 dark:text-white text-base sm:text-lg tracking-tight leading-tight truncate" title={student.name}>{student.name}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Student</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1.5 text-right shrink-0">
            <span className="px-2.5 py-1 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-100 dark:border-slate-700 whitespace-nowrap">
              Class {student.class}
            </span>
            {student.batch && (
              <span className="text-[9px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest px-1 whitespace-nowrap">
                {student.batch}
              </span>
            )}
          </div>
        </div>

        <div className="pt-2">
          {currentStatus === 'caught_up' && caughtUpDate ? (
            <div className="w-full py-2.5 px-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-bold text-center rounded-xl border border-emerald-200 dark:border-emerald-500/20">
              Taken on {caughtUpDate}
              <button 
                onClick={() => onStatusChange(student.id, 'cleared')}
                 className="ml-3 text-[10px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 rounded-md hover:bg-emerald-200 dark:hover:bg-emerald-500/40"
              >
                Undo
              </button>
            </div>
          ) : (
            <StatusButtons 
              studentId={student.id} 
              currentStatus={currentStatus} 
              onStatusChange={onStatusChange} 
            />
          )}
        </div>
      </div>
    </div>
  );
};
