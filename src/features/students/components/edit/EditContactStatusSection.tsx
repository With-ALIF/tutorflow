import React from "react";
import { cn } from "../../../../lib/utils";
import { Student } from "../../types/student.types";

interface EditContactStatusSectionProps {
  editingStudent: Student;
  onChange: (updates: Partial<Student>) => void;
}

export const EditContactStatusSection: React.FC<EditContactStatusSectionProps> = ({ editingStudent, onChange }) => {
  const toggleStatus = () => {
    const isFinished = editingStudent.status === 'finished';
    onChange({
      status: isFinished ? 'active' : 'finished',
      end_date: isFinished ? undefined : new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
        <input required type="tel" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white" value={editingStudent.phone || ""} onChange={e => onChange({ phone: e.target.value })} />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Telegram Chat ID (Optional)</label>
        <input type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white" placeholder="e.g. 129384729" value={editingStudent.telegram_chat_id || ""} onChange={e => onChange({ telegram_chat_id: e.target.value })} />
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">If set, student/parent will receive automated present/absent alerts.</p>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Joining Date</label>
        <input required type="date" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white" value={editingStudent.join_date ? editingStudent.join_date.split('T')[0] : ""} onChange={e => onChange({ join_date: e.target.value })} />
      </div>
      <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Session Status</label>
          <button 
            type="button" 
            onClick={toggleStatus} 
            className={cn(
              "px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all shadow-lg", 
              editingStudent.status === 'finished' 
                ? "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-500/30 shadow-amber-500/10" 
                : "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-500/30 shadow-indigo-500/10"
            )}
          >
            {editingStudent.status === 'finished' ? 'Finished' : 'Active'}
          </button>
        </div>
        {editingStudent.status === 'finished' && (
          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">End Date</label>
            <input type="date" className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white" value={editingStudent.end_date ? editingStudent.end_date.split('T')[0] : ''} onChange={e => onChange({ end_date: e.target.value })} />
          </div>
        )}
      </div>
    </div>
  );
};
