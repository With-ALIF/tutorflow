import React, { useState } from "react";
import { Plus, Search, Layers, RefreshCw } from "lucide-react";
import { useBatches } from "./hooks/useBatches";
import { useStudents } from "../students/hooks/useStudents";
import { BatchCard } from "./components/BatchCard";
import { BatchModal } from "./components/BatchModal";
import { AddStudentModal } from "../students/components/AddStudentModal";
import { Batch } from "./types/batch.types";
import { motion, AnimatePresence } from "motion/react";

export default function BatchPage() {
  const { batches, loading: batchesLoading, addBatch, updateBatch, deleteBatch } = useBatches();
  const { students, loading: studentsLoading, addStudent } = useStudents();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [selectedBatchForStudent, setSelectedBatchForStudent] = useState<string>("");
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);

  const filteredBatches = batches.filter(batch => 
    batch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loading = batchesLoading || studentsLoading;

  if (loading) return (
    <div className="p-8 text-center flex flex-col items-center gap-4 justify-center min-h-[400px]">
      <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing batches...</p>
    </div>
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <Layers className="w-5 h-5" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Batch Management</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs ml-1">
            Organize students and schedules by batch
          </p>
        </div>

        <button 
          onClick={() => { setEditingBatch(null); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 uppercase tracking-widest text-xs"
        >
          <Plus className="w-5 h-5" />
          Create New Batch
        </button>
      </header>

      <div className="relative max-w-xl">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text"
          placeholder="Search batches..."
          className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 rounded-[2rem] text-sm font-bold shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        <AnimatePresence mode="popLayout">
          {filteredBatches.map((batch) => (
            <motion.div
              key={batch.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <BatchCard 
                batch={batch} 
                students={students}
                onEdit={(b) => { setEditingBatch(b); setIsModalOpen(true); }}
                onDelete={(id) => confirm("Are you sure you want to delete this batch?") && deleteBatch(id)}
                onAddStudent={(batchName) => {
                  setSelectedBatchForStudent(batchName);
                  setIsAddStudentOpen(true);
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredBatches.length === 0 && (
        <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-900/20 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-200 dark:text-slate-700 shadow-sm">
              <Layers className="w-10 h-10" />
            </div>
            <div>
              <p className="text-slate-900 dark:text-white font-black uppercase tracking-tight text-lg">No batches found</p>
              <p className="text-slate-400 text-sm font-medium">Create your first batch to start organizing students.</p>
            </div>
          </div>
        </div>
      )}

      <BatchModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addBatch}
        onUpdate={updateBatch}
        batch={editingBatch}
      />

      <AddStudentModal 
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onSave={addStudent}
        initialBatch={selectedBatchForStudent}
      />
    </div>
  );
}
