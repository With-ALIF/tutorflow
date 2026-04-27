import React, { useState } from "react";
import { motion } from "motion/react";
import { LayoutGrid, Calendar as CalendarIcon } from "lucide-react";
import { Student, AttendanceRecord } from "../../types/attendance.types";
import { StudentList } from "./StudentList";
import { StudentHeader } from "./StudentHeader";
import { MonthTabs } from "./MonthTabs";
import { RecordCard } from "./RecordCard";
import { EmptyState } from "./EmptyState";
import { CalendarView } from "../calendar/CalendarView";
import { groupByMonth } from "../../utils/groupByMonth";
import { cn } from "../../../../lib/utils";

interface HistoryPanelProps {
  students: Student[];
  studentHistory: AttendanceRecord[];
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  fetchingHistory: boolean;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  students,
  studentHistory,
  selectedStudentId,
  setSelectedStudentId,
  fetchingHistory,
  selectedMonth,
  setSelectedMonth,
}) => {
  const [viewType, setViewType] = useState<'list' | 'calendar'>('list');
  const grouped = groupByMonth(studentHistory);
  const months = Object.keys(grouped);
  const selectedStudent = students.find(s => s.id === selectedStudentId);

  return (
    <motion.div 
      key="history"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-10"
    >
      <div className="lg:col-span-1 space-y-6">
        <StudentList 
          students={students}
          selectedStudentId={selectedStudentId}
          setSelectedStudentId={setSelectedStudentId}
        />
      </div>

      <div className="lg:col-span-2">
        {selectedStudentId && selectedStudent ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-full">
            <StudentHeader student={selectedStudent} />
            
            <div className="px-8 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/10 dark:bg-slate-800/10">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">View Mode</p>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                <button 
                  onClick={() => setViewType('list')}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all",
                    viewType === 'list' 
                      ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm" 
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  List
                </button>
                <button 
                  onClick={() => setViewType('calendar')}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all",
                    viewType === 'calendar' 
                      ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm" 
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <CalendarIcon className="w-3.5 h-3.5" />
                  Calendar
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {fetchingHistory ? (
                <div className="flex items-center justify-center h-60">
                  <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : studentHistory.length > 0 ? (
                viewType === 'list' ? (
                  <>
                    <MonthTabs 
                      months={months}
                      selectedMonth={selectedMonth}
                      setSelectedMonth={setSelectedMonth}
                    />
                    <div className="flex-1 overflow-y-auto p-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {grouped[selectedMonth]?.map((record) => (
                          <RecordCard key={record.id} record={record} />
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 overflow-y-auto">
                    <CalendarView records={studentHistory} />
                  </div>
                )
              ) : (
                <EmptyState type="no-records" />
              )}
            </div>
          </div>
        ) : (
          <EmptyState type="no-student" />
        )}
      </div>
    </motion.div>
  );
};
