import React from "react";
import { Calendar } from "lucide-react";

interface DatePickerProps {
  date: string;
  setDate: (date: string) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ date, setDate }) => {
  return (
    <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm">
      <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
        <Calendar className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Attendance Date</p>
        <input 
          type="date" 
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-transparent border-none p-0 text-sm font-bold text-slate-900 dark:text-white focus:ring-0 w-full"
        />
      </div>
    </div>
  );
};
