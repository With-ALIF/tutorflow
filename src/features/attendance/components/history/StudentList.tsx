import React from "react";
import { Student } from "../../types/attendance.types";
import { cn } from "../../../../lib/utils";

interface StudentListProps {
  students: Student[];
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  selectedStudentId,
  setSelectedStudentId,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Students</h3>
      </div>
      <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
        {students.map((student) => (
          <button
            key={student.id}
            onClick={() => setSelectedStudentId(student.id)}
            className={cn(
              "w-full flex items-center gap-4 p-5 text-left transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50",
              selectedStudentId === student.id && "bg-emerald-50/50 dark:bg-emerald-500/5 border-r-4 border-emerald-500"
            )}
          >
            {student.photo ? (
              <img 
                src={student.photo} 
                alt={student.name} 
                className="w-10 h-10 rounded-xl object-cover" 
                referrerPolicy="no-referrer" 
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400">
                {student.name.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{student.name}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{student.class}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
