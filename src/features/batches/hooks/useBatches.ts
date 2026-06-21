import { useState, useEffect, useContext } from "react";
import { Batch, NewBatch } from "../types/batch.types";
import { batchService } from "../services/batchService";
import { ToastContext } from "../../../context/ToastContext";
import { supabase } from "../../../lib/supabase";

export const useBatches = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let isActive = true;

    const setupBatches = async (userId: string) => {
      // Clear previous subscription
      if (unsubscribe) unsubscribe();

      // New subscription
      unsubscribe = batchService.subscribeToBatches((data) => {
        if (isActive) {
          setBatches(data);
          setLoading(false);
        }
      }, userId);
      
      // Initial fetch
      try {
        const initialData = await batchService.fetchBatches();
        if (isActive) {
          setBatches(initialData);
          setLoading(false);
        }
      } catch (err: any) {
        if (isActive) {
          console.error("Fetch error:", err);
          setLoading(false);
        }
      }
    };

    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && isActive) {
        setupBatches(session.user.id);
      } else if (!session && isActive) {
        setBatches([]);
        setLoading(false);
        if (unsubscribe) unsubscribe();
      }
    });

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && isActive) {
        setupBatches(session.user.id);
      }
    });

    return () => {
      isActive = false;
      authListener.unsubscribe();
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const addBatch = async (batch: NewBatch) => {
    try {
      await batchService.addBatch(batch);
      showToast("Batch added successfully!");
    } catch (error) {
      showToast("Failed to add batch", "error");
    }
  };

  const updateBatch = async (id: string, batch: Partial<Batch>) => {
    try {
      await batchService.updateBatch(id, batch);
      showToast("Batch updated successfully!");
    } catch (error) {
      showToast("Failed to update batch", "error");
    }
  };

  const deleteBatch = async (id: string) => {
    try {
      await batchService.deleteBatch(id);
      showToast("Batch deleted successfully!");
    } catch (error) {
      showToast("Failed to delete batch", "error");
    }
  };

  return { batches, loading, addBatch, updateBatch, deleteBatch };
};
