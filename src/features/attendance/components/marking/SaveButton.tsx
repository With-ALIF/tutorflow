import React from "react";
import { Save } from "lucide-react";

interface SaveButtonProps {
  onSave: () => void;
  saving: boolean;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ onSave, saving }) => {
  return (
    <div className="p-8 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex justify-end">
      <button 
        onClick={onSave}
        disabled={saving}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all disabled:opacity-50 shadow-xl shadow-indigo-500/20 active:scale-95"
      >
        <Save className="w-5 h-5" />
        {saving ? "Saving..." : "Save Attendance"}
      </button>
    </div>
  );
};
