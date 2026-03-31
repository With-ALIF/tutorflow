import React from "react";
import { CheckCircle2, XCircle, Save } from "lucide-react";
import { cn } from "../../lib/utils";

interface Student {
  id: string;
  name: string;
  class: string;
  phone: string;
  monthly_fee?: number;
  lectures_per_month?: number;
  photo?: string;
}

interface StudentTableProps {
  students: Student[];
  records: Record<string, 'present' | 'absent'>;
  date: string;
  setDate: (date: string) => void;
  handleStatusChange: (studentId: string, status: 'present' | 'absent') => void;
  handleSave: () => void;
  saving: boolean;
  loading: boolean;
}

export function StudentTable({
  students,
  records,
  handleStatusChange,
  handleSave,
  saving,
}: StudentTableProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-widest font-bold border-b border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30">
              <th className="px-8 py-5">Student</th>
              <th className="px-8 py-5">Class</th>
              <th className="px-8 py-5 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-700/30 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    {student.photo ? (
                      <img src={student.photo} alt={student.name} className="w-10 h-10 rounded-xl object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                        {student.name.charAt(0)}
                      </div>
                    )}
                    <span className="font-bold text-slate-900 dark:text-white">{student.name}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full text-[10px] font-bold uppercase tracking-widest">{student.class}</span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-center gap-2 sm:gap-4">
                    <button 
                      onClick={() => handleStatusChange(student.id, 'present')}
                      className={cn(
                        "flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2.5 rounded-2xl text-[10px] sm:text-xs font-bold transition-all border-2",
                        records[student.id] === 'present'
                          ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30 scale-105"
                          : "bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800 hover:text-emerald-600 dark:hover:text-emerald-400 active:scale-95"
                      )}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Present</span>
                    </button>
                    <button 
                      onClick={() => handleStatusChange(student.id, 'absent')}
                      className={cn(
                        "flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2.5 rounded-2xl text-[10px] sm:text-xs font-bold transition-all border-2",
                        records[student.id] === 'absent'
                          ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/30 scale-105"
                          : "bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-800 hover:text-red-600 dark:hover:text-red-400 active:scale-95"
                      )}
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Absent</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all disabled:opacity-50 shadow-xl active:scale-95"
        >
          <Save className="w-5 h-5" />
          {saving ? "Saving..." : "Save Attendance"}
        </button>
      </div>
    </div>
  );
}
