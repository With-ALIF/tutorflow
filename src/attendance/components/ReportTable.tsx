import React from "react";
import { cn } from "../../lib/utils";
import { Student } from "../types";

interface ReportTableProps {
  students: Student[];
  reportData: Record<string, { present: number, absent: number }>;
}

export const ReportTable = ({ students, reportData }: ReportTableProps) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-widest font-bold border-b border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30">
          <th className="px-8 py-5">Student</th>
          <th className="px-8 py-5 text-center">Present</th>
          <th className="px-8 py-5 text-center">Absent</th>
          <th className="px-8 py-5 text-center">Attendance %</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
        {students.map((student) => {
          const data = reportData[student.id] || { present: 0, absent: 0 };
          const total = data.present + data.absent;
          const percentage = total > 0 ? Math.round((data.present / total) * 100) : 0;
          
          return (
            <tr key={student.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-700/30 transition-colors">
              <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                  {student.photo ? (
                    <img src={student.photo} alt={student.name} className="w-10 h-10 rounded-xl object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400">
                      {student.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{student.name}</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{student.class}</span>
                  </div>
                </div>
              </td>
              <td className="px-8 py-5 text-center">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                  {data.present}
                </span>
              </td>
              <td className="px-8 py-5 text-center">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold">
                  {data.absent}
                </span>
              </td>
              <td className="px-8 py-5 text-center">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        percentage >= 80 ? "bg-emerald-500" : percentage >= 50 ? "bg-orange-500" : "bg-red-500"
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 w-8">{percentage}%</span>
                </div>
              </td>
            </tr>
          );
        })}
        {students.length === 0 && (
          <tr>
            <td colSpan={4} className="px-8 py-12 text-center text-slate-500">
              No students found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);
