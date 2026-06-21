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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 pt-0">
      {sessions.map((routine) => {
        const batchStudents = students.filter(s => s.batch === routine.batchName);
        const routineShift = routine.shift || 'Morning';

        if (batchStudents.length === 0) return null;

        return (
          <div 
            key={routine.id} 
            className="p-5 sm:p-6 bg-slate-50/50 dark:bg-slate-900/10 rounded-[2rem] border border-slate-100 dark:border-slate-800/80 space-y-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div 
                  className="w-1.5 h-4 rounded-full" 
                  style={{ backgroundColor: routine.color || '#4f46e5' }} 
                />
                <h5 className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                  {routine.batchName} • {routine.startTime} ({routineShift})
                </h5>
              </div>
          <div className="grid grid-cols-1 gap-4">
                 {batchStudents.map((student) => {
                   let recordKey = `${student.id}_${routineShift}`;
                   let realStatus = records[recordKey];
                   let caughtUpDate: string | undefined;

                   if (!realStatus) {
                     // Check if caught up
                     const caughtUpKey = Object.keys(records).find(k => k.startsWith(`${student.id}_CaughtUp_`) && k.endsWith(`_${routineShift}`));
                     if (caughtUpKey) {
                       realStatus = records[caughtUpKey]; // 'caught_up'
                       caughtUpDate = caughtUpKey.split('_CaughtUp_')[1].split('_')[0];
                     }
                   }

                   return (
                     <StudentRow 
                       key={`${student.id}_${routine.id}`} 
                       student={student} 
                       currentStatus={realStatus} 
                       caughtUpDate={caughtUpDate}
                       onStatusChange={(id, status) => onStatusChange(id, status, routineShift)} 
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
