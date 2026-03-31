import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "../../../../lib/utils";
import { AttendanceRecord } from "../../types/attendance.types";

interface RecordCardProps {
  record: AttendanceRecord;
}

export const RecordCard: React.FC<RecordCardProps> = ({ record }) => {
  return (
    <div 
      className={cn(
        "flex items-center justify-between p-5 rounded-2xl border-2 transition-all hover:scale-[1.02]",
        record.status === 'present' 
          ? "bg-emerald-50/30 dark:bg-emerald-500/5 border-emerald-100/50 dark:border-emerald-500/20" 
          : "bg-red-50/30 dark:bg-red-500/5 border-red-100/50 dark:border-red-500/20"
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm",
          record.status === 'present' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
        )}>
          {record.status === 'present' ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-200">
            {format(parseISO(record.date), "MMMM d, yyyy")}
          </p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
            {format(parseISO(record.date), "EEEE")}
          </p>
        </div>
      </div>
      <span className={cn(
        "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
        record.status === 'present' ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
      )}>
        {record.status}
      </span>
    </div>
  );
};
