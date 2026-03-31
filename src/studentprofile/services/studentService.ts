import { db, auth } from "../../firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Student, AttendanceRecord, FeeRecord } from "../types";

export const fetchStudentData = async (id: string) => {
  if (!id || !auth.currentUser) throw new Error("User not authenticated");

  const studentDoc = await getDoc(doc(db, "students", id));
  if (!studentDoc.exists() || studentDoc.data().userId !== auth.currentUser.uid) {
    return null;
  }
  const student = { id: studentDoc.id, ...studentDoc.data() } as Student;

  const attendanceQuery = query(collection(db, "attendance"), where("userId", "==", auth.currentUser.uid));
  const attendanceSnapshot = await getDocs(attendanceQuery);
  const attendance = attendanceSnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as AttendanceRecord))
    .filter((a) => a.student_id === id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const feesQuery = query(collection(db, "fees"), where("userId", "==", auth.currentUser.uid));
  const feesSnapshot = await getDocs(feesQuery);
  const fees = feesSnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as FeeRecord))
    .filter((f) => f.student_id === id)
    .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime());

  return { student, attendance, fees };
};
