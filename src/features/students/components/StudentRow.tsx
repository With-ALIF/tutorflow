import React from "react";
import { Link } from "react-router-dom";
import { Phone, BookOpen, Edit2, Trash2 } from "lucide-react";
import { Student } from "../types/student.types";
import { cn } from "../../../lib/utils";

interface StudentRowProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

export const StudentRow: React.FC<StudentRowProps> = ({ student, onEdit, onDelete }) => {
  return (
    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
      <td className="px-6 py-4">
        <Link to={`/students/${student.id}`} className="flex items-center gap-4">
          {student.photo ? (
            <img src={student.photo} alt={student.name} className="w-12 h-12 rounded-2xl object-cover transition-transform group-hover:scale-110" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg transition-transform group-hover:scale-110">
              {student.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{student.name}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter">ID: {student.id.slice(0, 8)}</p>
          </div>
        </Link>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{student.class}</span>
            {student.batch && <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-tight">{student.batch}</span>}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
            <Phone className="w-4 h-4" />
          </div>
          <a 
            href={`https://wa.me/${student.phone.replace(/[^0-9]/g, '').replace(/^0/, '880')}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {student.phone}
          </a>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">৳{student.monthly_fee}</span>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">{student.lectures_per_month || 12}</span>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">৳{Math.round(student.monthly_fee / (student.lectures_per_month || 12))}</span>
      </td>
      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-medium">
        {new Date(student.join_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
      </td>
      <td className="px-6 py-4">
        <span className={cn(
          "px-2 py-1 rounded-lg text-[10px] font-bold uppercase", 
          student.status === 'finished' 
            ? "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" 
            : "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
        )}>
          {student.status === 'finished' ? 'Finished' : (student.status || 'Active')}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => onEdit(student)}
            className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(student.id)}
            className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};
