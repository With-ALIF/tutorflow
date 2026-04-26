import React from "react";
import { Search, Filter, Download, CreditCard, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "../../../lib/utils";
import { FeeRecord } from "../types/fee.types";

interface FeesTableProps {
  fees: FeeRecord[];
  onDownloadPDF: () => void;
  onMarkAsPaid: (id: string) => void;
  onMarkAsUnpaid: (id: string) => void;
  onSort: (key: keyof FeeRecord | 'amount') => void;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const FeesTable: React.FC<FeesTableProps> = ({ 
  fees, 
  onDownloadPDF, 
  onMarkAsPaid, 
  onMarkAsUnpaid,
  onSort,
  sortConfig,
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30 dark:bg-slate-800/30">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search name, id, month, status..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all dark:text-white"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
            <Filter className="w-4 h-4" />
          </button>
          <button onClick={onDownloadPDF} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-widest font-bold border-b border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30">
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Fee Month</th>
              <th 
                className="px-6 py-4 cursor-pointer hover:text-emerald-600 transition-colors"
                onClick={() => onSort('amount')}
              >
                <div className="flex items-center gap-1">
                  Amount
                  {sortConfig?.key === 'amount' ? (
                    sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                  ) : null}
                </div>
              </th>
              <th 
                className="px-6 py-4 cursor-pointer hover:text-emerald-600 transition-colors"
                onClick={() => onSort('payment_date')}
              >
                <div className="flex items-center gap-1">
                  Date
                  {sortConfig?.key === 'payment_date' ? (
                    sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                  ) : null}
                </div>
              </th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {fees.map((fee) => (
              <tr key={fee.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">{fee.students?.name}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {fee.fee_month ? new Date(fee.fee_month + '-01').toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">৳{fee.amount}</span>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-slate-500">
                  {new Date(fee.payment_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    fee.status === 'paid' ? "bg-emerald-100 text-emerald-700" : 
                    fee.status === 'unpaid' ? "bg-red-100 text-red-700" :
                    "bg-orange-100 text-orange-700"
                  )}>
                    {fee.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {fee.status === 'due' && (
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => onMarkAsPaid(fee.id)}
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        Mark Paid
                      </button>
                      <button 
                        onClick={() => onMarkAsUnpaid(fee.id)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        Unpaid
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {fees.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <CreditCard className="w-12 h-12 opacity-20" />
                    <p className="text-sm font-medium">No payment records found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
