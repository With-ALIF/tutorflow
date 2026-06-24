import React from "react";
import { BookOpen, MapPin } from "lucide-react";
import { Routine } from "../types/routine.types";

interface RoutineCardDetailsProps {
  routine: Routine;
}

export const RoutineCardDetails: React.FC<RoutineCardDetailsProps> = ({ routine }) => (
  <div className="flex flex-col gap-3">
    {routine.subject && (
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
        <BookOpen className="w-3 h-3 text-indigo-500" />
        <span className="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest truncate">
          {routine.subject}
        </span>
      </div>
    )}
  </div>
);
