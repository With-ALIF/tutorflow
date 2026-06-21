import React from "react";
import { motion } from "motion/react";
import { Clock, Download } from "lucide-react";

export const AttendanceProgress = ({ 
  progressPercentage, 
  monthsCompleted, 
  lecturesPerMonth, 
  currentCycleAttendance, 
  totalPresent, 
  onDownload,
  onDownloadRunning
}: { 
  progressPercentage: number, 
  monthsCompleted: number, 
  lecturesPerMonth: number, 
  currentCycleAttendance: number, 
  totalPresent: number, 
  onDownload: () => void,
  onDownloadRunning: () => void 
}) => (
  <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 shadow-sm p-6 sm:p-8">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 shrink-0 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <Clock className="w-6 h-6" />
        </div>
        <div className="min-w-0">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight truncate">Attendance Progress</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">Current academic cycle tracking</p>
        </div>
      </div>
      
      <div className="bg-indigo-50/50 dark:bg-indigo-500/10 px-4 py-2.5 rounded-2xl border border-indigo-100/50 dark:border-indigo-500/10 shrink-0 self-start sm:self-auto">
        <span className="text-[9px] font-bold text-indigo-500/70 dark:text-indigo-400/70 uppercase tracking-widest block mb-0.5">Cycle Progress</span>
        <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 leading-none">
          {currentCycleAttendance} <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold">/ {lecturesPerMonth}</span>
        </p>
      </div>
    </div>

    {/* Dedicated action button row directly below the cycle progress */}
    <div className="flex flex-col sm:flex-row gap-3 pb-6 border-b border-dashed border-slate-200/40 dark:border-slate-700/60 mb-6">
      <button 
        onClick={onDownload}
        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700/50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-600/50 rounded-xl text-xs font-bold transition-all active:scale-95"
        title="Download full cumulative attendance ledger"
      >
        <Download className="w-3.5 h-3.5" />
        Download Full History
      </button>
      <button 
        onClick={onDownloadRunning}
        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/10 active:scale-95"
        title="Download running cycle progress report with routine days"
      >
        <Download className="w-3.5 h-3.5" />
        Download Active Month Report
      </button>
    </div>

    <div className="mb-10">
      <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-600 p-1">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.4)]"
        />
      </div>
      <div className="flex justify-between mt-3">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{monthsCompleted} Months Completed</p>
        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">{lecturesPerMonth - currentCycleAttendance} more to next month</p>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4">
      <div className="bg-slate-50/50 dark:bg-slate-700/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/60 flex flex-col">
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1">Total Lectures Attended</p>
        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">{totalPresent}</p>
      </div>
    </div>
  </div>
);
