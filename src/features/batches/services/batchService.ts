import { supabase } from "../../../lib/supabase";
import { Batch, NewBatch } from "../types/batch.types";

export const batchService = {
  fetchBatches: async (): Promise<Batch[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await supabase
      .from("batches")
      .select("*")
      .eq("user_id", user.id);
      
    if (error) {
      console.error("Error fetching batches:", error);
      throw error;
    }

    if (!data) return [];
    
    return data.map((b: any) => ({
      id: b.id,
      user_id: b.user_id,
      name: b.name || "",
      description: b.description || "",
      created_at: b.created_at || new Date().toISOString()
    }));
  },

  addBatch: async (batch: NewBatch): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("batches")
      .insert({
        name: batch.name,
        description: batch.description,
        user_id: user.id
      })
      .select()
      .single();
      
    if (error) throw error;
    return data.id;
  },

  updateBatch: async (id: string, batch: Partial<Batch>): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    
    const updateData: any = {};
    if (batch.name !== undefined) updateData.name = batch.name;
    if (batch.description !== undefined) updateData.description = batch.description;

    const { error } = await supabase
      .from("batches")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id);
      
    if (error) throw error;
  },

  deleteBatch: async (id: string): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("batches")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
      
    if (error) throw error;
  },

  subscribeToBatches: (callback: (batches: Batch[]) => void, userId: string) => {
    const channelId = `batches_realtime_${userId}_${Math.random().toString(36).substring(7)}`;
    
    const channel = supabase
      .channel(channelId)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'batches', 
        filter: `user_id=eq.${userId}` 
      }, () => {
        batchService.fetchBatches().then(callback).catch(console.error);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }
};
