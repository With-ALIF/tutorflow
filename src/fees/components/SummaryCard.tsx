import React from "react";
import { FeeRecord } from "../services/feeService";

interface SummaryCardProps {
  fees: FeeRecord[];
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ fees }) => {
  const totalCollected = fees.filter(f => f.status === 'paid').reduce((acc, f) => acc + Number(f.amount), 0);
  const totalOutstanding = fees.filter(f => f.status === 'due').reduce((acc, f) => acc + Number(f.amount), 0);
  const totalAmount = fees.reduce((acc, f) => acc + Number(f.amount), 0) || 1;

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-700" />
      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">Financial Summary</h3>
      <div className="space-y-6">
        <div className="relative">
          <p className="text-xs text-slate-500 font-medium mb-1">Total Collected</p>
          <p className="text-3xl font-bold text-emerald-600 tracking-tight">
            ${totalCollected.toLocaleString()}
          </p>
          <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-full" />
          </div>
        </div>
        <div className="relative">
          <p className="text-xs text-slate-500 font-medium mb-1">Total Outstanding</p>
          <p className="text-3xl font-bold text-orange-600 tracking-tight">
            ${totalOutstanding.toLocaleString()}
          </p>
          <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-orange-500" 
              style={{ width: `${(totalOutstanding / totalAmount) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
