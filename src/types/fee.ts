export interface FeeRecord {
  id: string;
  student_id: string;
  userId: string;
  amount: number;
  payment_date: string;
  fee_month: string;
  status: 'paid' | 'due' | 'pending' | 'unpaid';
  created_at: string;
  students?: {
    name: string;
    photo?: string;
    join_date?: string;
  };
}
