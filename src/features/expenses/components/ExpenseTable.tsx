import React from "react";
import { Receipt, Trash2, Edit2, User as UserIcon, Calendar, Activity, ChevronUp, ChevronDown } from "lucide-react";
import { Expense } from "../types/expense.types";
import { Student } from "../../../types/student";
import { cn } from "../../../lib/utils";
import { categoryIcons, categoryColors } from "../constants/expenseConstants";

interface ExpenseTableProps {
  expenses: Expense[];
  students: Student[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, students, onEdit, onDelete }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {expenses.map((expense) => {
          const student = students.find(s => s.id === expense.studentId);
          const Icon = categoryIcons[expense.category] || Activity;

          return (
            <div key={expense.id} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 shadow-sm p-6 flex flex-col gap-6 hover:border-indigo-500/30 transition-all hover:shadow-lg hover:shadow-indigo-500/5 group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg", categoryColors[expense.category])}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors line-clamp-1" title={expense.title}>{expense.title}</h3>
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 mt-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                      categoryColors[expense.category]
                    )}>
                      {expense.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-left">
                <p className="text-3xl font-black text-red-500 dark:text-red-400 tracking-tight">-৳{expense.amount}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Amount Spended</p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Date</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {new Date(expense.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Student</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate" title={expense.studentName || 'General'}>
                      {expense.studentName || 'General'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-auto">
                <button 
                  onClick={() => onEdit(expense)}
                  className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 rounded-xl text-sm font-bold transition-all active:scale-95"
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button 
                  onClick={() => confirm("Are you sure you want to delete this expense?") && onDelete(expense.id)}
                  className="p-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 rounded-xl transition-all active:scale-95"
                  title="Delete Expense"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {expenses.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700">
          <Receipt className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-lg font-bold text-slate-900 dark:text-white">No expense records found</p>
          <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or add a new expense</p>
        </div>
      )}
    </div>
  );
};

