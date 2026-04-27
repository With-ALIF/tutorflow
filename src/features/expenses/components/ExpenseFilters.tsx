import React from "react";
import { Calendar, User as UserIcon } from "lucide-react";
import { Student } from "../../students/types/student.types";

interface ExpenseFiltersProps {
  filterMonth: string;
  setFilterMonth: (val: string) => void;
  filterStudentId: string;
  setFilterStudentId: (val: string) => void;
  students: Student[];
  totalExpenses: number;
}

export const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  filterMonth, setFilterMonth, filterStudentId, setFilterStudentId, students, totalExpenses
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-emerald-500" />
        <input 
          type="month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}
          className="bg-slate-100 dark:bg-slate-900 border-none rounded-xl text-xs font-bold px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>
      <div className="flex items-center gap-2">
        <UserIcon className="w-4 h-4 text-emerald-500" />
        <select 
          value={filterStudentId} onChange={(e) => setFilterStudentId(e.target.value)}
          className="bg-slate-100 dark:bg-slate-900 border-none rounded-xl text-xs font-bold px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-700 dark:text-slate-300"
        >
          <option value="all">All Students</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div className="ml-auto">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Total for filter</p>
        <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 leading-none mt-1">৳{totalExpenses}</p>
      </div>
    </div>
  );
};
