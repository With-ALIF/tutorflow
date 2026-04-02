import React from "react";
import { motion } from "motion/react";
import { Clock, Download } from "lucide-react";

export const AttendanceProgress = ({ 
  progressPercentage, 
  monthsCompleted, 
  lecturesPerMonth, 
  currentCycleAttendance, 
  totalPresent, 
  totalAbsent, 
  onDownload 
}: { 
  progressPercentage: number, 
  monthsCompleted: number, 
  lecturesPerMonth: number, 
  currentCycleAttendance: number, 
  totalPresent: number, 
  totalAbsent: number, 
  onDownload: () => void 
}) => (
  <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 shadow-sm p-8">
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Attendance Progress</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Current academic cycle tracking</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <button 
          onClick={onDownload}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold transition-colors"
        >
          <Download className="w-4 h-4" />
          PDF
        </button>
        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Cycle Progress</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{currentCycleAttendance} <span className="text-slate-300 dark:text-slate-600 text-sm font-medium">/ {lecturesPerMonth}</span></p>
        </div>
      </div>
    </div>

    <div className="mb-10">
      <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-600 p-1">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]"
        />
      </div>
      <div className="flex justify-between mt-3">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{monthsCompleted} Months Completed</p>
        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">{lecturesPerMonth - currentCycleAttendance} more to next month</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-slate-50/50 dark:bg-slate-700/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-600 flex flex-col">
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1">Total Present</p>
        <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">{totalPresent}</p>
      </div>
      <div className="bg-slate-50/50 dark:bg-slate-700/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-600 flex flex-col">
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1">Total Absent</p>
        <p className="text-3xl font-bold text-red-600 dark:text-red-400 tracking-tight">{totalAbsent}</p>
      </div>
    </div>
  </div>
);
