import React from "react";
import { Student, AttendanceStatus } from "../../types/attendance.types";
import { StudentRow } from "./StudentRow";

import { Routine } from "../../../routine/types/routine.types";

interface AttendanceTableProps {
  students: Student[];
  records: Record<string, AttendanceStatus>;
  sessions: any[];
  onStatusChange: (studentId: string, status: AttendanceStatus, shift: 'Morning' | 'Evening') => void;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({ 
  students, 
  records, 
  sessions,
  onStatusChange,
}) => {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-xs text-slate-400 font-medium">No active classes found for this date.</p>
      </div>
    );
  }

  const renderedStudents = new Set<string>();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 pt-0">
      {sessions.map((routine) => {
        const routineTime = routine.startTime || '10:00';
        const batchStudents = students.filter(s => {
          const isMatch = s.class === routine.className || s.name === routine.className;
          const trackingKey = `${s.id}_${routineTime}`;
          if (isMatch && !renderedStudents.has(trackingKey)) {
            return true;
          }
          return false;
        });

        if (batchStudents.length === 0) return null;

        return (
          <div 
            key={`${routine.id}_${routineTime}`} 
            className="p-5 sm:p-6 bg-slate-50/50 dark:bg-slate-900/10 rounded-[2rem] border border-slate-100 dark:border-slate-800/80 space-y-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div 
                  className="w-1.5 h-4 rounded-full bg-indigo-500" 
                />
                <h5 className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                  {routine.className} • {routineTime} • {routine.subject || 'Class'}
                </h5>
              </div>
          <div className="grid grid-cols-1 gap-4">
                 {batchStudents.map((student) => {
                   const trackingKey = `${student.id}_${routineTime}`;
                   renderedStudents.add(trackingKey);

                   let recordKey = `${student.id}_${routineTime}`;
                   let realStatus = records[recordKey];
                   let caughtUpDate: string | undefined;

                   if (!realStatus) {
                     // Check if caught up
                     const caughtUpKey = Object.keys(records).find(k => k.startsWith(`${student.id}_CaughtUp_`));
                     if (caughtUpKey) {
                       realStatus = records[caughtUpKey]; // 'caught_up'
                       const parts = caughtUpKey.split('_');
                       caughtUpDate = parts[parts.length - 1];
                     }
                   }

                   return (
                     <StudentRow 
                       key={`${student.id}_${routine.id}`} 
                       student={student} 
                       currentStatus={realStatus} 
                       caughtUpDate={caughtUpDate}
                       onStatusChange={(id, status) => onStatusChange(id, status, routineTime as any)} 
                     />
                   );
                 })}
               </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
