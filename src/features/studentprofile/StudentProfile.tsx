import React from "react";
import { useParams } from "react-router-dom";
import { useStudentProfile } from "@/src/features/studentprofile/hooks/useStudentProfile";
import { usePDF } from "@/src/features/studentprofile/hooks/usePDF";
import { calculateStats } from "./utils/calculateStats";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileCard } from "./components/ProfileCard";
import { ProfileRoutine } from "./components/ProfileRoutine";
import { AttendanceProgress } from "./components/AttendanceProgress";
import { AttendanceList } from "./components/AttendanceList";
import { PaymentList } from "./components/PaymentList";
import { ExpenseList } from "./components/ExpenseList";
import { useRoutine } from "../routine/hooks/useRoutine";

export default function StudentProfile() {
  const { id } = useParams();
  const { student, attendance, fees, expenses, loading: profileLoading } = useStudentProfile(id);
  const { routines, loading: routineLoading } = useRoutine();
  const { downloadPDF, downloadAttendancePDF } = usePDF();

  const loading = profileLoading || routineLoading;

  if (loading) return <div className="p-8 text-center text-slate-500">Loading profile...</div>;
  if (!student) return <div className="p-8 text-center text-red-500">Student not found.</div>;

  const stats = calculateStats(attendance, student);

  return (
    <div className="space-y-4">
      <ProfileHeader 
        student={student} 
        onDownloadFull={() => downloadPDF(student, attendance, fees, expenses)} 
      />
      <div className="space-y-4">
        <ProfileCard student={student} />
        
        <ProfileRoutine routines={routines} studentBatch={student.batch} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <AttendanceProgress 
              {...stats} 
              onDownload={() => downloadAttendancePDF(student, attendance)} 
            />
            <AttendanceList 
              attendance={attendance} 
              onDownload={() => downloadAttendancePDF(student, attendance)}
            />
          </div>
          
          <div className="space-y-4">
            <PaymentList fees={fees} />
            <ExpenseList expenses={expenses} />
          </div>
        </div>
      </div>
    </div>
  );
}
