import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import { Student } from "../types";

interface StudentRowProps {
  key?: string | number;
  student: Student;
  status?: 'present' | 'absent';
  onStatusChange: (status: 'present' | 'absent') => void;
}

export const StudentRow = ({ student, status, onStatusChange }: StudentRowProps) => (
  <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-700/30 transition-colors group">
    <td className="px-8 py-5">
      <div className="flex items-center gap-4">
        {student.photo ? (
          <img src={student.photo} alt={student.name} className="w-10 h-10 rounded-xl object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
            {student.name.charAt(0)}
          </div>
        )}
        <span className="font-bold text-slate-900 dark:text-white">{student.name}</span>
      </div>
    </td>
    <td className="px-8 py-5">
      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full text-[10px] font-bold uppercase tracking-widest">{student.class}</span>
    </td>
    <td className="px-8 py-5">
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        <button 
          onClick={() => onStatusChange('present')}
          className={cn(
            "flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2.5 rounded-2xl text-[10px] sm:text-xs font-bold transition-all border-2",
            status === 'present'
              ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30 scale-105"
              : "bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800 hover:text-emerald-600 dark:hover:text-emerald-400 active:scale-95"
          )}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Present</span>
        </button>
        <button 
          onClick={() => onStatusChange('absent')}
          className={cn(
            "flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2.5 rounded-2xl text-[10px] sm:text-xs font-bold transition-all border-2",
            status === 'absent'
              ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/30 scale-105"
              : "bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-800 hover:text-red-600 dark:hover:text-red-400 active:scale-95"
          )}
        >
          <XCircle className="w-4 h-4" />
          <span>Absent</span>
        </button>
      </div>
    </td>
  </tr>
);
