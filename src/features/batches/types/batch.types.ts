export interface Batch {
  id: string;
  userId: string;
  name: string;
  description?: string;
  color?: string;
  created_at: string;
}

export type NewBatch = Omit<Batch, "id" | "userId" | "created_at">;
