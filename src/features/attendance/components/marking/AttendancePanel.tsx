import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { CalendarClock, Clock, Plus, X } from "lucide-react";
import { format, parseISO } from "date-fns";
import { DatePicker } from "./DatePicker";
import { AttendanceTable } from "./AttendanceTable";
import { SaveButton } from "./SaveButton";
import { useAttendanceMarking } from "../../hooks/useAttendanceMarking";
import { MarkTakenModal } from "./MarkTakenModal";

interface AttendancePanelProps {
  date: string;
  setDate: (date: string) => void;
}

export const AttendancePanel: React.FC<AttendancePanelProps> = ({ date, setDate }) => {
  const [selectedPendingClass, setSelectedPendingClass] = useState<any | null>(null);

  const { 
    students, 
    records, 
    sessions,
    activeRoutines,
    loading, 
    saving, 
    handleStatusChange, 
    handleSave,
    handleUndo,
    pendingClasses,
    addExtraBatch,
    handleMarkTaken
  } = useAttendanceMarking(date);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-60">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      key="attendance"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:max-w-2xl items-stretch sm:items-center">
          <div className="w-full sm:max-w-md">
            <DatePicker date={date} setDate={setDate} />
          </div>

        </div>
        <button 
          onClick={handleUndo}
          className="px-4 py-3 sm:py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all w-full lg:w-auto text-xs uppercase tracking-widest h-12 flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 active:scale-95"
        >
          <X className="w-4 h-4" />
          Undo All Changes
        </button>
      </div>

      {pendingClasses && pendingClasses.length > 0 && (
        <div className="bg-amber-500/5 dark:bg-amber-500/10 p-5 sm:p-6 rounded-[2rem] border border-amber-500/20 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
              <CalendarClock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 dark:text-white text-sm sm:text-base tracking-tight uppercase">
                Pending Classes
              </h4>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
                The classes from today and the last 72 hours for which attendance has not been taken are listed below.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingClasses.map((item, idx) => (
              <div 
                key={`${item.className}_${item.date}_${idx}`}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-amber-500/10 dark:border-amber-500/20 shadow-sm flex flex-col justify-between gap-3 text-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span 
                      className="text-[10px] font-black px-2.5 py-1 text-white rounded-lg uppercase tracking-wider bg-amber-500"
                    >
                      {item.className}
                    </span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-200/50">
                      {item.startTime}
                    </span>
                  </div>
                  <div className="font-bold text-slate-700 dark:text-slate-300">
                    <span className="text-xs">{item.date} ({item.day})</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setDate(item.date); }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[8px] uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95"
                  >
                    <CalendarClock className="w-3 h-3" />
                    <span>Go View</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPendingClass(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[8px] uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Mark Taken</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div id="attendance-table-container" className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-700 shadow-sm overflow-hidden">
        {sessions.length > 0 ? (
          <div className="space-y-6 pt-6">
            <AttendanceTable 
              students={students} 
              records={records} 
              sessions={sessions}
              onStatusChange={(studentId, status, shift) => handleStatusChange(studentId, status, shift)} 
            />

            <div className="p-6 pt-0">
              <SaveButton onSave={() => handleSave('ClassTime')} saving={saving} />
            </div>
          </div>
        ) : (
          <div className="p-12 text-center">
            <h4 className="text-base font-black text-slate-400 uppercase">No Classes Today</h4>
            <p className="text-xs text-slate-500 mt-1">No classes scheduled for today.</p>
          </div>
        )}
      </div>

      <MarkTakenModal 
        isOpen={!!selectedPendingClass}
        onClose={() => setSelectedPendingClass(null)}
        pendingClass={selectedPendingClass}
        onConfirm={(takenDate, shift) => handleMarkTaken(selectedPendingClass, takenDate, shift)}
      />
    </motion.div>
  );
};
