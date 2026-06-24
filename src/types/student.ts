export interface Student {
  id: string;
  user_id: string;
  name: string;
  class: string;
  phone: string;
  subject: string;
  address: string;
  monthly_fee: number;
  lectures_per_month: number;
  lectures_per_week: number;
  class_days: string[];
  class_time?: string; // HH:MM
  join_date: string;
  photo?: string;
  status?: 'active' | 'finished';
  end_date?: string;
  telegram_chat_id?: string;
}

export type NewStudent = Omit<Student, 'id' | 'user_id'> & {
  id?: string;
};
