import React from "react";
import { motion } from "motion/react";
import { Student } from "../../types/attendance.types";
import { MonthPicker } from "./MonthPicker";
import { ReportHeader } from "./ReportHeader";
import { ReportTable } from "./ReportTable";

interface AttendanceReportProps {
  students: Student[];
  reportMonth: string;
  setReportMonth: (month: string) => void;
  reportData: Record<string, { present: number, absent: number }>;
}

export const AttendanceReport: React.FC<AttendanceReportProps> = ({
  students,
  reportMonth,
  setReportMonth,
  reportData,
}) => {
  return (
    <motion.div 
      key="report"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-end">
        <MonthPicker reportMonth={reportMonth} setReportMonth={setReportMonth} />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 shadow-sm overflow-hidden">
        <ReportHeader reportMonth={reportMonth} />
        <ReportTable students={students} reportData={reportData} />
      </div>
    </motion.div>
  );
};
