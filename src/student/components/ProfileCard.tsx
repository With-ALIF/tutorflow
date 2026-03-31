// src/student/components/ProfileCard.tsx
import React from "react";
import { Student } from "../types";

export const ProfileCard = ({ student }: { student: Student }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
    <h2 className="text-xl font-bold mb-4">Personal Information</h2>
    <p><strong>Name:</strong> {student.name}</p>
    <p><strong>Class:</strong> {student.class}</p>
    <p><strong>Email:</strong> {student.email}</p>
    <p><strong>Phone:</strong> {student.phone}</p>
  </div>
);
