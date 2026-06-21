export interface Batch {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  color?: string;
  created_at: string;
}

export type NewBatch = Omit<Batch, "id" | "user_id" | "created_at">;
