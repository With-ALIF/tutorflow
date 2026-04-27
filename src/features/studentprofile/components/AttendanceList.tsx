import React from "react";
import { CheckCircle2, XCircle, Download } from "lucide-react";
import { cn } from "../../../lib/utils";
import { AttendanceRecord } from "../../../types/attendance";

export const AttendanceList = ({ 
  attendance, 
  onDownload 
}: { 
  attendance: AttendanceRecord[],
  onDownload?: () => void 
}) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between mb-2">
      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Recent Logs</p>
    </div>
    {attendance.slice(0, 5).map((record, idx) => (
      <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-indigo-100 dark:hover:border-indigo-500/30 transition-colors group">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
            record.status === 'present' ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
          )}>
            {record.status === 'present' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{new Date(record.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{record.status === 'present' ? 'Attended' : 'Missed'}</p>
          </div>
        </div>
        <span className={cn(
          "px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors",
          record.status === 'present' ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white" : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 group-hover:bg-red-600 group-hover:text-white"
        )}>
          {record.status}
        </span>
      </div>
    ))}
    {attendance.length === 0 && (
      <div className="text-center py-10 bg-slate-50/30 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">No attendance records found.</p>
      </div>
    )}
  </div>
);
