import React, { useState, useEffect } from "react";
import { MessageSquare, Send } from "lucide-react";
import { getTutorSettings, saveTutorSettings, sendTelegramMessage } from "@/src/utils/telegramService";

interface UpdateTelegramFormProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const UpdateTelegramForm: React.FC<UpdateTelegramFormProps> = ({ showToast }) => {
  const [chatId, setChatId] = useState("");
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);

  // Load initial settings
  useEffect(() => {
    const loadSettings = async () => {
      const settings = await getTutorSettings();
      if (settings?.telegram_chat_id) {
        setChatId(settings.telegram_chat_id);
      }
    };
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveTutorSettings(chatId);
      showToast("Telegram Chat ID updated successfully!", "success");
    } catch (err: any) {
      console.error(err);
      showToast("Failed to update Telegram Chat ID", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = async () => {
    if (!chatId.trim()) {
      showToast("Please enter a valid Chat ID first", "error");
      return;
    }
    setTesting(true);
   try {
  const testMsg = `
🔔 <b>Telegram Integration Test</b>

✅ <b>Connection Status:</b> Successfully Connected

Your Tuition Management System is now properly integrated with Telegram notifications.

Now you will receive automated instant notifications for class attendance, new payments, fee generations, and expenses directly on Telegram.

<i>This is an automated test notification.</i>
`;

  const success = await sendTelegramMessage(chatId, testMsg);

  if (success) {
    showToast(
      "✅ Test notification sent successfully. Please check your Telegram.",
      "success"
    );
  } else {
    showToast(
      "❌ Unable to send notification. Please verify your Chat ID and ensure the bot has been started.",
      "error"
    );
  }
} catch (err) {
  showToast(
    "⚠️ Test notification failed. Please try again later.",
    "error"
  );
} finally {
  setTesting(false);
}
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-indigo-500" /> Telegram Notifications
      </h2>
      
      {/* Informational Guidance */}
      <div className="bg-slate-50 dark:bg-slate-900/40 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-600 dark:text-slate-400 space-y-2.5">
        <p className="font-bold text-slate-800 dark:text-slate-200">🤖 How to connect with your Telegram Bot:</p>
        <ol className="list-decimal list-inside space-y-1 ml-1 leading-relaxed">
          <li>Go to Telegram and search for <b>@userinfobot</b> or <b>@raw_data_bot</b>.</li>
          <li>Message them or use <code>/start</code> to get your unique <b>Telegram Chat ID</b> or <b>User ID</b>.</li>
          <li>Then connect with our official notifier bot: <b>@alif_web_bot</b> (Search and use <code>/start</code>).</li>
          <li>Enter your Chat ID below and save.</li>
        </ol>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tutor Telegram Chat ID</label>
          <input
            type="text"
            placeholder="e.g. 12345678"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
            required
          />
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button 
            type="submit" 
            disabled={loading} 
            className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-50 text-sm cursor-pointer"
          >
            {loading ? "Saving..." : "Save Chat ID"}
          </button>
          
          <button 
            type="button" 
            onClick={handleTestNotification}
            disabled={testing || !chatId.trim()} 
            className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-50 text-sm cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{testing ? "Testing..." : "Send Test message"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
