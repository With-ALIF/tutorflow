import React, { useState } from "react";
import { motion } from "motion/react";
import { Expense, NewExpense } from "../../types/expense.types";
import { Student } from "../../../students/types/student.types";
import { ExpenseForm } from "./ExpenseForm";

const XIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);

interface ExpenseModalProps {
  onClose: () => void;
  onSave: (data: NewExpense | Expense) => Promise<void>;
  expense: Expense | null;
  students: Student[];
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ onClose, onSave, expense, students }) => {
  const [formData, setFormData] = useState<Partial<Expense>>({
    title: expense?.title || "",
    amount: expense?.amount || 0,
    category: expense?.category || "Others",
    date: expense?.date || new Date().toISOString().split('T')[0],
    studentId: expense?.studentId || "",
    studentName: expense?.studentName || ""
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{expense ? "Edit Expense" : "New Expense"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"><XIcon className="w-5 h-5 text-slate-400" /></button>
        </div>
        <ExpenseForm formData={formData} setFormData={setFormData} students={students} onSave={onSave} onClose={onClose} expense={expense} />
      </motion.div>
    </div>
  );
};
