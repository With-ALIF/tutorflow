import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { format } from "date-fns";
import { AttendanceHeader } from "./components/AttendanceHeader";
import { AttendanceTabs } from "./components/AttendanceTabs";
import { StudentRow } from "./components/StudentRow";
import { DateSelector } from "./components/DateSelector";
import { ReportTable } from "./components/ReportTable";
import { useStudents } from "./hooks/useStudents";
import { useAttendance } from "./hooks/useAttendance";
import { useHistory } from "./hooks/useHistory";
import { useReport } from "./hooks/useReport";
import { Save, Search, ArrowRight, Calendar, UserCheck, History, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";

export default function Attendance() {
  const [activeTab, setActiveTab] = useState<'mark' | 'history' | 'report'>('mark');
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const { students, loading } = useStudents();
  const { records, handleStatusChange, handleSave, saving } = useAttendance(date, students);
  
  // History state
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const { history: studentHistory, loading: fetchingHistory } = useHistory(selectedStudentId);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  // Report state
  const [reportMonth, setReportMonth] = useState(format(new Date(), "yyyy-MM"));
  const { reportData, loading: fetchingReport } = useReport(reportMonth);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <AttendanceHeader />
        <AttendanceTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'mark' ? (
          <motion.div key="mark" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            <div className="flex items-center justify-end">
              <DateSelector date={date} setDate={setDate} />
            </div>

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
                      <StudentRow 
                        key={student.id} 
                        student={student} 
                        status={records[student.id]} 
                        onStatusChange={(status) => handleStatusChange(student.id, status)} 
                      />
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
          </motion.div>
        ) : activeTab === 'history' ? (
          <motion.div key="history" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
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
                  {/* History Detail View */}
                  <div className="p-8 border-b border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30 flex flex-col gap-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                      {students.find(s => s.id === selectedStudentId)?.name}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Detailed attendance logs and statistics.</p>
                  </div>
                  <div className="flex-1 overflow-y-auto p-8">
                    {fetchingHistory ? (
                      <div className="text-center text-slate-500">Loading history...</div>
                    ) : studentHistory.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {studentHistory.map((record) => (
                          <div 
                            key={record.id} 
                            className={cn(
                              "flex items-center justify-between p-5 rounded-2xl border-2 transition-all hover:scale-[1.02]",
                              record.status === 'present' 
                                ? "bg-emerald-50/30 dark:bg-emerald-500/5 border-emerald-100/50 dark:border-emerald-500/20" 
                                : "bg-red-50/30 dark:bg-red-500/5 border-red-100/50 dark:border-red-500/20"
                            )}
                          >
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-200">
                              {format(new Date(record.date), "MMMM d, yyyy")}
                            </p>
                            <span className={cn(
                              "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                              record.status === 'present' ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                            )}>
                              {record.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-slate-400">No records found.</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border-2 border-slate-100 border-dashed h-full flex flex-col items-center justify-center p-12 text-center">
                  <UserCheck className="w-12 h-12 text-slate-200 mb-4" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">No Student Selected</h3>
                  <p className="text-slate-500 max-w-xs mx-auto text-sm font-medium leading-relaxed">
                    Select a student from the list on the left to view their detailed attendance history.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ) : activeTab === 'report' ? (
          <motion.div key="report" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2.5 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm">
                <button 
                  onClick={() => {
                    const [year, month] = reportMonth.split('-');
                    const d = new Date(parseInt(year), parseInt(month) - 2);
                    setReportMonth(format(d, "yyyy-MM"));
                  }}
                  className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-slate-400 dark:text-slate-500 transition-colors active:scale-90"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 px-4 border-x border-slate-100 dark:border-slate-700">
                  <Calendar className="w-5 h-5 text-emerald-500" />
                  <input 
                    type="month" 
                    className="font-bold text-slate-700 dark:text-slate-300 focus:outline-none bg-transparent"
                    value={reportMonth}
                    onChange={(e) => setReportMonth(e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => {
                    const [year, month] = reportMonth.split('-');
                    const d = new Date(parseInt(year), parseInt(month));
                    setReportMonth(format(d, "yyyy-MM"));
                  }}
                  className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-slate-400 dark:text-slate-500 transition-colors active:scale-90"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 shadow-sm overflow-hidden">
              <ReportTable students={students} reportData={reportData} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
