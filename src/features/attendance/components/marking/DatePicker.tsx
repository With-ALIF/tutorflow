import React from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  date: string;
  setDate: (date: string) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ date, setDate }) => {
  const changeDate = (days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    setDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="flex items-center gap-3 sm:gap-4 bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm w-full sm:w-auto">
      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
        <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      <div className="flex-1 flex items-center gap-1 sm:gap-2 min-w-0">
        <button onClick={() => changeDate(-1)} className="p-1.5 sm:p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg shrink-0">
          <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 dark:text-slate-300" />
        </button>
        <div className="flex-1 min-w-0 px-1 sm:px-2">
          <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 truncate">Attendance Date</p>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-transparent border-none p-0 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:ring-0 w-full min-w-0"
          />
        </div>
        <button onClick={() => changeDate(1)} className="p-1.5 sm:p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg shrink-0">
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 dark:text-slate-300" />
        </button>
      </div>
    </div>
  );
};
