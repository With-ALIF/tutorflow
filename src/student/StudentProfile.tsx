// src/student/StudentProfile.tsx
import React from "react";
import { useParams } from "react-router-dom";
import { useStudentProfile } from "./hooks/useStudentProfile";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileCard } from "./components/ProfileCard";
import { AttendanceSummary } from "./components/AttendanceSummary";
import { PaymentHistory } from "./components/PaymentHistory";

export const StudentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { student, loading } = useStudentProfile(id || "1");

  if (loading) return <div>Loading...</div>;
  if (!student) return <div>Student not found</div>;

  return (
    <div className="p-8">
      <ProfileHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProfileCard student={student} />
        <AttendanceSummary rate={student.attendanceRate} />
        <PaymentHistory due={student.dueFees} />
      </div>
    </div>
  );
};
