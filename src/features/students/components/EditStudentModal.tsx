import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Users, Layers } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Student } from "../types/student.types";
import { useBatches } from "../../batches/hooks/useBatches";

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => Promise<boolean>;
  student: Student | null;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({ isOpen, onClose, onSave, student }) => {
  const { batches } = useBatches();
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (student) setEditingStudent({ ...student });
  }, [student]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingStudent) return;
    const reader = new FileReader();
    reader.onloadend = () => setEditingStudent({ ...editingStudent, photo: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    const success = await onSave(editingStudent);
    if (success) onClose();
  };

  if (!editingStudent) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Student</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
              <div className="p-6 space-y-4 overflow-y-auto">
                <div className="flex flex-col items-center gap-4 mb-2">
                  {editingStudent.photo ? (
                    <img 
                      src={editingStudent.photo} 
                      alt="Preview" 
                      className={cn(
                        "w-24 h-24 rounded-full object-cover border-4 transition-colors",
                        editingStudent.status === 'finished' 
                          ? "border-amber-100 dark:border-amber-500/20" 
                          : "border-indigo-100 dark:border-indigo-500/20"
                      )} 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 border-4 border-slate-50 dark:border-slate-800">
                      <Users className="w-8 h-8" />
                    </div>
                  )}
                  <div className="flex flex-col w-full gap-3">
                    <label className="cursor-pointer bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-semibold transition-colors text-center">
                      Upload Photo
                      <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-[10px] font-bold text-slate-400">URL</span>
                      </div>
                      <input 
                        type="text" 
                        placeholder="Or paste photo URL here..." 
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/10 text-xs dark:text-white"
                        value={editingStudent.photo?.startsWith('data:') ? '' : editingStudent.photo}
                        onChange={e => setEditingStudent({...editingStudent, photo: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                  <input required type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white" value={editingStudent.name} onChange={e => setEditingStudent({...editingStudent, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Class</label>
                    <input required type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white" value={editingStudent.class} onChange={e => setEditingStudent({...editingStudent, class: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Subject</label>
                    <input required type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white" value={editingStudent.subject} onChange={e => setEditingStudent({...editingStudent, subject: e.target.value})} />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Assigned Batch</label>
                    <div className="relative">
                      <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <select 
                        required 
                        className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white text-sm appearance-none"
                        value={editingStudent.batch || ""} 
                        onChange={e => setEditingStudent({...editingStudent, batch: e.target.value})}
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
                  <textarea required rows={2} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none dark:text-white" value={editingStudent.address} onChange={e => setEditingStudent({...editingStudent, address: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Monthly Fee ($)</label>
                    <input required type="number" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white" value={editingStudent.monthly_fee} onChange={e => setEditingStudent({...editingStudent, monthly_fee: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Lectures / Month</label>
                    <input required type="number" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white" value={editingStudent.lectures_per_month} onChange={e => setEditingStudent({...editingStudent, lectures_per_month: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Lectures / Week</label>
                    <input required type="number" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white" value={editingStudent.lectures_per_week} onChange={e => setEditingStudent({...editingStudent, lectures_per_week: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Class Days</label>
                    <div className="flex flex-wrap gap-2">
                       {['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                        <button key={day} type="button" onClick={() => {
                          const days = editingStudent.class_days?.includes(day) ? editingStudent.class_days.filter(d => d !== day) : [...(editingStudent.class_days || []), day];
                          setEditingStudent({...editingStudent, class_days: days});
                        }} className={cn("px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all", editingStudent.class_days?.includes(day) ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600")}>
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                  <input required type="tel" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white" value={editingStudent.phone} onChange={e => setEditingStudent({...editingStudent, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Joining Date</label>
                  <input required type="date" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white" value={editingStudent.join_date} onChange={e => setEditingStudent({...editingStudent, join_date: e.target.value})} />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Session Status</label>
                    <button type="button" onClick={() => {
                      const isFinished = editingStudent.status === 'finished';
                      setEditingStudent({
                        ...editingStudent,
                        status: isFinished ? 'active' : 'finished',
                        end_date: isFinished ? undefined : new Date().toISOString().split('T')[0]
                      });
                    }} className={cn(
                      "px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all shadow-lg", 
                      editingStudent.status === 'finished' 
                        ? "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-500/30 shadow-amber-500/10" 
                        : "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-500/30 shadow-indigo-500/10"
                    )}>
                      {editingStudent.status === 'finished' ? 'Finished' : 'Active'}
                    </button>
                  </div>
                  {editingStudent.status === 'finished' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">End Date</label>
                      <input type="date" className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white" value={editingStudent.end_date || ''} onChange={e => setEditingStudent({...editingStudent, end_date: e.target.value})} />
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex gap-3 shrink-0">
                <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">Update Student</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
