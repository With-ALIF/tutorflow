import React from "react";
import { Clock, Calendar, BookOpen, MapPin } from "lucide-react";
import { Routine } from "../../routine/types/routine.types";

interface ProfileRoutineProps {
  routines: Routine[];
  studentBatch: string;
}

export const ProfileRoutine: React.FC<ProfileRoutineProps> = ({ routines, studentBatch }) => {
  const batchRoutines = routines
    .filter(r => r.batchName === studentBatch)
    .sort((a, b) => {
      const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      const dayDiff = days.indexOf(a.day) - days.indexOf(b.day);
      if (dayDiff !== 0) return dayDiff;
      return a.startTime.localeCompare(b.startTime);
    });

  if (batchRoutines.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200/60 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Class Schedule</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Weekly Batch Routine</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {batchRoutines.map((routine) => (
            <div 
              key={routine.id}
              className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50"
            >
              <div className="flex flex-col items-center justify-center w-16 h-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">{routine.day.slice(0, 3)}</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Day</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1 px-2 bg-indigo-100 dark:bg-indigo-500/10 rounded-full">
                    <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase">{routine.subject}</span>
                  </div>
                  {routine.room && (
                    <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold">
                      <MapPin className="w-2.5 h-2.5" />
                      <span>{routine.room}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {routine.startTime} - {routine.endTime}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-1 h-8 rounded-full" style={{ backgroundColor: routine.color || '#4f46e5' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
