import React from "react";
import { Receipt } from "lucide-react";
import { Expense } from "../types/expense.types";
import { Student } from "../../../types/student";
import { ExpenseTableRow } from "./ExpenseTableRow";

interface ExpenseTableProps {
  expenses: Expense[];
  students: Student[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, students, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Receipt className="w-4 h-4 text-emerald-500" /> Expense Records
        </h3>
        <span className="px-3 py-1 bg-white dark:bg-slate-900 rounded-lg text-[10px] font-bold text-slate-500 uppercase">{expenses.length} Records</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-100 dark:border-slate-700">
              <th className="px-6 py-4">Title & Date</th>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {expenses.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm italic font-medium">No expenses for this filter</td></tr>
            ) : (
              expenses.map(expense => {
                const student = students.find(s => s.id === expense.studentId);
                return (
                  <ExpenseTableRow 
                    key={expense.id} 
                    expense={expense} 
                    student={student}
                    onEdit={onEdit} 
                    onDelete={onDelete} 
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
