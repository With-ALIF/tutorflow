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
import { motion } from "motion/react";
import { AttendanceRecord, Student } from "../../types/attendance.types";
import { cn } from "../../../../lib/utils";

interface CalendarViewProps {
  records: AttendanceRecord[];
  students?: Student[];
  fallbackStudent?: Student;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ records, students = [], fallbackStudent }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

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

  const getRecordsForDay = (day: Date) => {
    return records.filter(r => isSameDay(parseISO(r.date), day));
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
          const dayRecords = getRecordsForDay(day);
          const isCurrentMonth = isSameMonth(day, monthStart);
          
          let overallStatus: 'present' | 'absent' | 'caught_up' | undefined = undefined;
          if (dayRecords.length > 0) {
            const hasPresent = dayRecords.some(r => r.status === 'present');
            const hasCaughtUp = dayRecords.some(r => r.status === 'caught_up');
            const hasAbsent = dayRecords.some(r => r.status === 'absent');
            if (hasPresent) {
              overallStatus = 'present';
            } else if (hasCaughtUp) {
              overallStatus = 'caught_up';
            } else if (hasAbsent) {
              overallStatus = 'absent';
            }
          }
          
          return (
            <button 
              key={idx}
              onClick={() => isCurrentMonth && setSelectedDay(day)}
              className={cn(
                "aspect-square flex flex-col items-center justify-center rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold transition-all border relative group min-h-0 overflow-hidden",
                !isCurrentMonth ? "opacity-10 border-transparent cursor-default" : "border-slate-100 dark:border-slate-700/50 hover:border-indigo-200 dark:hover:border-indigo-800",
                overallStatus === 'present' && "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20 shadow-sm shadow-emerald-500/5",
                overallStatus === 'caught_up' && "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-500/20 shadow-sm shadow-orange-500/5",
                overallStatus === 'absent' && "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-500/20 shadow-sm shadow-red-500/5",
                !overallStatus && isCurrentMonth && "bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500",
                selectedDay && isSameDay(day, selectedDay) && "ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 border-transparent"
              )}
            >
              <span className={cn(
                "relative z-10",
                selectedDay && isSameDay(day, selectedDay) && "text-indigo-600 dark:text-indigo-400"
              )}>{format(day, "d")}</span>
              
              {dayRecords.length > 0 && (
                <div className="absolute inset-0 flex flex-wrap content-end justify-center gap-0.5 p-1 opacity-20 sm:opacity-40">
                  {dayRecords.slice(0, 8).map((rec, index) => (
                    <div 
                      key={rec.id || index}
                      className={cn(
                        "w-1.5 h-1.5 rounded-full shrink-0",
                        rec.status === 'present' ? "bg-emerald-500" : rec.status === 'caught_up' ? "bg-orange-500" : "bg-red-500"
                      )} 
                    />
                  ))}
                  {dayRecords.length > 8 && <span className="text-[6px] text-slate-400">+{dayRecords.length - 8}</span>}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedDay && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-10 overflow-hidden"
        >
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">
                  Day Details
                </h3>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  {format(selectedDay, "EEEE, MMMM do")}
                </p>
              </div>
              <button 
                onClick={() => setSelectedDay(null)}
                className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {getRecordsForDay(selectedDay).map((record) => {
                const sId = record.student_id || (record as any).studentId || (record as any).studentID;
                const student = students?.find(s => s.id === sId) || fallbackStudent;
                
                const displayName = student?.name || "Student";
                const displayClass = student?.class || "General";
                
                return (
                  <div 
                    key={record.id}
                    className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {student?.photo ? (
                        <img 
                          src={student.photo} 
                          alt={displayName} 
                          className="w-8 h-8 rounded-lg object-cover shrink-0" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0",
                          record.status === 'present' 
                            ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                            : record.status === 'caught_up'
                              ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400"
                              : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
                        )}>
                          {displayName.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {displayName}
                        </p>
                        <p className="text-[9px] font-medium text-slate-400 uppercase tracking-tight">
                          {displayClass} • {record.shift && record.shift.startsWith("CaughtUp_") ? `Makeup for ${new Date(record.shift.split('_')[1]).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}` : record.shift || 'Any'}
                        </p>
                      </div>
                    </div>
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ml-2 shrink-0 border",
                      record.status === 'present'
                        ? "bg-emerald-100/50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20"
                        : record.status === 'caught_up'
                          ? "bg-orange-100/50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-500/20"
                          : "bg-red-100/50 dark:bg-red-500/10 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/20"
                    )}>
                      {record.status === 'caught_up' ? "Caught up" : record.status}
                    </span>
                  </div>
                );
              })}
              {getRecordsForDay(selectedDay).length === 0 && (
                <div className="col-span-full py-10 text-center">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    No records for this day
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

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
