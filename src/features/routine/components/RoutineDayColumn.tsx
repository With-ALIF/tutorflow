import React from "react";
import { CalendarDays, Clock } from "lucide-react";
import { Routine } from "../types/routine.types";
import { Student } from "../../students/types/student.types";
import { RoutineCard } from "./RoutineCard";

interface RoutineDayColumnProps {
  day: string;
  routines: Routine[];
  students: Student[];
  onEdit: (routine: Routine) => void;
  onDelete: (id: string) => void;
}

export const RoutineDayColumn: React.FC<RoutineDayColumnProps> = ({ day, routines, students, onEdit, onDelete }) => (
  <div className="flex flex-col gap-4 sm:gap-6 bg-slate-50/50 dark:bg-slate-900/40 p-4 sm:p-6 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800">
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 dark:bg-indigo-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
          <CalendarDays className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{day}</h3>
      </div>
      <div className="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 dark:border-slate-700 shadow-sm">
        {routines.length} Classes
      </div>
    </div>
    
    <div className="flex flex-col gap-4">
      {routines.map(routine => (
        <RoutineCard key={routine.id} routine={routine} students={students} onEdit={onEdit} onDelete={onDelete} />
      ))}
      
      {routines.length === 0 && (
        <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] bg-white/30 dark:bg-slate-800/10 opacity-60">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-700 mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">Off Day</span>
        </div>
      )}
    </div>
  </div>
);
