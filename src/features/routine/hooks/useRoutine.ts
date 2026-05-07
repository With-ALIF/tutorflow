import { useState, useEffect, useContext } from "react";
import { Routine, NewRoutine } from "../types/routine.types";
import { routineService } from "@/src/features/routine/services/routineService";
import { ToastContext } from "../../../context/ToastContext";

export const useRoutine = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    const unsubscribe = routineService.subscribeToRoutines((data) => {
      setRoutines(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const addRoutine = async (routine: NewRoutine) => {
    try {
      await routineService.addRoutine(routine);
      showToast("Routine added successfully", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to add routine", "error");
    }
  };

  const updateRoutine = async (id: string, routine: Partial<Routine>) => {
    try {
      await routineService.updateRoutine(id, routine);
      showToast("Routine updated successfully", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to update routine", "error");
    }
  };

  const deleteRoutine = async (id: string) => {
    try {
      await routineService.deleteRoutine(id);
      showToast("Routine deleted successfully", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to delete routine", "error");
    }
  };

  return { routines, loading, addRoutine, updateRoutine, deleteRoutine };
};
