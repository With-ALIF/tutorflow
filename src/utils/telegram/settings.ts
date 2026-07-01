import { supabase } from "../../lib/supabase";

export interface TutorSettings {
  id: string;
  telegram_chat_id?: string;
}

// Global Bot Token provided by the user
export const TELEGRAM_BOT_TOKEN = "8777653894:AAGudHzCgGPhz3X6cpkY2QLv7zDoG9uDcDY";

/**
 * Fetch tutor Specific Telegram Settings from Supabase users table
 */
export const getTutorSettings = async (): Promise<TutorSettings | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, telegram_chat_id")
      .eq("id", user.id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      telegram_chat_id: data.telegram_chat_id || ""
    } as TutorSettings;
  } catch (error) {
    console.warn("Error getting tutor settings from users table:", error);
    return null;
  }
};

export const saveTutorSettings = async (telegramChatId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const chatId = telegramChatId.trim();

  try {
    const { error } = await supabase
      .from("users")
      .update({ telegram_chat_id: chatId })
      .eq("id", user.id);

    if (error) throw error;
  } catch (error: any) {
    console.error("Save failure in users table:", error);
    throw new Error(`Failed to save settings: ${error.message || "Database error"}`);
  }
};
