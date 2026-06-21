import { useState, useEffect, useMemo, useCallback } from "react";
import { format, parseISO } from "date-fns";
import { routineService } from "@/src/features/routine/services/routineService";
import { Routine } from "../../../routine/types/routine.types";
import { supabase } from "../../../../lib/supabase";

export const useMarkingRoutines = (date: string) => {
  const [routines, setRoutines] = useState<Routine[]>([]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        unsubscribe = routineService.subscribeToRoutines((data) => {
          setRoutines(data);
        }, user.id);

        // Initial fetch
        const initialData = await routineService.fetchRoutines();
        setRoutines(initialData);
      }
    };

    setupSubscription();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const dayOfWeek = useMemo(() => {
    try {
      return format(parseISO(date), "EEEE");
    } catch {
      return "Sunday";
    }
  }, [date]);

  const activeRoutines = useMemo(() => {
    return routines
      .filter(r => r.day === dayOfWeek)
      .sort((a, b) => {
        const timeA = a.startTime || "00:00";
        const timeB = b.startTime || "00:00";
        return timeA.localeCompare(timeB);
      });
  }, [routines, dayOfWeek]);

  return { routines, activeRoutines, setRoutines };
};
