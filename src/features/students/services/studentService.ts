import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  writeBatch 
} from "firebase/firestore";
import { db, auth } from "../../../firebase";
import { Student, NewStudent } from "../types/student.types";

export const studentService = {
  async fetchStudents(): Promise<Student[]> {
    if (!auth.currentUser) throw new Error("User not authenticated");
    const q = query(collection(db, "students"), where("userId", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
  },

  async addStudent(student: NewStudent): Promise<void> {
    if (!auth.currentUser) throw new Error("User not authenticated");
    await addDoc(collection(db, "students"), {
      ...student,
      userId: auth.currentUser.uid,
      created_at: new Date().toISOString()
    });
  },

  async updateStudent(student: Student): Promise<void> {
    if (!auth.currentUser) throw new Error("User not authenticated");
    const studentRef = doc(db, "students", student.id);
    
    // Remove undefined fields to prevent Firestore updateDoc error
    const dataToUpdate = { ...student };
    Object.keys(dataToUpdate).forEach(key => {
      if (dataToUpdate[key as keyof Student] === undefined) {
        delete dataToUpdate[key as keyof Student];
      }
    });
    
    await updateDoc(studentRef, dataToUpdate);
  },

  async deleteStudent(id: string): Promise<void> {
    if (!auth.currentUser) throw new Error("User not authenticated");
    const batch = writeBatch(db);
    
    // Delete student
    batch.delete(doc(db, "students", id));
    
    // Delete associated fees
    const feesQuery = query(collection(db, "fees"), where("userId", "==", auth.currentUser.uid));
    const feesSnapshot = await getDocs(feesQuery);
    feesSnapshot.docs
      .filter(doc => doc.data().student_id === id)
      .forEach((doc) => {
        batch.delete(doc.ref);
      });
    
    await batch.commit();
  }
};
