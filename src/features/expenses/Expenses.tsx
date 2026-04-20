import React, { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { useExpenses } from "./hooks/useExpenses";
import { Expense, NewExpense } from "./types/expense.types";
import { studentService } from "../students/services/studentService";
import { Student } from "../students/types/student.types";
import { ExpenseHeader } from "./components/ExpenseHeader";
import { ExpenseFilters } from "./components/ExpenseFilters";
import { ExpenseTable } from "./components/ExpenseTable";
import { ExpenseModal } from "./components/ExpenseModal/ExpenseModal";

export const Expenses: React.FC = () => {
  const { expenses, loading, addExpense, deleteExpense, updateExpense } = useExpenses();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [studentId, setStudentId] = useState("all");

  useEffect(() => {
    studentService.fetchStudents().then(list => setStudents(list.filter(s => s.status !== 'finished')));
  }, []);

  const filtered = expenses.filter(e => e.date.startsWith(month) && (studentId === "all" || e.studentId === studentId));
  const total = filtered.reduce((sum, e) => sum + e.amount, 0);

  const handleSave = async (data: NewExpense | Expense) => {
    'id' in data ? await updateExpense(data as Expense) : await addExpense(data as NewExpense);
    setIsModalOpen(false); setEditingExpense(null);
  };

  if (loading && expenses.length === 0) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div></div>;

  return (
    <div className="space-y-8 pb-20">
      <ExpenseHeader onAddClick={() => setIsModalOpen(true)} />
      <ExpenseFilters filterMonth={month} setFilterMonth={setMonth} filterStudentId={studentId} setFilterStudentId={setStudentId} students={students} totalExpenses={total} />
      <ExpenseTable expenses={filtered} onEdit={(e) => { setEditingExpense(e); setIsModalOpen(true); }} onDelete={deleteExpense} />
      <AnimatePresence>
        {isModalOpen && <ExpenseModal onClose={() => { setIsModalOpen(false); setEditingExpense(null); }} onSave={handleSave} expense={editingExpense} students={students} />}
      </AnimatePresence>
    </div>
  );
};
