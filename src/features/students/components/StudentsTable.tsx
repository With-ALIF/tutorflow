import React from "react";
import { Search, Users } from "lucide-react";
import { Student } from "../types/student.types";
import { StudentRow } from "./StudentRow";
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
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30 dark:bg-slate-800/30">
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

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-widest font-bold border-b border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30">
              <th className="px-6 py-4">Student Name</th>
              <th className="px-6 py-4">Class</th>
              <th className="px-6 py-4">Phone Number</th>
              <th className="px-6 py-4">Monthly Fee</th>
              <th className="px-6 py-4">Lectures/Month</th>
              <th className="px-6 py-4">Per Lecture</th>
              <th className="px-6 py-4">Join Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {students.map((student) => (
              <StudentRow 
                key={student.id} 
                student={student} 
                onEdit={onEdit} 
                onDelete={onDelete} 
              />
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <EmptyState />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
