import React from "react";
import { Student } from "../../types/attendance.types";

interface StudentHeaderProps {
  student: Student;
}

export function StudentHeader({ student }: StudentHeaderProps) {
  return (
    <div className="p-8 border-b border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        {student.photo ? (
          <img 
            src={student.photo} 
            alt={student.name} 
            className="w-14 h-14 rounded-2xl object-cover" 
            referrerPolicy="no-referrer" 
          />
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 flex items-center justify-center text-2xl font-bold text-emerald-500 shadow-sm">
            {student.name.charAt(0)}
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {student.name}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Detailed attendance logs and statistics.</p>
        </div>
      </div>
    </div>
  );
}
