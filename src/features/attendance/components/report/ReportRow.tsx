import React from "react";
import { Student } from "../../types/attendance.types";
import { cn } from "../../../../lib/utils";

interface ReportRowProps {
  student: Student;
  data: { present: number, absent: number };
}

export const ReportRow: React.FC<ReportRowProps> = ({ student, data }) => {
  const total = data.present + data.absent;
  const percentage = total > 0 ? Math.round((data.present / total) * 100) : 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md group">
      <div className="flex items-center gap-4 mb-6">
        {student.photo ? (
          <img 
            src={student.photo} 
            alt={student.name} 
            className="w-14 h-14 rounded-2xl object-cover ring-4 ring-slate-50 dark:ring-slate-800" 
            referrerPolicy="no-referrer" 
          />
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-lg font-bold text-indigo-600 dark:text-indigo-400 ring-4 ring-slate-50 dark:ring-slate-800">
            {student.name.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <span className="font-bold text-slate-900 dark:text-white block text-lg truncate leading-tight">{student.name}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{student.class}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-emerald-50/50 dark:bg-emerald-500/5 p-4 rounded-2xl border border-emerald-100/50 dark:border-emerald-500/10">
          <span className="text-[10px] font-bold text-emerald-600/60 dark:text-emerald-400/60 uppercase tracking-widest block mb-1">Present</span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{data.present}</span>
        </div>
        <div className="bg-red-50/50 dark:bg-red-500/5 p-4 rounded-2xl border border-red-100/50 dark:border-red-500/10">
          <span className="text-[10px] font-bold text-red-600/60 dark:text-red-400/60 uppercase tracking-widest block mb-1">Absent</span>
          <span className="text-2xl font-black text-red-600 dark:text-red-400">{data.absent}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attendance Rate</span>
          <span className="text-sm font-black text-slate-900 dark:text-white">{percentage}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-1000",
              percentage >= 80 ? "bg-emerald-500" : percentage >= 50 ? "bg-orange-500" : "bg-red-500"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
