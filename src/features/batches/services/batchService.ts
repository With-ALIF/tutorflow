import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../../firebase";
import { Batch, NewBatch } from "../types/batch.types";

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

export const batchService = {
  fetchBatches: async (): Promise<Batch[]> => {
    if (!auth.currentUser) throw new Error("User not authenticated");
    const path = "batches";
    try {
      const q = query(collection(db, path), where("userId", "==", auth.currentUser.uid));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Batch));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return [];
    }
  },

  addBatch: async (batch: NewBatch): Promise<string> => {
    if (!auth.currentUser) throw new Error("User not authenticated");
    const path = "batches";
    try {
      const docRef = await addDoc(collection(db, path), {
        ...batch,
        userId: auth.currentUser.uid,
        created_at: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      return "";
    }
  },

  updateBatch: async (id: string, batch: Partial<Batch>): Promise<void> => {
    if (!auth.currentUser) throw new Error("User not authenticated");
    const path = `batches/${id}`;
    try {
      const docRef = doc(db, "batches", id);
      await updateDoc(docRef, { ...batch });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  deleteBatch: async (id: string): Promise<void> => {
    if (!auth.currentUser) throw new Error("User not authenticated");
    const path = `batches/${id}`;
    try {
      const docRef = doc(db, "batches", id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  subscribeToBatches: (callback: (batches: Batch[]) => void) => {
    if (!auth.currentUser) return () => {};
    const path = "batches";
    const q = query(collection(db, path), where("userId", "==", auth.currentUser.uid));
    return onSnapshot(q, (snapshot) => {
      const batches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Batch));
      callback(batches);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });
  }
};
