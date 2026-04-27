import React from "react";
import { Users, Edit2, Trash2, Layers, UserPlus } from "lucide-react";
import { Batch } from "../types/batch.types";
import { Student } from "../../students/types/student.types";

interface BatchCardProps {
  batch: Batch;
  students: Student[];
  onEdit: (batch: Batch) => void;
  onDelete: (id: string) => void;
  onAddStudent: (batchName: string) => void;
}

export const BatchCard: React.FC<BatchCardProps> = ({ batch, students, onEdit, onDelete, onAddStudent }) => {
  const batchStudents = students.filter(s => s.batch === batch.name);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-slate-200/60 dark:border-slate-700 shadow-sm transition-all group relative">
      <div 
        className="absolute top-0 left-0 w-full h-2 rounded-t-[2rem]"
        style={{ backgroundColor: batch.color || '#4f46e5' }}
      />
      
      <div className="flex flex-col gap-6 mt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 transition-all">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{batch.name}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{batchStudents.length} Students</p>
            </div>
          </div>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onEdit(batch)}
              className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 rounded-xl transition-all"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onDelete(batch.id)}
              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-xl transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {batch.description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[2.5rem]">
            {batch.description}
          </p>
        )}

        <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Students Enrolled</span>
            </div>
            <button 
              onClick={() => onAddStudent(batch.name)}
              className="flex items-center gap-1 px-2 py-1 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all border border-indigo-100 dark:border-indigo-800/50"
            >
              <UserPlus className="w-2.5 h-2.5" />
              Add Student
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {batchStudents.slice(0, 5).map(s => (
              <div 
                key={s.id}
                title={s.name}
                className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center text-[10px] font-black text-indigo-600 dark:text-indigo-400 overflow-hidden"
              >
                {s.photo ? (
                  <img src={s.photo} alt={s.name} className="w-full h-full object-cover" />
                ) : (
                  s.name.charAt(0)
                )}
              </div>
            ))}
            {batchStudents.length > 5 && (
              <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[8px] font-bold text-slate-500">
                +{batchStudents.length - 5}
              </div>
            )}
            {batchStudents.length === 0 && (
              <p className="text-[10px] text-slate-400 italic">No students assigned yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
