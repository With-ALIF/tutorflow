import React, { useState } from "react";
import { Search, ArrowRight, Calendar, CheckCircle2, XCircle, UserCheck } from "lucide-react";
import { motion } from "motion/react";
import { format, parseISO } from "date-fns";
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

interface AttendanceRecord {
  id: string;
  student_id: string;
  date: string;
  status: 'present' | 'absent';
  created_at: string;
}

interface HistoryPanelProps {
  students: Student[];
  studentHistory: AttendanceRecord[];
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  fetchingHistory: boolean;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
}

export function HistoryPanel({
  students,
  studentHistory,
  selectedStudentId,
  setSelectedStudentId,
  fetchingHistory,
  selectedMonth,
  setSelectedMonth,
}: HistoryPanelProps) {
  const grouped = studentHistory.reduce((acc, record) => {
    const month = format(parseISO(record.date), "MMMM yyyy");
    if (!acc[month]) acc[month] = [];
    acc[month].push(record);
    return acc;
  }, {} as Record<string, AttendanceRecord[]>);
  
  const months = Object.keys(grouped);

  return (
    <motion.div 
      key="history"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-10"
    >
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Search className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Select Student</h2>
          </div>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {students.map((student) => (
              <button
                key={student.id}
                onClick={() => setSelectedStudentId(student.id)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left group",
                  selectedStudentId === student.id
                    ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 shadow-sm"
                    : "bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 hover:border-emerald-100 dark:hover:border-emerald-500/50 hover:bg-slate-50/50 dark:hover:bg-slate-700/50"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-colors",
                    selectedStudentId === student.id 
                      ? "bg-emerald-500 text-white" 
                      : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                  )}>
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <p className={cn(
                      "text-sm font-bold transition-colors", 
                      selectedStudentId === student.id 
                        ? "text-emerald-900 dark:text-emerald-400" 
                        : "text-slate-900 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                    )}>
                      {student.name}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{student.class}</p>
                  </div>
                </div>
                <ArrowRight className={cn("w-4 h-4 transition-all", selectedStudentId === student.id ? "text-emerald-500 translate-x-1" : "text-slate-200 dark:text-slate-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1")} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        {selectedStudentId ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-8 border-b border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                {students.find(s => s.id === selectedStudentId)?.photo ? (
                  <img src={students.find(s => s.id === selectedStudentId)?.photo} alt={students.find(s => s.id === selectedStudentId)?.name} className="w-14 h-14 rounded-2xl object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 flex items-center justify-center text-2xl font-bold text-emerald-500 shadow-sm">
                    {students.find(s => s.id === selectedStudentId)?.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {students.find(s => s.id === selectedStudentId)?.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Detailed attendance logs and statistics.</p>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {fetchingHistory ? (
                <div className="flex items-center justify-center h-60">
                  <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : studentHistory.length > 0 ? (
                <>
                  <div className="flex gap-2 p-4 border-b border-slate-100 dark:border-slate-700 overflow-x-auto">
                    {months.map(month => (
                      <button
                        key={month}
                        onClick={() => setSelectedMonth(month)}
                        className={cn(
                          "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all",
                          selectedMonth === month 
                            ? "bg-emerald-500 text-white shadow-md" 
                            : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                        )}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                  <div className="flex-1 overflow-y-auto p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {grouped[selectedMonth]?.map((record) => (
                        <div 
                          key={record.id} 
                          className={cn(
                            "flex items-center justify-between p-5 rounded-2xl border-2 transition-all hover:scale-[1.02]",
                            record.status === 'present' 
                              ? "bg-emerald-50/30 dark:bg-emerald-500/5 border-emerald-100/50 dark:border-emerald-500/20" 
                              : "bg-red-50/30 dark:bg-red-500/5 border-red-100/50 dark:border-red-500/20"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm",
                              record.status === 'present' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                            )}>
                              {record.status === 'present' ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-slate-200">
                                {format(parseISO(record.date), "MMMM d, yyyy")}
                              </p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
                                {format(parseISO(record.date), "EEEE")}
                              </p>
                            </div>
                          </div>
                          <span className={cn(
                            "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                            record.status === 'present' ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                          )}>
                            {record.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-80 text-slate-400">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <Calendar className="w-10 h-10 opacity-20" />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-widest">No records found</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border-2 border-slate-100 border-dashed h-full flex flex-col items-center justify-center p-12 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8">
              <UserCheck className="w-12 h-12 text-slate-200" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">No Student Selected</h3>
            <p className="text-slate-500 max-w-xs mx-auto text-sm font-medium leading-relaxed">
              Select a student from the list on the left to view their detailed attendance history and statistics.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
