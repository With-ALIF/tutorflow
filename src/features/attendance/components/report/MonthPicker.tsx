import React from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface MonthPickerProps {
  reportMonth: string;
  setReportMonth: (month: string) => void;
}

export const MonthPicker: React.FC<MonthPickerProps> = ({ reportMonth, setReportMonth }) => {
  const handleMonthChange = (offset: number) => {
    const [year, month] = reportMonth.split('-');
    const d = new Date(parseInt(year), parseInt(month) - 1 + offset);
    setReportMonth(format(d, "yyyy-MM"));
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3 bg-white dark:bg-slate-800 p-2 sm:p-2.5 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm w-full sm:w-auto overflow-hidden">
      <button 
        onClick={() => handleMonthChange(-1)}
        className="p-2 sm:p-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-slate-400 dark:text-slate-500 transition-colors active:scale-90"
      >
        <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      <div className="flex-1 flex items-center gap-2 sm:gap-3 px-2 sm:px-4 border-x border-slate-100 dark:border-slate-700 min-w-0">
        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 shrink-0" />
        <input 
          type="month" 
          className="font-bold text-xs sm:text-sm md:text-base text-slate-700 dark:text-slate-300 focus:outline-none bg-transparent w-full min-w-0"
          value={reportMonth}
          onChange={(e) => setReportMonth(e.target.value)}
        />
      </div>
      <button 
        onClick={() => handleMonthChange(1)}
        className="p-2 sm:p-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-slate-400 dark:text-slate-500 transition-colors active:scale-90"
      >
        <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
};
