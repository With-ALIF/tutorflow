import { supabase } from "../../lib/supabase";

export interface TutorSettings {
  id: string;
  telegram_chat_id?: string;
}

// Global Bot Token provided by the user
export const TELEGRAM_BOT_TOKEN = "8777653894:AAGudHzCgGPhz3X6cpkY2QLv7zDoG9uDcDY";

/**
 * Fetch tutor Specific Telegram Settings from Supabase
 */
export const getTutorSettings = async (): Promise<TutorSettings | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  try {
    // Standard setup: 'settings' table with 'id'
    const { data: rows, error } = await supabase
      .from("settings")
      .select("id, telegram_chat_id")
      .eq("id", user.id)
      .limit(1);

    if (error) {
      // Fallback for user_id column
      if (error.code === '42703' || error.message.includes('column')) {
        const { data: fallbackRows } = await supabase
          .from("settings")
          .select("*")
          .eq("user_id", user.id)
          .limit(1);
        
        if (fallbackRows && fallbackRows.length > 0) {
          const raw = fallbackRows[0];
          return {
            id: raw.id || raw.user_id,
            telegram_chat_id: raw.telegram_chat_id || raw.telegramchatid || ""
          };
        }
      }
      return null;
    }

    if (rows && rows.length > 0) {
      return {
        id: rows[0].id,
        telegram_chat_id: rows[0].telegram_chat_id || ""
      } as TutorSettings;
    }
    
    return null;
  } catch (error) {
    console.warn("Error getting tutor settings:", error);
    return null;
  }
};

export const saveTutorSettings = async (telegramChatId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const chatId = telegramChatId.trim();

  try {
    // 1. Try checking by standard ID
    const { data: existing } = await supabase.from("settings").select("id").eq("id", user.id).limit(1);

    if (existing && existing.length > 0) {
      // Update by ID
      const { error } = await supabase.from("settings").update({ telegram_chat_id: chatId }).eq("id", user.id);
      if (error) {
         // Fallback column name
         await supabase.from("settings").update({ telegramchatid: chatId } as any).eq("id", user.id);
      }
    } else {
      // 2. Try checking by user_id
      const { data: existingUser } = await supabase.from("settings").select("*").eq("user_id", user.id).limit(1);
      
      if (existingUser && existingUser.length > 0) {
         // Update by user_id
         await supabase.from("settings").update({ telegram_chat_id: chatId }).eq("user_id", user.id);
      } else {
         // Insert new
         const { error: insErr } = await supabase.from("settings").insert({ id: user.id, telegram_chat_id: chatId });
         if (insErr) {
            // Last ditch insert attempt
            await supabase.from("settings").insert({ user_id: user.id, telegram_chat_id: chatId } as any);
         }
      }
    }
  } catch (error: any) {
    console.error("Save failure:", error);
    throw new Error(`Failed to save settings: ${error.message || "Schema issues"}`);
  }
};
