import { db, auth } from "../../../firebase";
import { collection, getDocs, query, where, doc, setDoc, addDoc } from "firebase/firestore";
import { AttendanceStatus } from "../types/attendance.types";

export const fetchDailyAttendance = async (date: string): Promise<Record<string, AttendanceStatus>> => {
  if (!auth.currentUser) return {};
  const q = query(
    collection(db, "attendance"), 
    where("userId", "==", auth.currentUser.uid), 
    where("date", "==", date)
  );
  const querySnapshot = await getDocs(q);
  const records: Record<string, AttendanceStatus> = {};
  querySnapshot.docs.forEach(doc => {
    const data = doc.data();
    records[data.student_id] = data.status;
  });
  return records;
};

export const saveAttendance = async (studentId: string, date: string, status: AttendanceStatus) => {
  if (!auth.currentUser) return;
  const attendanceId = `${studentId}_${date}`;
  const attendanceRef = doc(db, "attendance", attendanceId);
  await setDoc(attendanceRef, {
    student_id: studentId,
    userId: auth.currentUser.uid,
    date,
    status,
    created_at: new Date().toISOString()
  }, { merge: true });
};

export const addFee = async (studentId: string, amount: number, date: string, month: string) => {
  if (!auth.currentUser) return;
  await addDoc(collection(db, "fees"), {
    student_id: studentId,
    userId: auth.currentUser.uid,
    amount,
    payment_date: date,
    fee_month: month,
    status: 'due',
    created_at: new Date().toISOString()
  });
};
