import React from "react";
import { Clock, Layers, Edit2, Trash2 } from "lucide-react";
import { Routine } from "../types/routine.types";

interface RoutineCardHeaderProps {
  routine: Routine;
  onEdit: (routine: Routine) => void;
  onDelete: (id: string) => void;
}

export const RoutineCardHeader: React.FC<RoutineCardHeaderProps> = ({ routine, onEdit, onDelete }) => (
  <div className="flex items-start justify-between gap-3">
    <div className="flex items-center gap-3 min-w-0 flex-1">
      <div 
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"
        style={{ backgroundColor: routine.color || '#4f46e5' }}
      >
        <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      <div className="min-w-0 flex-1 font-bold">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="text-base font-black text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-none" title={routine.batchName}>
            {routine.batchName}
          </h4>
          {routine.shift && (
            <span className={`inline-flex items-center px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-lg border ${
              routine.shift === "Morning" 
                ? "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400" 
                : "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:bg-indigo-500/20 dark:text-indigo-400"
            }`}>
              {routine.shift === "Morning" ? "☀️ MORNING" : "⛅ EVENING"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1 text-slate-400 dark:text-slate-500">
          <Clock className="w-3 h-3 text-indigo-500/80" />
          <span className="text-[10px] font-bold tracking-wider">{routine.startTime} - {routine.endTime}</span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 bg-slate-50 dark:bg-slate-900 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-800">
      <button 
        onClick={() => onEdit(routine)} 
        className="p-1 sm:p-1.5 hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 rounded-lg sm:rounded-xl transition-all"
        title="Edit"
      >
        <Edit2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      </button>
      <button 
        onClick={() => onDelete(routine.id)} 
        className="p-1 sm:p-1.5 hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-red-600 rounded-lg sm:rounded-xl transition-all"
        title="Delete"
      >
        <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      </button>
    </div>
  </div>
);
