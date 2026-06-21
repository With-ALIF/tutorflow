export interface PendingClass {
  batchName: string;
  day: string;
  date: string;
  shift: "Morning" | "Evening";
  subject?: string;
  room?: string;
  color?: string;
}

export interface CaughtUpClass {
  batchName: string;
  originalDate: string;
  coveredDate: string;
  shift: "Morning" | "Evening";
}

