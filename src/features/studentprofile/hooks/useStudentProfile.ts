import { useState, useEffect } from "react";
import { Student } from "../../../types/student";
import { AttendanceRecord } from "../../../types/attendance";
import { FeeRecord } from "../../../types/fee";
import { fetchStudentData } from "../services/studentService";

export const useStudentProfile = (id: string | undefined) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchStudentData(id).then((data) => {
      if (data) {
        setStudent(data.student);
        setAttendance(data.attendance);
        setFees(data.fees);
      }
      setLoading(false);
    });
  }, [id]);

  return { student, attendance, fees, loading };
};
