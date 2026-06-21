import React from "react";
import { Routine } from "../types/routine.types";
import { Student } from "../../students/types/student.types";
import { RoutineCardHeader } from "./RoutineCardHeader";
import { RoutineCardDetails } from "./RoutineCardDetails";
import { RoutineCardStudents } from "./RoutineCardStudents";

interface RoutineCardProps {
  routine: Routine;
  students: Student[];
  onEdit: (routine: Routine) => void;
  onDelete: (id: string) => void;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({ routine, students, onEdit, onDelete }) => (
  <div className="group relative bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm transition-all text-sm">
    <div 
      className="absolute top-0 left-6 right-6 h-1 rounded-b-full opacity-60"
      style={{ backgroundColor: routine.color || '#4f46e5' }}
    />
    <div className="flex flex-col gap-4">
      <RoutineCardHeader routine={routine} onEdit={onEdit} onDelete={onDelete} />
      <RoutineCardDetails routine={routine} />
      <RoutineCardStudents batchName={routine.batchName} students={students} />
    </div>
  </div>
);
