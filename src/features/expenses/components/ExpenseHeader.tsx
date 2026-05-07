import React from "react";
import { Plus } from "lucide-react";

interface ExpenseHeaderProps {
  onAddClick: () => void;
}

export const ExpenseHeader: React.FC<ExpenseHeaderProps> = ({ onAddClick }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 className="text-2xl min-[400px]:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight pb-1 whitespace-nowrap">
          Expense Tracker
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
          Keep track of your teaching related costs
        </p>
      </div>
      <button 
        onClick={onAddClick}
        className="flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95 group"
      >
        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        <span>Add Expense</span>
      </button>
    </div>
  );
};
