import React from "react";
import { cn } from "../../../../lib/utils";

interface MonthTabsProps {
  months: string[];
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
}

export const MonthTabs: React.FC<MonthTabsProps> = ({
  months,
  selectedMonth,
  setSelectedMonth,
}) => {
  return (
    <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/10 dark:bg-slate-800/10 overflow-x-auto flex items-center gap-3">
      {months.map((month) => (
        <button
          key={month}
          onClick={() => setSelectedMonth(month)}
          className={cn(
            "px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
            selectedMonth === month
              ? "bg-slate-900 dark:bg-emerald-500 text-white shadow-lg"
              : "bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600"
          )}
        >
          {month}
        </button>
      ))}
    </div>
  );
};
