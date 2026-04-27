import React from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

interface MessageAlertProps {
  message: { text: string, type: 'success' | 'error' } | null;
}

export const MessageAlert: React.FC<MessageAlertProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${message.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20 text-red-800 dark:text-red-400'}`}>
      {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      <p className="text-sm font-semibold">{message.text}</p>
    </div>
  );
};
