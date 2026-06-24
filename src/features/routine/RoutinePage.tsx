import React, { useState, useMemo } from "react";
import { Plus, Calendar, Clock } from "lucide-react";
import { RoutineCalendar } from "./components/RoutineCalendar";
import { RoutineModal } from "./components/RoutineModal";
import { useRoutine } from "./hooks/useRoutine";
import { useStudents } from "../students/hooks/useStudents";
import { Routine } from "./types/routine.types";
import { motion, AnimatePresence } from "motion/react";
import { ConfirmationModal } from "../../components/ConfirmationModal";

export const RoutinePage: React.FC = () => {
  const { routines, loading: routineLoading, addRoutine, updateRoutine, deleteRoutine } = useRoutine();
  const { students, loading: studentsLoading } = useStudents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [deleteRoutineId, setDeleteRoutineId] = useState<string | null>(null);

  const handleSave = async (data: any) => {
    if (editingRoutine) {
      await updateRoutine(editingRoutine.id, data);
    } else {
      await addRoutine(data);
    }
    setIsModalOpen(false);
    setEditingRoutine(null);
  };

  const loading = routineLoading || studentsLoading;

  const filteredRoutines = useMemo(() => {
    if (!routines || !students) return [];
    return routines.filter(r => 
      students.some(s => (s.class === r.className || s.name === r.className) && s.status !== 'finished')
    );
  }, [routines, students]);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading routine...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <Calendar className="w-5 h-5" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Batch Routine</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium ml-1">Weekly class schedule management for all your tuition batches.</p>
        </div>

        <button 
          onClick={() => { setEditingRoutine(null); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95 uppercase tracking-widest text-xs"
        >
          <Plus className="w-5 h-5" />
          Add Schedule
        </button>
      </header>

      <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl sm:rounded-[2.5rem] p-3 sm:p-6 lg:p-10 border border-white dark:border-slate-800 shadow-inner">
        <RoutineCalendar 
          routines={filteredRoutines} 
          students={students}
          onEdit={(r) => { setEditingRoutine(r); setIsModalOpen(true); }} 
          onDelete={(id) => setDeleteRoutineId(id)} 
        />
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <RoutineModal 
            onClose={() => { setIsModalOpen(false); setEditingRoutine(null); }}
            onSave={handleSave}
            routine={editingRoutine}
          />
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={!!deleteRoutineId}
        onClose={() => setDeleteRoutineId(null)}
        onConfirm={() => {
          if (deleteRoutineId) {
            deleteRoutine(deleteRoutineId);
          }
        }}
        title="Delete Schedule"
        description="Are you sure you want to delete this schedule? This class time indicator will be removed from your routine. This action cannot be undone."
      />
    </div>
  );
};
