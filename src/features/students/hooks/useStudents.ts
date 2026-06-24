import { useState, useEffect, useContext, useCallback } from "react";
import { ToastContext } from "../../../context/ToastContext";
import { studentService } from "../services/studentService";
import { routineService } from "../../routine/services/routineService";
import { Student, NewStudent } from "../types/student.types";
import { notifyStudentAdmission } from "../../../utils/telegramService";
import { supabase } from "../../../lib/supabase";

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
      
      // Automatically sync routine based on class days
      try {
        await routineService.syncRoutineFromStudent(student);
      } catch (routineErr) {
        console.error("Failed to sync routine:", routineErr);
      }

      showToast("Student added successfully!");
      fetchStudents();

      // Trigger Telegram Notification for Student Admission
      try {
        await notifyStudentAdmission({
          name: student.name,
          class: student.class,
          monthly_fee: student.monthly_fee,
          join_date: student.join_date,
          phone: student.phone,
          subject: student.subject
        });
      } catch (notifyErr) {
        console.error("Failed to send student admission Telegram notification:", notifyErr);
      }

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

      // Automatically sync routine based on class days
      try {
        await routineService.syncRoutineFromStudent(student);
      } catch (routineErr) {
        console.error("Failed to sync routine:", routineErr);
      }

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
    let isActive = true;

    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && isActive) {
        fetchStudents();
      } else if (!session && isActive) {
        setStudents([]);
      }
    });

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && isActive) {
        fetchStudents();
      }
    });

    return () => {
      isActive = false;
      authListener.unsubscribe();
    };
  }, [fetchStudents]);

  return { students, loading, addStudent, updateStudent, deleteStudent, fetchStudents };
};
