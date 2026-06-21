import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";
import { Student } from "../types/student.types";
import { EditPhotoSection } from "./edit/EditPhotoSection";
import { EditBasicInfoSection } from "./edit/EditBasicInfoSection";
import { EditClassScheduleSection } from "./edit/EditClassScheduleSection";
import { EditContactStatusSection } from "./edit/EditContactStatusSection";

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => Promise<boolean>;
  student: Student | null;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({ isOpen, onClose, onSave, student }) => {
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (student) setEditingStudent({ ...student });
  }, [student]);

  const handleUpdate = (updates: Partial<Student>) => {
    setEditingStudent(prev => prev ? { ...prev, ...updates } : null);
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
              <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
              <div className="p-6 space-y-4 overflow-y-auto">
                <EditPhotoSection editingStudent={editingStudent} onChange={handleUpdate} />
                <EditBasicInfoSection editingStudent={editingStudent} onChange={handleUpdate} />
                <EditClassScheduleSection editingStudent={editingStudent} onChange={handleUpdate} />
                <EditContactStatusSection editingStudent={editingStudent} onChange={handleUpdate} />
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
