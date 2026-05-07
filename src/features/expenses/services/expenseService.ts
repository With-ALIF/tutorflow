import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy 
} from "firebase/firestore";
import { db, auth } from "../../../firebase";
import { Expense, NewExpense } from "../types/expense.types";

export const expenseService = {
  async fetchExpenses(): Promise<Expense[]> {
    if (!auth.currentUser) throw new Error("User not authenticated");
    const q = query(
      collection(db, "expenses"), 
      where("userId", "==", auth.currentUser.uid),
      orderBy("date", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
  },

  async addExpense(expense: NewExpense): Promise<void> {
    if (!auth.currentUser) throw new Error("User not authenticated");
    await addDoc(collection(db, "expenses"), {
      ...expense,
      userId: auth.currentUser.uid,
      created_at: new Date().toISOString()
    });
  },

  async updateExpense(expense: Expense): Promise<void> {
    if (!auth.currentUser) throw new Error("User not authenticated");
    const expenseRef = doc(db, "expenses", expense.id);
    const { id, ...data } = expense;
    await updateDoc(expenseRef, data);
  },

  async deleteExpense(id: string): Promise<void> {
    if (!auth.currentUser) throw new Error("User not authenticated");
    await deleteDoc(doc(db, "expenses", id));
  }
};
