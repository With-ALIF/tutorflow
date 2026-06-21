import { supabase } from "../../../lib/supabase";
import { Routine, NewRoutine, DayOfWeek } from "../types/routine.types";

export const routineService = {
  fetchRoutines: async (): Promise<Routine[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await supabase
      .from("routines")
      .select("*")
      .eq("user_id", user.id);
      
    if (error) {
      console.error("Error fetching routines:", error);
      throw error;
    }

    if (!data) return [];

    // Map from DB to UI (handling snake_case, lowercase, and camelCase)
    return data.map((r: any) => {
      // Robust day normalization
      const rawDay = (r.day || r.day_of_week || "Monday").toString();
      let normalizedDay: DayOfWeek = "Monday";
      
      const dayMap: Record<string, DayOfWeek> = {
        "sat": "Saturday", "sun": "Sunday", "mon": "Monday", "tue": "Tuesday",
        "wed": "Wednesday", "thu": "Thursday", "fri": "Friday",
        "saturday": "Saturday", "sunday": "Sunday", "monday": "Monday", 
        "tuesday": "Tuesday", "wednesday": "Wednesday", "thursday": "Thursday", "friday": "Friday"
      };

      const lowerDay = rawDay.toLowerCase().trim();
      if (dayMap[lowerDay]) {
        normalizedDay = dayMap[lowerDay];
      } else if (dayMap[lowerDay.substring(0, 3)]) {
        normalizedDay = dayMap[lowerDay.substring(0, 3)];
      }

      return {
        id: r.id,
        user_id: r.user_id,
        batchName: r.batch_name || r.batchname || r.batchName || "",
        day: normalizedDay,
        startTime: r.start_time || r.starttime || r.startTime || "10:00",
        endTime: r.end_time || r.endtime || r.endTime || "11:00",
        subject: r.subject || "",
        room: r.room || "",
        color: r.color || "#3b82f6",
        shift: r.shift || "Morning"
      };
    });
  },

  addRoutine: async (routine: NewRoutine): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    
    // Based on the error log, the column is 'batchname' (lowercase)
    // We'll try to provide both to be safe, but Postgres will complain if a column doesn't exist.
    // So we use a trial-and-error approach or try the most likely one first.
    
    const payload = {
      batchname: routine.batchName,
      starttime: routine.startTime,
      endtime: routine.endTime,
      day: routine.day,
      subject: routine.subject,
      room: routine.room,
      color: routine.color,
      shift: routine.shift,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from("routines")
      .insert(payload)
      .select()
      .single();
      
    if (error) {
      // If lowercase fails, try snake_case (batch_name)
      if (error.code === '42703') { // undefined_column
        const { data: secondData, error: secondError } = await supabase
          .from("routines")
          .insert({
            batch_name: routine.batchName,
            start_time: routine.startTime,
            end_time: routine.endTime,
            day: routine.day,
            subject: routine.subject,
            room: routine.room,
            color: routine.color,
            shift: routine.shift,
            user_id: user.id
          })
          .select()
          .single();
        if (secondError) throw secondError;
        return secondData.id;
      }
      throw error;
    }
    return data.id;
  },

  updateRoutine: async (id: string, routine: Partial<Routine>): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    
    const updateData: any = {};
    if (routine.batchName !== undefined) {
      updateData.batchname = routine.batchName;
      updateData.batch_name = routine.batchName; // Try both
    }
    if (routine.startTime !== undefined) {
      updateData.starttime = routine.startTime;
      updateData.start_time = routine.startTime;
    }
    if (routine.endTime !== undefined) {
      updateData.endtime = routine.endTime;
      updateData.end_time = routine.endTime;
    }
    // ... we need to be careful with trying both in update as it might fail if one doesn't exist ...
    // Better to use the same logic as addRoutine or just try one and catch
    
    const sanitizedUpdate: any = {};
    if (routine.day !== undefined) sanitizedUpdate.day = routine.day;
    if (routine.subject !== undefined) sanitizedUpdate.subject = routine.subject;
    if (routine.room !== undefined) sanitizedUpdate.room = routine.room;
    if (routine.color !== undefined) sanitizedUpdate.color = routine.color;
    if (routine.shift !== undefined) sanitizedUpdate.shift = routine.shift;

    const tryUpdate = async (fields: any) => {
      const { error } = await supabase
        .from("routines")
        .update({ ...sanitizedUpdate, ...fields })
        .eq("id", id)
        .eq("user_id", user.id);
      return error;
    };

    // Try lowercase first
    const lowercaseFields: any = {};
    if (routine.batchName !== undefined) lowercaseFields.batchname = routine.batchName;
    if (routine.startTime !== undefined) lowercaseFields.starttime = routine.startTime;
    if (routine.endTime !== undefined) lowercaseFields.endtime = routine.endTime;
    
    let error = await tryUpdate(lowercaseFields);
    
    if (error && error.code === '42703') {
      // Try snake_case
      const snakeFields: any = {};
      if (routine.batchName !== undefined) snakeFields.batch_name = routine.batchName;
      if (routine.startTime !== undefined) snakeFields.start_time = routine.startTime;
      if (routine.endTime !== undefined) snakeFields.end_time = routine.endTime;
      error = await tryUpdate(snakeFields);
    }
      
    if (error) throw error;
  },

  deleteRoutine: async (id: string): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    
    const { error } = await supabase
      .from("routines")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
      
    if (error) throw error;
  },

  subscribeToRoutines: (callback: (routines: Routine[]) => void, userId: string) => {
    const channelId = `routines_realtime_${userId}_${Math.random().toString(36).substring(7)}`;
    
    const channel = supabase
      .channel(channelId)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'routines', 
        filter: `user_id=eq.${userId}` 
      }, () => {
        routineService.fetchRoutines().then(callback).catch(console.error);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to routines successfully');
        }
      });
      
    return () => {
      supabase.removeChannel(channel);
    };
  }
};

