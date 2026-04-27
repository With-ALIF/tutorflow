import React from "react";
import { motion } from "motion/react";
import { DatePicker } from "./DatePicker";
import { AttendanceTable } from "./AttendanceTable";
import { SaveButton } from "./SaveButton";
import { useAttendanceMarking } from "../../hooks/useAttendanceMarking";

interface AttendancePanelProps {
  date: string;
  setDate: (date: string) => void;
}

export const AttendancePanel: React.FC<AttendancePanelProps> = ({ date, setDate }) => {
  const { 
    students, 
    records, 
    loading, 
    saving, 
    handleStatusChange, 
    handleSave,
    handleUndo
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="w-full sm:max-w-xs">
          <DatePicker date={date} setDate={setDate} />
        </div>
        <button 
          onClick={handleUndo}
          className="px-4 py-3 sm:py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors w-full sm:w-auto text-sm"
        >
          Undo Changes
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 shadow-sm overflow-hidden">
        <AttendanceTable 
          students={students} 
          records={records} 
          onStatusChange={handleStatusChange} 
        />
        <SaveButton onSave={handleSave} saving={saving} />
      </div>
    </motion.div>
  );
};
