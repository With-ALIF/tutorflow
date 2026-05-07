import React from "react";
import { Search, Filter, Download, CreditCard, ChevronUp, ChevronDown, Calendar, DollarSign, Clock } from "lucide-react";
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
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search name, id, month, status..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onSort('amount')}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:border-indigo-500/30 transition-colors"
          >
            Sort by Amount
            {sortConfig?.key === 'amount' && (
              sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
            )}
          </button>
          <button onClick={onDownloadPDF} className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500 dark:text-slate-400 hover:border-indigo-500/30 transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {fees.map((fee) => (
          <div key={fee.id} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 shadow-sm p-6 flex flex-col gap-4 hover:border-indigo-500/30 transition-all hover:shadow-lg hover:shadow-indigo-500/5 group">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
                {fee.students?.photo ? (
                  <img src={fee.students.photo} alt={fee.students.name} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  fee.students?.name.charAt(0)
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors truncate">{fee.students?.name}</h3>
                <span className={cn(
                  "inline-flex items-center px-2 py-0.5 mt-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
                  fee.status === 'paid' ? "bg-indigo-100 text-indigo-700" : 
                  fee.status === 'unpaid' ? "bg-red-100 text-red-700" :
                  "bg-orange-100 text-orange-700"
                )}>
                  {fee.status}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-4 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</p>
              <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight">৳{fee.amount}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Calendar className="w-4 h-4 text-slate-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Fee Month</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {fee.fee_month ? new Date(fee.fee_month + '-01').toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'N/A'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Clock className="w-4 h-4 text-slate-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Payment Date</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {new Date(fee.payment_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            {fee.status === 'due' && (
              <div className="flex items-center gap-2 mt-auto">
                <button 
                  onClick={() => onMarkAsPaid(fee.id)}
                  className="flex-1 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl text-sm font-bold transition-all active:scale-95"
                >
                  Mark Paid
                </button>
                <button 
                  onClick={() => onMarkAsUnpaid(fee.id)}
                  className="flex-1 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl text-sm font-bold transition-all active:scale-95"
                >
                  Unpaid
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {fees.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700">
          <CreditCard className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-lg font-bold text-slate-900 dark:text-white">No records found</p>
          <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or search term</p>
        </div>
      )}
    </div>
  );
};
