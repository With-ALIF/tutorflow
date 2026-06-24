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
import { useRoutine } from "../routine/hooks/useRoutine";

export default function StudentProfile() {
  const { id } = useParams();
  const { student, attendance, fees, loading: profileLoading } = useStudentProfile(id);
  const { routines, loading: routineLoading } = useRoutine();
  const { downloadPDF, downloadAttendancePDF, downloadRunningMonthReportPDF } = usePDF();

  const loading = profileLoading || routineLoading;

  if (loading) return <div className="p-8 text-center text-slate-500">Loading profile...</div>;
  if (!student) return <div className="p-8 text-center text-red-500">Student not found.</div>;

  const presentsOnly = attendance.filter(a => a.status === 'present' || a.status === 'caught_up');
  const stats = calculateStats(presentsOnly, student);

  return (
    <div className="space-y-4">
      <ProfileHeader 
        student={student} 
        onDownloadFull={() => downloadPDF(student, presentsOnly, fees)} 
      />
      <div className="space-y-4">
        <ProfileCard student={student} />
        
        <ProfileRoutine routines={routines} studentClass={student.class} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <AttendanceProgress 
              {...stats} 
              onDownload={() => downloadAttendancePDF(student, presentsOnly)} 
              onDownloadRunning={() => downloadRunningMonthReportPDF(student, presentsOnly, routines)}
            />
            <AttendanceList 
              attendance={presentsOnly} 
              onDownload={() => downloadAttendancePDF(student, presentsOnly)}
            />
          </div>
          
          <div className="space-y-4">
            <PaymentList fees={fees} />
          </div>
        </div>
      </div>
    </div>
  );
}
