import { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { Student } from "../types";
import { fetchStudents } from "../services/attendanceService";

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      if (!auth.currentUser) return;
      try {
        const data = await fetchStudents(auth.currentUser.uid);
        setStudents(data);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, []);

  return { students, loading };
};
