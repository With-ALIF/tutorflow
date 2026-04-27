import { db, auth } from "../../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Student } from "../types/attendance.types";

export const fetchStudents = async (): Promise<Student[]> => {
  if (!auth.currentUser) return [];
  const q = query(collection(db, "students"), where("userId", "==", auth.currentUser.uid));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
};
