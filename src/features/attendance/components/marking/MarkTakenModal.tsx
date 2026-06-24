import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, Clock, Save } from "lucide-react";
import { cn } from "../../../../lib/utils";

interface MarkTakenModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingClass: any | null;
  onConfirm: (takenDate: string, shift: 'Morning' | 'Evening') => void;
}

export const MarkTakenModal: React.FC<MarkTakenModalProps> = ({
  isOpen,
  onClose,
  pendingClass,
  onConfirm
}) => {
  const [takenDate, setTakenDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      setTakenDate(today);
      if (pendingClass) {
        setTime(pendingClass.startTime || "10:00");
      }
    }
  }, [isOpen, pendingClass]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!takenDate || !time) return;
    onConfirm(takenDate, time as any);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && pendingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 dark:border-slate-700"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-700/60 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase">
                  Mark Class as Taken
                </h2>
                <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mt-0.5">
                  Class: {pendingClass.className} ({pendingClass.date})
                </p>
              </div>
              <button 
                onClick={onClose} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  <span>Class Taken Date</span>
                </label>
                <input 
                  type="date"
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-bold text-slate-800 dark:text-white"
                  value={takenDate}
                  onChange={e => setTakenDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  <span>Class Time ({pendingClass.subject || 'Class'})</span>
                </label>
                <input 
                  type="time"
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-bold text-slate-800 dark:text-white"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                />
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/20 p-3.5 rounded-xl border border-amber-200/50 dark:border-amber-500/15">
                <p className="text-[10px] font-medium text-amber-700 dark:text-amber-400 leading-relaxed">
                  Completing this action will save the attendance for all students in this class as <strong>Caught Up</strong> and increase their attendance count.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Progress</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
