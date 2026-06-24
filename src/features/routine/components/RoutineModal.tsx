import React, { useState, useMemo } from "react";
import { X, Clock, BookOpen, Layers } from "lucide-react";
import { motion } from "motion/react";
import { Routine, DayOfWeek } from "../types/routine.types";
import { useStudents } from "../../students/hooks/useStudents";

interface RoutineModalProps {
  onClose: () => void;
  onSave: (routine: any) => void;
  routine?: Routine | null;
}

const days: DayOfWeek[] = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const RoutineModal: React.FC<RoutineModalProps> = ({ onClose, onSave, routine }) => {
  const { students } = useStudents();
  
  const [formData, setFormData] = useState({
    className: routine?.className || "",
    day: routine?.day || "Saturday",
    startTime: routine?.startTime || "10:00",
    endTime: routine?.endTime || "11:30",
    subject: routine?.subject || ""
  });

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
          <button onClick={onClose} className="p-2 rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col max-h-[85vh]">
          <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Select Student</label>
              <div className="relative">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                <select 
                  required
                  className="w-full pl-11 pr-10 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white appearance-none"
                  value={formData.className ? (students.find(s => s.name === formData.className || s.class === formData.className)?.id || "") : ""}
                  onChange={e => {
                    const studentId = e.target.value;
                    const student = students.find(s => s.id === studentId);
                    if (student) {
                      setFormData({ 
                        ...formData, 
                        className: student.class || student.batch || student.name || "", 
                        subject: student.subject || formData.subject 
                      });
                    }
                  }}
                >
                  <option value="" disabled>Select Student</option>
                  {students
                    .filter(s => s.status !== 'finished' || (routine && (s.name === routine.className || s.class === routine.className)))
                    .map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} {s.class ? `(${s.class.toLowerCase().startsWith('class ') ? s.class : 'Class ' + s.class})` : ""}
                    </option>
                  ))}
                  {students.length === 0 && <option value="" disabled>No students found</option>}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Target Class</label>
              <div className="relative">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                <input 
                  required
                  readOnly
                  placeholder="Auto-filled from student"
                  className="w-full pl-11 pr-10 py-3.5 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold dark:text-white cursor-not-allowed opacity-80"
                  value={formData.className}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Start Time</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="time"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white"
                    value={formData.startTime}
                    onChange={e => {
                      const time = e.target.value;
                      if (!time) return;

                      const [h, m] = time.split(":").map(Number);
                      
                      // Calculate End Time (+75 minutes)
                      const date = new Date();
                      date.setHours(h, m, 0, 0);
                      date.setMinutes(date.getMinutes() + 75);
                      const endH = String(date.getHours()).padStart(2, '0');
                      const endM = String(date.getMinutes()).padStart(2, '0');
                      const calculatedEndTime = `${endH}:${endM}`;

                      setFormData({ 
                        ...formData, 
                        startTime: time, 
                        endTime: calculatedEndTime
                      });
                    }}
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
          </div>

          <div className="p-6 border-t border-slate-100 dark:border-slate-700">
            <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-indigo-600/10 active:scale-95 uppercase tracking-widest text-xs">
              {routine ? "Update Routine" : "Save Routine"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
