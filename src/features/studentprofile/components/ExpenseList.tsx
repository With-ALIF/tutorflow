import React from "react";
import { Receipt, Calendar, TrendingDown } from "lucide-react";
import { Expense } from "../../expenses/types/expense.types";
import { cn } from "../../../lib/utils";

interface ExpenseListProps {
  expenses: Expense[];
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses }) => {
  // Group expenses by month
  const groupedExpenses = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = {
        total: 0,
        items: []
      };
    }
    acc[month].items.push(expense);
    acc[month].total += expense.amount;
    return acc;
  }, {} as Record<string, { total: number, items: Expense[] }>);

  const months = Object.keys(groupedExpenses);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-50 dark:bg-red-500/10 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Personal Expenses</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Student Specific Costs</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-red-50 dark:bg-red-500/10 rounded-lg">
          <span className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest">
            Total: ৳{expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[500px]">
        {months.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
              <Receipt className="w-8 h-8 text-slate-300 dark:text-slate-700" />
            </div>
            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium italic">No expenses recorded for this student.</p>
          </div>
        ) : (
          months.map((month) => (
            <div key={month} className="space-y-3">
              <div className="flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800 py-1 z-10">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">{month}</span>
                </div>
                <span className="text-[10px] font-bold text-red-500 uppercase">Monthly: ৳{groupedExpenses[month].total.toLocaleString()}</span>
              </div>
              <div className="space-y-2">
                {groupedExpenses[month].items.map((expense) => (
                  <div 
                    key={expense.id} 
                    className="group p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-transparent hover:border-red-100 dark:hover:border-red-500/20 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm group-hover:text-red-500 transition-colors">
                          <Receipt className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{expense.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase border border-slate-100 dark:border-slate-700">
                              {expense.category}
                            </span>
                            <span className="text-[9px] text-slate-400">{new Date(expense.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-sm font-mono font-black text-red-500">
                        -৳{expense.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
