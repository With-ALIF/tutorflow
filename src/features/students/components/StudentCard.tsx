import React from "react";
import { Link } from "react-router-dom";
import { Phone, BookOpen, Edit2, Trash2, Calendar, DollarSign, Layers } from "lucide-react";
import { Student } from "../types/student.types";
import { cn } from "../../../lib/utils";

interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, onEdit, onDelete }) => {
  const perLecture = Math.round(student.monthly_fee / (student.lectures_per_month || 12));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
      {/* Header with Photo and Basic Info */}
      <div className="flex items-start gap-4 mb-5">
        <Link to={`/students/${student.id}`} className="shrink-0">
          {student.photo ? (
            <img 
              src={student.photo} 
              alt={student.name} 
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-50 dark:ring-slate-900 group-hover:scale-105 transition-transform" 
              referrerPolicy="no-referrer" 
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-2xl ring-4 ring-slate-50 dark:ring-slate-900 group-hover:scale-105 transition-transform">
              {student.name.charAt(0)}
            </div>
          )}
        </Link>
        <div className="flex-1 min-w-0">
          <Link to={`/students/${student.id}`}>
            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors truncate text-lg">
              {student.name}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className={cn(
              "px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider", 
              student.status === 'finished' 
                ? "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" 
                : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
            )}>
              {student.status === 'finished' ? 'Finished' : (student.status || 'Active')}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
              ID: {student.id.slice(0, 8)}
            </span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 flex-1">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <div className="flex flex-col">
              <span className="text-xs font-bold dark:text-slate-300">Class {student.class}</span>
              {student.batch && <span className="text-[9px] text-emerald-500 font-bold uppercase">{student.batch}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-medium dark:text-slate-300">
              {new Date(student.join_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900 dark:text-white">৳{student.monthly_fee}</span>
              <span className="text-[9px] font-bold text-emerald-500">৳{perLecture}/lec</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-medium dark:text-slate-300">{student.lectures_per_month || 12} Lect/m</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Phone className="w-4 h-4" />
          </div>
          <a 
            href={`https://wa.me/${student.phone.replace(/[^0-9]/g, '').replace(/^0/, '880')}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors"
          >
            {student.phone}
          </a>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onEdit(student)}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(student.id)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
