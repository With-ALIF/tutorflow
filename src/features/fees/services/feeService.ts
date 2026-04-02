import { db, auth } from "../../../firebase";
import { collection, getDocs, doc, updateDoc, addDoc, query, where } from "firebase/firestore";

export interface Student {
  id: string;
  name: string;
  monthly_fee: number;
  phone: string;
  class?: string;
}

export interface FeeRecord {
  id: string;
  student_id: string;
  amount: number;
  payment_date: string;
  fee_month: string;
  status: 'paid' | 'due';
  students?: {
    name: string;
  };
}

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

export const markFeeAsPaid = async (id: string): Promise<void> => {
  const feeRef = doc(db, "fees", id);
  await updateDoc(feeRef, {
    status: 'paid',
    payment_date: new Date().toISOString().split('T')[0]
  });
};

export const addPayment = async (paymentData: any): Promise<void> => {
  if (!auth.currentUser) return;
  await addDoc(collection(db, "fees"), {
    ...paymentData,
    userId: auth.currentUser.uid,
    created_at: new Date().toISOString()
  });
};
