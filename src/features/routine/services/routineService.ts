import { supabase } from "../../../lib/supabase";
import { Routine, NewRoutine, DayOfWeek } from "../types/routine.types";
import { Student, NewStudent } from "../../students/types/student.types";

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
        className: r.class || "",
        day: normalizedDay,
        startTime: r.start_time || r.starttime || r.startTime || "10:00",
        endTime: r.end_time || r.endtime || r.endTime || "11:00",
        subject: r.subject || ""
      };
    });
  },

  addRoutine: async (routine: NewRoutine): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    
    const payload = {
      class: routine.className,
      starttime: routine.startTime,
      endtime: routine.endTime,
      day: routine.day,
      subject: routine.subject,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from("routines")
      .insert(payload)
      .select()
      .single();
      
    if (error) throw error;
    return data.id;
  },

  updateRoutine: async (id: string, routine: Partial<Routine>): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    
    // Map Partial<Routine> to database fields
    const updateData: any = {
      day: routine.day,
      subject: routine.subject
    };

    if (routine.className !== undefined) updateData.class = routine.className;
    if (routine.startTime !== undefined) updateData.starttime = routine.startTime;
    if (routine.endTime !== undefined) updateData.endtime = routine.endTime;
    
    // Remove undefined keys
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const { error } = await supabase
      .from("routines")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id);
      
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

  syncRoutineFromStudent: async (student: Student | NewStudent): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const className = student.class;
    if (!className) return;

    const dayMap: Record<string, DayOfWeek> = {
      'Sat': 'Saturday', 'Sun': 'Sunday', 'Mon': 'Monday', 'Tue': 'Tuesday',
      'Wed': 'Wednesday', 'Thu': 'Thursday', 'Fri': 'Friday'
    };

    // Fetch all students in this batch to get a union of required days
    const { data: batchStudents } = await supabase
      .from("students")
      .select("class_days")
      .eq("user_id", user.id)
      .eq("class", className);

    const allRequiredDays = new Set<string>();
    
    if (batchStudents) {
      batchStudents.forEach(s => {
        if (s.class_days) {
          s.class_days.forEach((dayAbbr: string) => {
            const fullDay = dayMap[dayAbbr];
            if (fullDay) allRequiredDays.add(fullDay);
          });
        }
      });
    }

    // Also include the current student (as it might not be committed yet if this is called optimistically)
    if (student.class_days) {
      student.class_days.forEach(dayAbbr => {
        const fullDay = dayMap[dayAbbr];
        if (fullDay) allRequiredDays.add(fullDay);
      });
    }

    const startTime = student.class_time || "10:00";
    const [h, m] = startTime.split(':').map(Number);
    const endH = (h + 1) % 24;
    const endTime = `${endH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

    // Fetch existing routines for this batch
    const { data: existingRoutines } = await supabase
      .from("routines")
      .select("id, day")
      .eq("user_id", user.id)
      .eq("class", className);

    const existingDaysMap = new Map<string, string>();
    if (existingRoutines) {
      existingRoutines.forEach(r => {
        existingDaysMap.set(r.day, r.id);
      });
    }

    const daysToAdd = Array.from(allRequiredDays).filter(d => !existingDaysMap.has(d));
    const daysToDeleteIds = Array.from(existingDaysMap.entries())
      .filter(([day, _id]) => !allRequiredDays.has(day))
      .map(([_day, id]) => id);

    if (daysToDeleteIds.length > 0) {
      await supabase.from("routines").delete().in("id", daysToDeleteIds);
    }

    const newRoutines: any[] = daysToAdd.map(day => ({
      user_id: user.id,
      class: className,
      day: day,
      starttime: startTime,
      endtime: endTime,
      subject: student.subject || "Class"
    }));

    if (newRoutines.length > 0) {
      await supabase.from("routines").insert(newRoutines);
    }
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

