import React from "react";
import { UserCheck } from "lucide-react";

export const AttendanceHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/40 transform -rotate-6">
          <UserCheck className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Attendance</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
            Student Presence Management
          </p>
        </div>
      </div>
    </div>
  );
};
