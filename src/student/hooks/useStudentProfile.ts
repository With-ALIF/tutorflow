// src/student/hooks/useStudentProfile.ts
import { useState, useEffect } from "react";
import { Student } from "../types";
import { fetchStudent } from "../services/studentService";

export const useStudentProfile = (id: string) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudent(id).then((data) => {
      setStudent(data);
      setLoading(false);
    });
  }, [id]);

  return { student, loading };
};
