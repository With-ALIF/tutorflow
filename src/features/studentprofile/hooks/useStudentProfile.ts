import { useState, useEffect } from "react";
import { Student } from "../../../types/student";
import { AttendanceRecord } from "../../../types/attendance";
import { FeeRecord } from "../../../types/fee";
import { Expense } from "../../expenses/types/expense.types";
import { fetchStudentData } from "../services/studentService";

export const useStudentProfile = (id: string | undefined) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchStudentData(id).then((data) => {
      if (data) {
        setStudent(data.student);
        setAttendance(data.attendance);
        setFees(data.fees);
        setExpenses(data.expenses);
      }
      setLoading(false);
    });
  }, [id]);

  return { student, attendance, fees, expenses, loading };
};
