import { useState, useEffect, useContext } from "react";
import { Routine, NewRoutine } from "../types/routine.types";
import { routineService } from "@/src/features/routine/services/routineService";
import { ToastContext } from "../../../context/ToastContext";
import { supabase } from "../../../lib/supabase";

export const useRoutine = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let isActive = true;

    const setupRoutines = async (userId: string) => {
      // Clear previous subscription
      if (unsubscribe) unsubscribe();

      // New subscription
      unsubscribe = routineService.subscribeToRoutines((data) => {
        if (isActive) {
          setRoutines(data);
          setLoading(false);
        }
      }, userId);

      // Initial fetch
      try {
        const initialData = await routineService.fetchRoutines();
        if (isActive) {
          setRoutines(initialData);
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
        setupRoutines(session.user.id);
      } else if (!session && isActive) {
        setRoutines([]);
        setLoading(false);
        if (unsubscribe) unsubscribe();
      }
    });

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && isActive) {
        setupRoutines(session.user.id);
      }
    });

    return () => {
      isActive = false;
      authListener.unsubscribe();
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const fetchLatest = async () => {
    try {
      const data = await routineService.fetchRoutines();
      setRoutines(data);
    } catch (err) {
      console.error("Manual fetch error:", err);
    }
  };

  const addRoutine = async (routine: NewRoutine) => {
    try {
      await routineService.addRoutine(routine);
      await fetchLatest();
      showToast("Routine added successfully", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to add routine", "error");
    }
  };

  const updateRoutine = async (id: string, routine: Partial<Routine>) => {
    try {
      await routineService.updateRoutine(id, routine);
      await fetchLatest();
      showToast("Routine updated successfully", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to update routine", "error");
    }
  };

  const deleteRoutine = async (id: string) => {
    try {
      await routineService.deleteRoutine(id);
      await fetchLatest();
      showToast("Routine deleted successfully", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to delete routine", "error");
    }
  };

  return { routines, loading, addRoutine, updateRoutine, deleteRoutine };
};
