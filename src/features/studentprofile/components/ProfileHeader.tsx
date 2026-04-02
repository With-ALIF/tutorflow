import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export const ProfileHeader = () => (
  <header className="flex items-center gap-6">
    <Link to="/students" className="p-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all text-slate-500 dark:text-slate-400 active:scale-95">
      <ChevronLeft className="w-6 h-6" />
    </Link>
    <div>
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Student Profile</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm md:text-base">Detailed overview of academic and financial records.</p>
    </div>
  </header>
);
