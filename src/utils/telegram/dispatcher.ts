import { TELEGRAM_BOT_TOKEN, getTutorSettings } from "./settings";

/**
 * Sends a raw message to a specific Telegram Chat ID
 */
export const sendTelegramMessage = async (chatId: string, message: string): Promise<boolean> => {
  if (!chatId || !chatId.trim()) return false;
  
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId.trim(),
        text: message,
        parse_mode: "HTML"
      })
    });
    
    if (!response.ok) {
      console.error("Telegram Send Error response:", await response.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("Telegram Send Exception:", err);
    return false;
  }
};

/**
 * Helper to dispatch to both Student (if chat ID exists) and Tutor (if settings chat ID exists)
 */
export const dispatchNotification = async (
  studentTelegramChatId: string | undefined, 
  message: string
) => {
  // Always notify student if chat id matches
  if (studentTelegramChatId && studentTelegramChatId.trim()) {
    await sendTelegramMessage(studentTelegramChatId, message);
  }
  
  // Also notify tutor if they have configured their chat ID
  const tutorSettings = await getTutorSettings();
  if (tutorSettings?.telegram_chat_id && tutorSettings.telegram_chat_id.trim() !== studentTelegramChatId?.trim()) {
    await sendTelegramMessage(tutorSettings.telegram_chat_id, message);
  }
};
