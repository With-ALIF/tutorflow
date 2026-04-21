export type ExpenseCategory = 
  | 'Transport' 
  | 'Books' 
  | 'Supplies' 
  | 'Food' 
  | 'Stationery' 
  | 'Rent' 
  | 'Utilities' 
  | 'Salaries' 
  | 'Marketing' 
  | 'Miscellaneous' 
  | 'Others';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  userId: string;
  studentId?: string;
  studentName?: string;
  created_at: string;
}

export type NewExpense = Omit<Expense, 'id' | 'userId' | 'created_at'>;
