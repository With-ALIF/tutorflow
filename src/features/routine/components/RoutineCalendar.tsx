import React from "react";
import { Routine, DayOfWeek } from "../types/routine.types";
import { Student } from "../../students/types/student.types";
import { RoutineDayColumn } from "./RoutineDayColumn";

interface RoutineCalendarProps {
  routines: Routine[];
  students: Student[];
  onEdit: (routine: Routine) => void;
  onDelete: (id: string) => void;
}

const days: DayOfWeek[] = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const RoutineCalendar: React.FC<RoutineCalendarProps> = ({ routines, students, onEdit, onDelete }) => {
  const groupedRoutines = routines.reduce((acc, r) => {
    // Normalize to handle any case
    const dayKey = (r.day.charAt(0).toUpperCase() + r.day.slice(1).toLowerCase());
    if (!acc[dayKey]) acc[dayKey] = [];
    acc[dayKey].push(r);
    acc[dayKey].sort((a, b) => a.startTime.localeCompare(b.startTime));
    return acc;
  }, {} as Record<string, Routine[]>);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-8">
      {days.map(day => (
        <RoutineDayColumn
          key={day}
          day={day}
          routines={groupedRoutines[day] || []}
          students={students}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
