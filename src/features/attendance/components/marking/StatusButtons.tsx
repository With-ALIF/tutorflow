import React from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";
import { cn } from "../../../../lib/utils";
import { AttendanceStatus } from "../../types/attendance.types";

interface StatusButtonsProps {
  studentId: string;
  currentStatus: AttendanceStatus | undefined;
  onStatusChange: (studentId: string, status: AttendanceStatus) => void;
}

export const StatusButtons: React.FC<StatusButtonsProps> = ({ 
  studentId, 
  currentStatus, 
  onStatusChange 
}) => {
  return (
    <div className="flex items-center gap-2 w-full">
      <button 
        onClick={() => onStatusChange(studentId, currentStatus === 'present' ? 'cleared' : 'present')}
        className={cn(
          "flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all border-2",
          currentStatus === 'present'
            ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/30 scale-[1.02]"
            : "bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-95"
        )}
      >
        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
        <span className="whitespace-nowrap">Present</span>
      </button>
      <button 
        onClick={() => onStatusChange(studentId, currentStatus === 'absent' ? 'cleared' : 'absent')}
        className={cn(
          "flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all border-2",
          currentStatus === 'absent'
            ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/30 scale-[1.02]"
            : "bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-800 hover:text-red-600 dark:hover:text-red-400 active:scale-95"
        )}
      >
        <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
        <span className="whitespace-nowrap">Absent</span>
      </button>

      {currentStatus && currentStatus !== 'cleared' && (
        <button 
          onClick={() => onStatusChange(studentId, 'cleared')}
          className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-xl transition-all active:scale-90 flex items-center justify-center border border-slate-200/50 dark:border-slate-700/50 shrink-0"
          title="Clear status (unmark)"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
