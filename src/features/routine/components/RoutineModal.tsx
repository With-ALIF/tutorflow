import React, { useState, useEffect } from "react";
import { X, Clock, BookOpen, Layers } from "lucide-react";
import { motion } from "motion/react";
import { Routine, DayOfWeek } from "../types/routine.types";
import { batchService } from "../../batches/services/batchService";

interface RoutineModalProps {
  onClose: () => void;
  onSave: (routine: any) => void;
  routine?: Routine | null;
}

const days: DayOfWeek[] = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const RoutineModal: React.FC<RoutineModalProps> = ({ onClose, onSave, routine }) => {
  const [availableBatchNames, setAvailableBatchNames] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    batchName: routine?.batchName || "",
    day: routine?.day || "Saturday",
    startTime: routine?.startTime || "10:00",
    endTime: routine?.endTime || "11:30",
    subject: routine?.subject || "",
    room: routine?.room || "",
    color: routine?.color || "#4f46e5",
    shift: routine?.shift || "Morning"
  });

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const batches = await batchService.fetchBatches();
        const batchNames = batches.map(b => b.name).filter(Boolean);
        setAvailableBatchNames(batchNames);
      } catch (error) {
        console.error("Error fetching batches for modal:", error);
      }
    };
    fetchBatches();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            {routine ? "Edit Class" : "New Class Row"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200/50 dark:hover:bg-slate-700 rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Batch Name</label>
            <div className="relative">
              <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
              <select 
                required
                className="w-full pl-11 pr-10 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white appearance-none"
                value={formData.batchName}
                onChange={e => setFormData({ ...formData, batchName: e.target.value })}
              >
                <option value="" disabled>Select Batch</option>
                {availableBatchNames.map(b => <option key={b} value={b}>{b}</option>)}
                {availableBatchNames.length === 0 && <option value="" disabled>No batches found</option>}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Day</label>
              <select 
                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white"
                value={formData.day}
                onChange={e => setFormData({ ...formData, day: e.target.value as DayOfWeek })}
              >
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Subject</label>
              <div className="relative">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white"
                  placeholder="e.g. Math"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Start Time</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="time"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white"
                  value={formData.startTime}
                  onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">End Time</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="time"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white"
                  value={formData.endTime}
                  onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Shift (শিফট)</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, shift: "Morning" })}
                className={`py-3.5 px-4 rounded-2xl font-bold text-sm border-2 transition-all flex items-center justify-center gap-2 ${
                  formData.shift === "Morning"
                    ? "bg-amber-50 dark:bg-amber-500/5 text-amber-600 dark:text-amber-400 border-amber-500 shadow-lg shadow-amber-500/10"
                    : "bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                }`}
              >
                <span>☀️ Morning</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, shift: "Evening" })}
                className={`py-3.5 px-4 rounded-2xl font-bold text-sm border-2 transition-all flex items-center justify-center gap-2 ${
                  formData.shift === "Evening"
                    ? "bg-indigo-50 dark:bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 border-indigo-500 shadow-lg shadow-indigo-500/10"
                    : "bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                }`}
              >
                <span>⛅ Evening</span>
              </button>
            </div>
          </div>

          <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/10 active:scale-95 uppercase tracking-widest text-xs">
            {routine ? "Update Routine" : "Save Routine"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
