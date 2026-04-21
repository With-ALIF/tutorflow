import { db, auth } from "../../../firebase";
import { collection, getDocs, doc, updateDoc, addDoc, query, where } from "firebase/firestore";
import { Student } from "../../../types/student";
import { FeeRecord } from "../../../types/fee";

export const fetchStudents = async (): Promise<Student[]> => {
  if (!auth.currentUser) return [];
  const studentsQuery = query(collection(db, "students"), where("userId", "==", auth.currentUser.uid));
  const studentsSnapshot = await getDocs(studentsQuery);
  return studentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
};

export const fetchFees = async (studentsData: Student[]): Promise<FeeRecord[]> => {
  if (!auth.currentUser) return [];
  const feesQuery = query(collection(db, "fees"), where("userId", "==", auth.currentUser.uid));
  const feesSnapshot = await getDocs(feesQuery);
  return feesSnapshot.docs
    .map(doc => {
      const data = doc.data();
      const student = studentsData.find(s => s.id === data.student_id);
      return {
        id: doc.id,
        ...data,
        students: student ? { name: student.name } : null
      };
    })
    .filter(fee => fee.students !== null)
    .sort((a: any, b: any) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime()) as FeeRecord[];
};

export const updateFeeStatus = async (id: string, status: 'paid' | 'unpaid'): Promise<void> => {
  if (!auth.currentUser) return;
  const feeRef = doc(db, "fees", id);
  await updateDoc(feeRef, {
    status,
    payment_date: new Date().toISOString().split('T')[0]
  });
};

export const markFeeAsPaid = async (id: string): Promise<void> => {
  await updateFeeStatus(id, 'paid');
};

export const markFeeAsUnpaid = async (id: string): Promise<void> => {
  await updateFeeStatus(id, 'unpaid');
};

export const addPayment = async (paymentData: any): Promise<void> => {
  if (!auth.currentUser) return;
  await addDoc(collection(db, "fees"), {
    ...paymentData,
    userId: auth.currentUser.uid,
    created_at: new Date().toISOString()
  });
};
