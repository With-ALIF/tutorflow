import React from "react";
import { UserPlus } from "lucide-react";

interface StudentsHeaderProps {
  onAddClick: () => void;
}

export const StudentsHeader: React.FC<StudentsHeaderProps> = ({ onAddClick }) => {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl min-[400px]:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">Student Management</h1>
      </div>
      <button 
        onClick={onAddClick}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 w-full md:w-auto"
      >
        <UserPlus className="w-5 h-5" />
        <span>Add New Student</span>
      </button>
    </header>
  );
};
