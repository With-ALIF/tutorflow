import React from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface DateSelectorProps {
  date: string;
  setDate: (date: string) => void;
}

export const DateSelector = ({ date, setDate }: DateSelectorProps) => (
  <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2.5 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm">
    <button 
      onClick={() => {
        const d = new Date(date);
        d.setDate(d.getDate() - 1);
        setDate(format(d, "yyyy-MM-dd"));
      }}
      className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-slate-400 dark:text-slate-500 transition-colors active:scale-90"
    >
      <ChevronLeft className="w-5 h-5" />
    </button>
    <div className="flex items-center gap-3 px-4 border-x border-slate-100 dark:border-slate-700">
      <Calendar className="w-5 h-5 text-emerald-500" />
      <input 
        type="date" 
        className="font-bold text-slate-700 dark:text-slate-300 focus:outline-none bg-transparent"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
    </div>
    <button 
      onClick={() => {
        const d = new Date(date);
        d.setDate(d.getDate() + 1);
        setDate(format(d, "yyyy-MM-dd"));
      }}
      className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-slate-400 dark:text-slate-500 transition-colors active:scale-90"
    >
      <ChevronRight className="w-5 h-5" />
    </button>
  </div>
);
