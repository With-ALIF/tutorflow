import React from "react";
import { format, parseISO } from "date-fns";

interface ReportHeaderProps {
  reportMonth: string;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({ reportMonth }) => {
  return (
    <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Monthly Attendance Report</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
        Overview of attendance for {format(parseISO(`${reportMonth}-01`), "MMMM yyyy")}
      </p>
    </div>
  );
};
