import React from "react";
import { cn } from "../../../../lib/utils";
import { ExpenseCategory } from "../../types/expense.types";
import { categoryIcons } from "../../constants/expenseConstants";

interface CategoryFieldsProps {
  current: ExpenseCategory;
  onChange: (cat: ExpenseCategory) => void;
}

export const CategoryFields: React.FC<CategoryFieldsProps> = ({ current, onChange }) => {
  return (
    <div>
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Category</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {(['Transport', 'Books', 'Supplies', 'Food', 'Stationery', 'Rent', 'Utilities', 'Salaries', 'Marketing', 'Miscellaneous', 'Others'] as ExpenseCategory[]).map(cat => (
          <button
            key={cat} type="button" onClick={() => onChange(cat)}
            className={cn(
              "px-2 py-3 rounded-xl border-2 text-[10px] font-bold uppercase transition-all flex flex-col items-center gap-2",
              current === cat ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400 hover:border-slate-200"
            )}
          >
            {React.createElement(categoryIcons[cat], { className: "w-4 h-4" })} {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
