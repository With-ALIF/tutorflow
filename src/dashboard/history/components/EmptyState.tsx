import React from "react";
import { Calendar, UserCheck } from "lucide-react";

interface EmptyStateProps {
  type: "no-student" | "no-records";
}

export function EmptyState({ type }: EmptyStateProps) {
  if (type === "no-records") {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-slate-400">
        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <Calendar className="w-10 h-10 opacity-20" />
        </div>
        <p className="text-sm font-bold uppercase tracking-widest">No records found</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-100 dark:border-slate-700 border-dashed h-full flex flex-col items-center justify-center p-12 text-center">
      <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-8">
        <UserCheck className="w-12 h-12 text-slate-200 dark:text-slate-600" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">No Student Selected</h3>
      <p className="text-slate-500 max-w-xs mx-auto text-sm font-medium leading-relaxed">
        Select a student from the list on the left to view their detailed attendance history and statistics.
      </p>
    </div>
  );
}
