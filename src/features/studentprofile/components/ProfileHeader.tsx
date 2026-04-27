import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Download } from "lucide-react";
import { Student } from "../../../types/student";
import { AttendanceRecord } from "../../../types/attendance";
import { FeeRecord } from "../../../types/fee";
import { Expense } from "../../expenses/types/expense.types";

interface ProfileHeaderProps {
  student: Student;
  onDownloadFull: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ student, onDownloadFull }) => (
  <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
    <div className="flex items-center gap-6">
      <Link to="/students" className="p-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all text-slate-500 dark:text-slate-400 active:scale-95">
        <ChevronLeft className="w-6 h-6" />
      </Link>
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Student Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm md:text-base">Detailed overview of {student.name}'s records.</p>
      </div>
    </div>
    
    <button 
      onClick={onDownloadFull}
      className="flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95 whitespace-nowrap w-full md:w-auto"
    >
      <Download className="w-4 h-4" />
      Download Full Report
    </button>
  </header>
);
