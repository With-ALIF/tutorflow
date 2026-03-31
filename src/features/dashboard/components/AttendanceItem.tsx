import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "../../../lib/utils";

interface AttendanceItemProps {
  key?: string | number;
  activity: any;
}

export const AttendanceItem = ({ activity }: AttendanceItemProps) => (
  <div className="flex items-center gap-4">
    <div className={cn(
      "w-10 h-10 rounded-xl flex items-center justify-center",
      activity.status === 'present' 
        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
        : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
    )}>
      {activity.status === 'present' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
    </div>
    <div className="flex-1">
      <p className="text-sm font-bold text-slate-900 dark:text-white">{activity.studentName}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{activity.date}</p>
    </div>
    <div className="text-right">
      <span className={cn(
        "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg",
        activity.status === 'present'
          ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
      )}>
        {activity.status}
      </span>
    </div>
  </div>
);
