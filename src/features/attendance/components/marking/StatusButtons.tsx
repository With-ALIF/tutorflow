import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
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
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      <button 
        onClick={() => onStatusChange(studentId, 'present')}
        className={cn(
          "flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2.5 rounded-2xl text-[10px] sm:text-xs font-bold transition-all border-2",
          currentStatus === 'present'
            ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/30 scale-105"
            : "bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-95"
        )}
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>Present</span>
      </button>
      <button 
        onClick={() => onStatusChange(studentId, 'absent')}
        className={cn(
          "flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2.5 rounded-2xl text-[10px] sm:text-xs font-bold transition-all border-2",
          currentStatus === 'absent'
            ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/30 scale-105"
            : "bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-800 hover:text-red-600 dark:hover:text-red-400 active:scale-95"
        )}
      >
        <XCircle className="w-4 h-4" />
        <span>Absent</span>
      </button>
    </div>
  );
};
