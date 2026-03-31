import React from "react";
import { Student, AttendanceStatus } from "../../types/attendance.types";
import { StatusButtons } from "./StatusButtons";

interface StudentRowProps {
  student: Student;
  currentStatus: AttendanceStatus | undefined;
  onStatusChange: (studentId: string, status: AttendanceStatus) => void;
}

export const StudentRow: React.FC<StudentRowProps> = ({ 
  student, 
  currentStatus, 
  onStatusChange 
}) => {
  return (
    <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-700/30 transition-colors group">
      <td className="px-8 py-5">
        <div className="flex items-center gap-4">
          {student.photo ? (
            <img 
              src={student.photo} 
              alt={student.name} 
              className="w-10 h-10 rounded-xl object-cover" 
              referrerPolicy="no-referrer" 
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
              {student.name.charAt(0)}
            </div>
          )}
          <span className="font-bold text-slate-900 dark:text-white">{student.name}</span>
        </div>
      </td>
      <td className="px-8 py-5">
        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full text-[10px] font-bold uppercase tracking-widest">
          {student.class}
        </span>
      </td>
      <td className="px-8 py-5">
        <StatusButtons 
          studentId={student.id} 
          currentStatus={currentStatus} 
          onStatusChange={onStatusChange} 
        />
      </td>
    </tr>
  );
};
