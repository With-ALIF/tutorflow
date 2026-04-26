import React from "react";
import { Trash2, Edit2, MoreHorizontal, User as UserIcon } from "lucide-react";
import { Expense } from "../types/expense.types";
import { Student } from "../../../types/student";
import { cn } from "../../../lib/utils";
import { categoryIcons, categoryColors } from "../constants/expenseConstants";

interface ExpenseTableRowProps {
  expense: Expense;
  student?: Student;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export const ExpenseTableRow: React.FC<ExpenseTableRowProps> = ({ expense, student, onEdit, onDelete }) => {
  const Icon = categoryIcons[expense.category] || MoreHorizontal;
  return (
    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
      <td className="px-6 py-4">
        <p className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">{expense.title}</p>
        <p className="text-[10px] text-slate-400 mt-0.5">{new Date(expense.date).toLocaleDateString()}</p>
      </td>
      <td className="px-6 py-4">
        {expense.studentName ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
              {student?.photo ? (
                <img 
                  src={student.photo} 
                  alt={expense.studentName} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <UserIcon className="w-3 h-3 text-slate-400" />
              )}
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{expense.studentName}</span>
          </div>
        ) : <span className="text-[10px] text-slate-400 font-medium italic">General</span>}
      </td>
      <td className="px-6 py-4">
        <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-xl", categoryColors[expense.category])}>
          <Icon className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase">{expense.category}</span>
        </div>
      </td>
      <td className="px-6 py-4"><span className="font-mono font-bold text-red-500">-৳{expense.amount}</span></td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => onEdit(expense)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
          <button onClick={() => confirm("Are you sure?") && onDelete(expense.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      </td>
    </tr>
  );
};
