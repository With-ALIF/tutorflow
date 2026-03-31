import React from "react";
import { CreditCard } from "lucide-react";
import { cn } from "../../lib/utils";
import { FeeRecord } from "../types";

export const PaymentList = ({ fees }: { fees: FeeRecord[] }) => (
  <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 shadow-sm p-8">
    <div className="flex items-center gap-3 mb-8">
      <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
        <CreditCard className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Payment History</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Financial transaction logs</p>
      </div>
    </div>
    
    <div className="space-y-4">
      {fees.map((fee, idx) => (
        <div key={idx} className="flex flex-col p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-blue-100 dark:hover:border-blue-500/30 transition-colors group gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110",
                fee.status === 'paid' ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400"
              )}>
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">${fee.amount}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{new Date(fee.payment_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={cn(
                "px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest",
                fee.status === 'paid' ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400" : "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400"
              )}>
                {fee.status}
              </span>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Confirmed</p>
            </div>
          </div>
        </div>
      ))}
      {fees.length === 0 && (
        <div className="text-center py-10 bg-slate-50/30 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">No payment records found.</p>
        </div>
      )}
    </div>
  </div>
);
