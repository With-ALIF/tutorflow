import React from "react";
import { useParams } from "react-router-dom";
import { useStudentProfile } from "./hooks/useStudentProfile";
import { usePDF } from "./hooks/usePDF";
import { calculateStats } from "./utils/calculateStats";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileCard } from "./components/ProfileCard";
import { AttendanceProgress } from "./components/AttendanceProgress";
import { AttendanceList } from "./components/AttendanceList";
import { PaymentList } from "./components/PaymentList";

export default function StudentProfile() {
  const { id } = useParams();
  const { student, attendance, fees, loading } = useStudentProfile(id);
  const { downloadPDF } = usePDF();

  if (loading) return <div className="p-8 text-center text-slate-500">Loading profile...</div>;
  if (!student) return <div className="p-8 text-center text-red-500">Student not found.</div>;

  const stats = calculateStats(attendance, student);

  return (
    <div className="space-y-10">
      <ProfileHeader />
      <div className="space-y-10">
        <ProfileCard student={student} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            <AttendanceProgress 
              {...stats} 
              onDownload={() => downloadPDF(student, attendance)} 
            />
            <AttendanceList attendance={attendance} />
          </div>
          <PaymentList fees={fees} />
        </div>
      </div>
    </div>
  );
}
