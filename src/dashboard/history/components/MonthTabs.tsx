import React from "react";
import { cn } from "../../../lib/utils";

interface MonthTabsProps {
  months: string[];
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
}

export function MonthTabs({ months, selectedMonth, setSelectedMonth }: MonthTabsProps) {
  return (
    <div className="flex gap-2 p-4 border-b border-slate-100 dark:border-slate-700 overflow-x-auto">
      {months.map(month => (
        <button
          key={month}
          onClick={() => setSelectedMonth(month)}
          className={cn(
            "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all",
            selectedMonth === month 
              ? "bg-emerald-500 text-white shadow-md" 
              : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
          )}
        >
          {month}
        </button>
      ))}
    </div>
  );
}
