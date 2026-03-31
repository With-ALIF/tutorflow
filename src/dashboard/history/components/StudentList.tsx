import React from "react";
import { Search, ArrowRight } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Student } from "../../types/attendance.types";

interface StudentListProps {
  students: Student[];
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
}

export function StudentList({ students, selectedStudentId, setSelectedStudentId }: StudentListProps) {
  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-700 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <Search className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Select Student</h2>
      </div>
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {students.map((student) => (
          <button
            key={student.id}
            onClick={() => setSelectedStudentId(student.id)}
            className={cn(
              "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left group",
              selectedStudentId === student.id
                ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 shadow-sm"
                : "bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 hover:border-emerald-100 dark:hover:border-emerald-500/50 hover:bg-slate-50/50 dark:hover:bg-slate-700/50"
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-colors",
                selectedStudentId === student.id 
                  ? "bg-emerald-500 text-white" 
                  : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
              )}>
                {student.name.charAt(0)}
              </div>
              <div>
                <p className={cn(
                  "text-sm font-bold transition-colors", 
                  selectedStudentId === student.id 
                    ? "text-emerald-900 dark:text-emerald-400" 
                    : "text-slate-900 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                )}>
                  {student.name}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{student.class}</p>
              </div>
            </div>
            <ArrowRight className={cn("w-4 h-4 transition-all", selectedStudentId === student.id ? "text-emerald-500 translate-x-1" : "text-slate-200 dark:text-slate-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1")} />
          </button>
        ))}
      </div>
    </div>
  );
}
