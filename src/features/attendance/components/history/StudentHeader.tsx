import React from "react";
import { Student } from "../../types/attendance.types";

interface StudentHeaderProps {
  student: Student;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({ student }) => {
  return (
    <div className="p-8 border-b border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-emerald-500 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-emerald-500/20">
          {student.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{student.name}</h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest shadow-sm">
              {student.class}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{student.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
