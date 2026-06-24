export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export interface Routine {
  id: string;
  user_id: string;
  className: string;
  day: DayOfWeek;
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  subject?: string;
}

export type NewRoutine = Omit<Routine, "id" | "user_id">;
