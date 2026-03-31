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
    handleSave 
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
      <div className="max-w-xs">
        <DatePicker date={date} setDate={setDate} />
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
