import React, { useState } from "react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  parseISO 
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AttendanceRecord } from "../../types/attendance.types";
import { cn } from "../../../../lib/utils";

interface CalendarViewProps {
  records: AttendanceRecord[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ records }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const getStatusForDay = (day: Date) => {
    const record = records.find(r => isSameDay(parseISO(r.date), day));
    return record?.status;
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-center gap-4 mb-10">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button 
            onClick={handlePrevMonth}
            className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all shadow-sm active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <button 
            onClick={handleNextMonth}
            className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all shadow-sm active:scale-95"
          >
            <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 sm:gap-4 mb-4">
        {weekDays.map(day => (
          <div key={day} className="text-center text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 sm:gap-4">
        {calendarDays.map((day, idx) => {
          const status = getStatusForDay(day);
          const isCurrentMonth = isSameMonth(day, monthStart);
          
          return (
            <div 
              key={idx}
              className={cn(
                "aspect-square flex flex-col items-center justify-center rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold transition-all border relative group",
                !isCurrentMonth ? "opacity-10 border-transparent" : "border-slate-100 dark:border-slate-700/50",
                status === 'present' && "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20 shadow-sm shadow-emerald-500/5",
                status === 'absent' && "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-500/20 shadow-sm shadow-red-500/5",
                !status && isCurrentMonth && "bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:border-slate-200 dark:hover:border-slate-600"
              )}
            >
              <span>{format(day, "d")}</span>
              {status && (
                <div className={cn(
                  "w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full mt-1",
                  status === 'present' ? "bg-emerald-500" : "bg-red-500"
                )} />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex items-center justify-center gap-8 text-[10px] font-bold uppercase tracking-widest border-t border-slate-100 dark:border-slate-700 pt-8">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
          <span className="text-slate-500 dark:text-slate-400">Present</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />
          <span className="text-slate-500 dark:text-slate-400">Absent</span>
        </div>
      </div>
    </div>
  );
};
