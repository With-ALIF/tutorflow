import { useState, useEffect, useContext } from "react";
import { Batch, NewBatch } from "../types/batch.types";
import { batchService } from "../services/batchService";
import { ToastContext } from "../../../context/ToastContext";

export const useBatches = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    const unsubscribe = batchService.subscribeToBatches((data) => {
      setBatches(data);
      setLoading(false);
    });
    return () => unsubscribe();
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
