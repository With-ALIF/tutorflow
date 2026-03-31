import React from "react";
import { Calendar, History, UserCheck } from "lucide-react";
import { cn } from "../../lib/utils";

interface AttendanceTabsProps {
  activeTab: 'mark' | 'history' | 'report';
  setActiveTab: (tab: 'mark' | 'history' | 'report') => void;
}

export const AttendanceTabs = ({ activeTab, setActiveTab }: AttendanceTabsProps) => (
  <div className="flex flex-col sm:flex-row bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner w-full md:w-auto">
    <button 
      onClick={() => setActiveTab('mark')}
      className={cn(
        "flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex-1 sm:flex-none",
        activeTab === 'mark' 
          ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-md" 
          : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
      )}
    >
      <UserCheck className="w-4 h-4" />
      <span>Mark Daily</span>
    </button>
    <button 
      onClick={() => setActiveTab('history')}
      className={cn(
        "flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex-1 sm:flex-none",
        activeTab === 'history' 
          ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-md" 
          : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
      )}
    >
      <History className="w-4 h-4" />
      <span>History</span>
    </button>
    <button 
      onClick={() => setActiveTab('report')}
      className={cn(
        "flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex-1 sm:flex-none",
        activeTab === 'report' 
          ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-md" 
          : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
      )}
    >
      <Calendar className="w-4 h-4" />
      <span>Report</span>
    </button>
  </div>
);
