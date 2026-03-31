// src/student/components/PaymentHistory.tsx
import React from "react";

export const PaymentHistory = ({ due }: { due: number }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
    <h2 className="text-xl font-bold mb-4">Payment History</h2>
    <p><strong>Due Fees:</strong> ${due}</p>
  </div>
);
