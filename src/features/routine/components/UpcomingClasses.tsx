import React from "react";
import { Clock, Play, Layers, Calendar } from "lucide-react";
import { Routine } from "../types/routine.types";
import { useRoutine } from "../hooks/useRoutine";
import { useStudents } from "../../students/hooks/useStudents";
import { cn } from "../../../lib/utils";

export const UpcomingClasses: React.FC = () => {
  const { routines, loading: routineLoading } = useRoutine();
  const { students, loading: studentsLoading } = useStudents();
  const [activeTab, setActiveTab] = React.useState<'today' | 'tomorrow'>('today');

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  const getTodayDay = () => {
    return days[new Date().getDay()];
  };

  const getTomorrowDay = () => {
    const tomorrowIndex = (new Date().getDay() + 1) % 7;
    return days[tomorrowIndex];
  };

  const today = getTodayDay();
  const tomorrow = getTomorrowDay();

  const todayClasses = routines
    .filter(r => r.day === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const tomorrowClasses = routines
    .filter(r => r.day === tomorrow)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const currentClasses = activeTab === 'today' ? todayClasses : tomorrowClasses;
  const currentDay = activeTab === 'today' ? today : tomorrow;

  const loading = routineLoading || studentsLoading;

  const getStudentsByBatch = (batchName: string) => {
    return students.filter(s => s.batch === batchName);
  };

  if (loading) return <div className="h-48 flex items-center justify-center bg-white dark:bg-slate-800 rounded-3xl animate-pulse p-8">
    <Clock className="w-6 h-6 text-slate-300 animate-spin" />
  </div>;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200/60 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
            <Play className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Classes Routine</h3>
            <div className="flex gap-4 mt-1">
              <button 
                onClick={() => setActiveTab('today')}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest transition-colors",
                  activeTab === 'today' ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 hover:text-slate-600"
                )}
              >
                Today ({today})
              </button>
              <button 
                onClick={() => setActiveTab('tomorrow')}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest transition-colors",
                  activeTab === 'tomorrow' ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 hover:text-slate-600"
                )}
              >
                Tomorrow ({tomorrow})
              </button>
            </div>
          </div>
        </div>
        <div className="px-4 py-2 bg-indigo-500/10 rounded-3xl flex flex-col items-center justify-center min-w-[80px] self-start sm:self-auto">
          <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 leading-none">{currentClasses.length}</span>
          <span className="text-[8px] font-black text-indigo-500/70 dark:text-indigo-400/70 uppercase tracking-widest mt-1">Scheduled</span>
        </div>
      </div>

      <div className="p-6 space-y-4 overflow-y-auto max-h-[400px] flex-1">
        {currentClasses.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <Calendar className="w-12 h-12 text-slate-200 dark:text-slate-800 mb-4" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">No classes scheduled {activeTab}</p>
          </div>
        ) : (
          currentClasses.map((routine) => (
            <div key={routine.id} className="relative group p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-transparent hover:border-blue-500/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center justify-center px-3 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 min-w-[70px]">
                  <span className="text-xs font-black text-slate-900 dark:text-white">{routine.startTime}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900 dark:text-white truncate uppercase">{routine.batchName}</span>
                    {routine.subject && (
                      <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase rounded border border-blue-500/20 tracking-tighter">
                        {routine.subject}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Till {routine.endTime}
                    </span>
                    {routine.room && (
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                        • {routine.room}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {getStudentsByBatch(routine.batchName).map(s => (
                      <span key={s.id} className="text-[8px] px-1 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded border border-slate-100 dark:border-slate-700 font-bold uppercase">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: routine.color || '#3b82f6' }} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
