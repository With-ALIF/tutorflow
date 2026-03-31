import React from "react";
import { AlertCircle } from "lucide-react";

interface FeeItemProps {
  key?: string | number;
  fee: any;
}

export const FeeItem = ({ fee }: FeeItemProps) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-500">
      <AlertCircle className="w-5 h-5" />
    </div>
    <div className="flex-1">
      <p className="text-sm font-bold text-slate-900 dark:text-white">{fee.studentName}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">Month: {fee.fee_month}</p>
    </div>
    <div className="text-right">
      <p className="text-sm font-black text-slate-900 dark:text-white">${fee.amount}</p>
    </div>
  </div>
);
