// src/student/components/AttendanceSummary.tsx
import React from "react";

export const AttendanceSummary = ({ rate }: { rate: number }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
    <h2 className="text-xl font-bold mb-4">Attendance Summary</h2>
    <p className="text-4xl font-black text-emerald-600">{rate}%</p>
  </div>
);
