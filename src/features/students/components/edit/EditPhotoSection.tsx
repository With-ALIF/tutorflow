import React from "react";
import { Users } from "lucide-react";
import { cn } from "../../../../lib/utils";
import { Student } from "../../types/student.types";

interface EditPhotoSectionProps {
  editingStudent: Student;
  onChange: (updates: Partial<Student>) => void;
}

export const EditPhotoSection: React.FC<EditPhotoSectionProps> = ({ editingStudent, onChange }) => {
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => onChange({ photo: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
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
            value={editingStudent.photo?.startsWith('data:') ? '' : editingStudent.photo || ''}
            onChange={e => onChange({ photo: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};
