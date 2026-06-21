import React from "react";
import { Student } from "../../students/types/student.types";

interface RoutineCardStudentsProps {
  batchName: string;
  students: Student[];
}

export const RoutineCardStudents: React.FC<RoutineCardStudentsProps> = ({ batchName, students }) => {
  const batchStudents = students.filter(s => s.batch === batchName);

  return (
    <div className="pt-3 border-t border-slate-50 dark:border-slate-700/50">
      <div className="flex flex-wrap gap-1.5 font-bold">
        {batchStudents.length > 0 ? (
          batchStudents.slice(0, 3).map(s => (
            <div 
              key={s.id} 
              className="px-2 py-1 bg-indigo-50/50 dark:bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 rounded-lg text-[8px] font-black uppercase tracking-tight"
            >
              {s.name.split(' ')[0]}
            </div>
          ))
        ) : (
          <span className="text-[9px] text-slate-400 font-bold italic uppercase tracking-widest px-1">No Student</span>
        )}
        {batchStudents.length > 3 && (
          <div className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg text-[8px] font-black">
            +{batchStudents.length - 3}
          </div>
        )}
      </div>
    </div>
  );
};
