import { useState, useEffect, useContext, useCallback } from "react";
import { ToastContext } from "../../../context/ToastContext";
import { studentService } from "../services/studentService";
import { Student, NewStudent } from "../types/student.types";

export const useStudents = () => {
  const { showToast } = useContext(ToastContext);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await studentService.fetchStudents();
      setStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err);
      showToast("Failed to fetch students", "error");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const addStudent = async (student: NewStudent) => {
    try {
      await studentService.addStudent(student);
      showToast("Student added successfully!");
      fetchStudents();
      return true;
    } catch (err) {
      console.error("Error adding student:", err);
      showToast("Failed to add student", "error");
      return false;
    }
  };

  const updateStudent = async (student: Student) => {
    try {
      await studentService.updateStudent(student);
      showToast("Student updated successfully!");
      fetchStudents();
      return true;
    } catch (err) {
      console.error("Error updating student:", err);
      showToast("Failed to update student", "error");
      return false;
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      await studentService.deleteStudent(id);
      showToast("Student and associated payments deleted successfully!");
      fetchStudents();
      return true;
    } catch (err) {
      console.error("Error deleting student:", err);
      showToast("Failed to delete student", "error");
      return false;
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return { students, loading, addStudent, updateStudent, deleteStudent, fetchStudents };
};
