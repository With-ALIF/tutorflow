export interface Student {
  id: string;
  name: string;
  class: string;
  phone: string;
  subject: string;
  address: string;
  monthly_fee: number;
  lectures_per_month: number;
  lectures_per_week: number;
  class_days: string[];
  join_date: string;
  photo?: string;
  status?: 'active' | 'finished';
  end_date?: string;
}

export interface NewStudent extends Omit<Student, 'id'> {
  id?: string;
}
