import React from "react";
import { Search } from "lucide-react";
import { Student } from "../types/student.types";
import { StudentCard } from "./StudentCard";
import { EmptyState } from "./EmptyState";

interface StudentsTableProps {
  students: Student[];
  search: string;
  onSearchChange: (value: string) => void;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

export const StudentsTable: React.FC<StudentsTableProps> = ({ 
  students, 
  search, 
  onSearchChange, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="space-y-6">
      {/* Search and Header Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30 dark:bg-slate-800/30">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by name or class..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all dark:text-white"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            <span>Total: <span className="text-emerald-600 dark:text-emerald-400">{students.length}</span> students</span>
          </div>
        </div>
      </div>

      {/* Grid of Cards */}
      {students.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <StudentCard 
              key={student.id} 
              student={student} 
              onEdit={onEdit} 
              onDelete={onDelete} 
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 p-12 text-center shadow-sm">
          <EmptyState />
        </div>
      )}
    </div>
  );
};
