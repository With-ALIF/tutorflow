import React from "react";
import { UserPlus } from "lucide-react";

interface StudentsHeaderProps {
  onAddClick: () => void;
}

export const StudentsHeader: React.FC<StudentsHeaderProps> = ({ onAddClick }) => {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Student Management</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm md:text-base">Manage your students, their details and academic records.</p>
      </div>
      <button 
        onClick={onAddClick}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 w-full md:w-auto"
      >
        <UserPlus className="w-5 h-5" />
        <span>Add New Student</span>
      </button>
    </header>
  );
};
