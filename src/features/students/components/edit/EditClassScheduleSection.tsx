import React from "react";
import { cn } from "../../../../lib/utils";
import { Student } from "../../types/student.types";

interface EditClassScheduleSectionProps {
  editingStudent: Student;
  onChange: (updates: Partial<Student>) => void;
}

export const EditClassScheduleSection: React.FC<EditClassScheduleSectionProps> = ({ editingStudent, onChange }) => {
  const daysOfWeek = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  const toggleDay = (day: string) => {
    const currentDays = editingStudent.class_days || [];
    const newDays = currentDays.includes(day) 
      ? currentDays.filter(d => d !== day) 
      : [...currentDays, day];
    onChange({ class_days: newDays });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Monthly Fee ($)</label>
        <input 
          required 
          type="number" 
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
          placeholder="0" 
          value={editingStudent.monthly_fee === 0 ? "" : editingStudent.monthly_fee} 
          onChange={e => onChange({ monthly_fee: e.target.value === "" ? 0 : Number(e.target.value) })} 
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Lectures / Month</label>
        <input 
          required 
          type="number" 
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
          placeholder="12" 
          value={editingStudent.lectures_per_month === 0 ? "" : editingStudent.lectures_per_month} 
          onChange={e => onChange({ lectures_per_month: e.target.value === "" ? 0 : Number(e.target.value) })} 
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Lectures / Week</label>
        <input 
          required 
          type="number" 
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
          placeholder="3" 
          value={editingStudent.lectures_per_week === 0 ? "" : editingStudent.lectures_per_week} 
          onChange={e => onChange({ lectures_per_week: e.target.value === "" ? 0 : Number(e.target.value) })} 
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Class Days</label>
        <div className="flex flex-wrap gap-2">
          {daysOfWeek.map(day => (
            <button 
              key={day} 
              type="button" 
              onClick={() => toggleDay(day)} 
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all", 
                editingStudent.class_days?.includes(day) 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" 
                  : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
              )}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Class Time</label>
        <input 
          type="time" 
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white" 
          value={editingStudent.class_time || "10:00"} 
          onChange={e => onChange({ class_time: e.target.value })} 
        />
      </div>
    </div>
  );
};
