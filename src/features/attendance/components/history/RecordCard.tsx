import React from "react";
import { CheckCircle2, XCircle, ArrowLeftRight } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "../../../../lib/utils";
import { AttendanceRecord } from "../../types/attendance.types";

interface RecordCardProps {
  record: AttendanceRecord;
}

export const RecordCard: React.FC<RecordCardProps> = ({ record }) => {
  const isCaughtUp = record.status === 'caught_up';
  
  let caughtUpLabel = "";
  if (isCaughtUp && record.shift && record.shift.startsWith("CaughtUp_")) {
    try {
      const parts = record.shift.split('_');
      const dateStr = parts[1]; // YYYY-MM-DD
      const timeShift = parts[2] || "Morning";
      caughtUpLabel = `Makeup for ${dateStr} (${timeShift})`;
    } catch (e) {
      caughtUpLabel = "Taken elsewhere";
    }
  }

  return (
    <div 
      className={cn(
        "flex items-center justify-between p-5 rounded-2xl border-2 transition-all hover:scale-[1.02]",
        isCaughtUp
          ? "bg-orange-50/30 dark:bg-orange-500/5 border-orange-100/50 dark:border-orange-500/20"
          : record.status === 'present' 
            ? "bg-emerald-50/30 dark:bg-emerald-500/5 border-emerald-100/50 dark:border-emerald-500/20" 
            : "bg-red-50/30 dark:bg-red-500/5 border-red-100/50 dark:border-red-500/20"
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm",
          isCaughtUp 
            ? "bg-orange-500 text-white"
            : record.status === 'present' 
              ? "bg-emerald-500 text-white" 
              : "bg-red-500 text-white"
        )}>
          {isCaughtUp ? (
            <ArrowLeftRight className="w-6 h-6" />
          ) : record.status === 'present' ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : (
            <XCircle className="w-6 h-6" />
          )}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-200">
            {format(parseISO(record.date), "MMMM d, yyyy")}
          </p>
          <div className="flex flex-col gap-0.5 mt-0.5">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
              {format(parseISO(record.date), "EEEE")}
            </span>
            {caughtUpLabel && (
              <span className="text-[10px] text-orange-600 dark:text-orange-400 font-extrabold uppercase tracking-wider">
                {caughtUpLabel}
              </span>
            )}
          </div>
        </div>
      </div>
      <span className={cn(
        "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
        isCaughtUp
          ? "text-orange-600 dark:text-orange-400"
          : record.status === 'present' 
            ? "text-emerald-600 dark:text-emerald-400" 
            : "text-red-600 dark:text-red-400"
      )}>
        {isCaughtUp ? "CAUGHT UP" : record.status}
      </span>
    </div>
  );
};
