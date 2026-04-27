import { useState, useEffect, useContext, useCallback } from "react";
import { ToastContext } from "../../../context/ToastContext";
import { fetchStudents } from "../services/studentService";
import { Student } from "../types/attendance.types";

export const useStudents = () => {
  const { showToast } = useContext(ToastContext);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      try {
        const data = await fetchStudents();
        setStudents(data);
      } catch (err) {
        showToast("Failed to load students", "error");
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, [showToast]);

  return { students, loading };
};
