export interface PendingClass {
  className: string;
  day: string;
  date: string;
  subject?: string;
}

export interface CaughtUpClass {
  className: string;
  originalDate: string;
  coveredDate: string;
}

