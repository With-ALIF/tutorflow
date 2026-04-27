import React from "react";
import { Clock, BookOpen, MapPin, Trash2, Edit2, Layers, CalendarDays } from "lucide-react";
import { Routine, DayOfWeek } from "../types/routine.types";
import { Student } from "../../students/types/student.types";
import { cn } from "../../../lib/utils";

interface RoutineCalendarProps {
  routines: Routine[];
  students: Student[];
  onEdit: (routine: Routine) => void;
  onDelete: (id: string) => void;
}

const days: DayOfWeek[] = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const RoutineCalendar: React.FC<RoutineCalendarProps> = ({ routines, students, onEdit, onDelete }) => {
  const groupedRoutines = routines.reduce((acc, r) => {
    if (!acc[r.day]) acc[r.day] = [];
    acc[r.day].push(r);
    // Sort by start time
    acc[r.day].sort((a, b) => a.startTime.localeCompare(b.startTime));
    return acc;
  }, {} as Record<string, Routine[]>);

  const getStudentsByBatch = (batchName: string) => {
    return students.filter(s => s.batch === batchName);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
      {days.map(day => (
        <div key={day} className="flex flex-col gap-6 bg-slate-50/50 dark:bg-slate-900/40 p-6 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 dark:bg-indigo-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                <CalendarDays className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{day}</h3>
            </div>
            <div className="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 dark:border-slate-700 shadow-sm">
              {groupedRoutines[day]?.length || 0} Classes
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            {groupedRoutines[day]?.map(routine => (
              <div 
                key={routine.id}
                className="group relative bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
              >
                <div 
                  className="absolute top-0 left-6 right-6 h-1 rounded-b-full opacity-60"
                  style={{ backgroundColor: routine.color || '#4f46e5' }}
                />
                
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 scale-90 group-hover:scale-100">
                  <button onClick={() => onEdit(routine)} className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl transition-all shadow-sm bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => onDelete(routine.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 rounded-xl transition-all shadow-sm bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
                      style={{ backgroundColor: routine.color || '#4f46e5' }}
                    >
                      <Layers className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-base font-black text-slate-900 dark:text-white truncate pr-16">{routine.batchName}</h4>
                      <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span className="text-[10px] font-bold tracking-wider">{routine.startTime} - {routine.endTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {routine.subject && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                        <BookOpen className="w-3 h-3 text-indigo-500" />
                        <span className="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest truncate">{routine.subject}</span>
                      </div>
                    )}

                    {routine.room && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                        <MapPin className="w-3 h-3 text-emerald-500" />
                        <span className="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest truncate">{routine.room}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-50 dark:border-slate-700/50">
                    <div className="flex flex-wrap gap-1.5">
                      {getStudentsByBatch(routine.batchName).length > 0 ? (
                        getStudentsByBatch(routine.batchName).slice(0, 3).map(s => (
                          <div 
                            key={s.id} 
                            className="px-2 py-1 bg-indigo-50/50 dark:bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 rounded-lg text-[8px] font-black uppercase tracking-tight border border-indigo-100/50 dark:border-indigo-500/10"
                          >
                            {s.name.split(' ')[0]}
                          </div>
                        ))
                      ) : (
                        <span className="text-[9px] text-slate-400 font-bold italic uppercase tracking-widest px-1">No Student</span>
                      )}
                      {getStudentsByBatch(routine.batchName).length > 3 && (
                        <div className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg text-[8px] font-black">
                          +{getStudentsByBatch(routine.batchName).length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {(!groupedRoutines[day] || groupedRoutines[day].length === 0) && (
              <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] bg-white/30 dark:bg-slate-800/10 opacity-60">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-700 mb-3">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">Off Day</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
