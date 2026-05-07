import React, { useState, useEffect } from "react";
import { X, Layers, Type, Palette } from "lucide-react";
import { Batch, NewBatch } from "../types/batch.types";
import { motion, AnimatePresence } from "motion/react";

interface BatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (batch: NewBatch) => void;
  onUpdate: (id: string, batch: Partial<Batch>) => void;
  batch: Batch | null;
}

export const BatchModal: React.FC<BatchModalProps> = ({ isOpen, onClose, onSubmit, onUpdate, batch }) => {
  const [formData, setFormData] = useState<NewBatch>({
    name: "",
    description: "",
    color: "#4f46e5"
  });

  useEffect(() => {
    if (batch) {
      setFormData({
        name: batch.name,
        description: batch.description || "",
        color: batch.color || "#4f46e5"
      });
    } else {
      setFormData({
        name: "",
        description: "",
        color: "#4f46e5"
      });
    }
  }, [batch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (batch) {
      onUpdate(batch.id, formData);
    } else {
      onSubmit(formData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-[2.5rem] w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
      >
        <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                {batch ? "Edit Batch" : "Add New Batch"}
              </h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Configure Student Group</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Batch Name</label>
              <div className="relative">
                <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white"
                  placeholder="e.g. Batch 01"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Description</label>
              <textarea 
                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white h-24 resize-none"
                placeholder="Batch details..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

          </div>

          <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/10 active:scale-95 uppercase tracking-widest text-xs">
            {batch ? "Update Batch" : "Create Batch"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
