import React from "react";
import { Student } from "../../../students/types/student.types";
import { Expense, NewExpense } from "../../types/expense.types";
import { CategoryFields } from "./CategoryFields";

interface ExpenseFormProps {
  formData: Partial<Expense>;
  setFormData: (data: Partial<Expense>) => void;
  students: Student[];
  onSave: (data: NewExpense | Expense) => Promise<void>;
  onClose: () => void;
  expense: Expense | null;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ 
  formData, setFormData, students, onSave, onClose, expense 
}) => {
  const handleStudentChange = (id: string) => {
    const student = students.find(s => s.id === id);
    setFormData({ ...formData, studentId: id || "", studentName: student?.name || "" });
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSave(expense ? { ...formData, id: expense.id } as Expense : formData as NewExpense);
    }} className="flex flex-col overflow-hidden">
      <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Description</label>
          <input required type="text" placeholder="e.g. Rickshaw fare" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all dark:text-white font-medium" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Student (Optional)</label>
          <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all dark:text-white font-medium" value={formData.studentId} onChange={e => handleStudentChange(e.target.value)}>
            <option value="">General Expense</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input required type="number" placeholder="Amount (৳)" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all dark:text-white font-mono font-bold" value={formData.amount} onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })} />
          <input required type="date" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all dark:text-white font-medium" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
        </div>
        <CategoryFields current={formData.category || "Others"} onChange={cat => setFormData({ ...formData, category: cat })} />
      </div>
      <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex gap-3 shrink-0">
        <button type="button" onClick={onClose} className="flex-1 px-4 py-4 border-2 border-slate-100 dark:border-slate-700 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-colors uppercase text-xs">Cancel</button>
        <button type="submit" className="flex-1 px-4 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-colors shadow-lg uppercase text-xs tracking-widest">{expense ? "Update" : "Confirm"}</button>
      </div>
    </form>
  );
};
