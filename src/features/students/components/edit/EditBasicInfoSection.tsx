import React from "react";
import { Layers } from "lucide-react";
import { Student } from "../../types/student.types";
import { useBatches } from "../../../batches/hooks/useBatches";

interface EditBasicInfoSectionProps {
  editingStudent: Student;
  onChange: (updates: Partial<Student>) => void;
}

export const EditBasicInfoSection: React.FC<EditBasicInfoSectionProps> = ({ editingStudent, onChange }) => {
  const { batches } = useBatches();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
        <input required type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white" value={editingStudent.name} onChange={e => onChange({ name: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Class</label>
          <input required type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white" value={editingStudent.class} onChange={e => onChange({ class: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Subject</label>
          <input required type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white" value={editingStudent.subject} onChange={e => onChange({ subject: e.target.value })} />
        </div>
        <div className="col-span-2 lg:col-span-1">
          <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Assigned Batch</label>
          <div className="relative">
            <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <select 
              required 
              className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white text-sm appearance-none"
              value={editingStudent.batch || ""} 
              onChange={e => onChange({ batch: e.target.value })}
            >
              <option value="">Select Batch</option>
              {batches.map(b => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Address</label>
        <textarea required rows={2} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none dark:text-white" value={editingStudent.address || ""} onChange={e => onChange({ address: e.target.value })} />
      </div>
    </div>
  );
};
