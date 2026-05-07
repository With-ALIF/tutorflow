import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../../firebase";
import { Routine, NewRoutine } from "../types/routine.types";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const routineService = {
  fetchRoutines: async (): Promise<Routine[]> => {
    if (!auth.currentUser) throw new Error("User not authenticated");
    const path = "routines";
    try {
      const q = query(collection(db, path), where("userId", "==", auth.currentUser.uid));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Routine));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return []; // unreachable but for TS
    }
  },

  addRoutine: async (routine: NewRoutine): Promise<string> => {
    if (!auth.currentUser) throw new Error("User not authenticated");
    const path = "routines";
    try {
      const docRef = await addDoc(collection(db, path), {
        ...routine,
        userId: auth.currentUser.uid,
        created_at: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      return "";
    }
  },

  updateRoutine: async (id: string, routine: Partial<Routine>): Promise<void> => {
    if (!auth.currentUser) throw new Error("User not authenticated");
    const path = `routines/${id}`;
    try {
      const docRef = doc(db, "routines", id);
      await updateDoc(docRef, { ...routine, updated_at: new Date().toISOString() });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  deleteRoutine: async (id: string): Promise<void> => {
    const path = `routines/${id}`;
    try {
      const docRef = doc(db, "routines", id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  subscribeToRoutines: (callback: (routines: Routine[]) => void) => {
    if (!auth.currentUser) return () => {};
    const path = "routines";
    const q = query(collection(db, path), where("userId", "==", auth.currentUser.uid));
    return onSnapshot(q, (snapshot) => {
      const routines = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Routine));
      callback(routines);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });
  }
};

