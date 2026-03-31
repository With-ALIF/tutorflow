import React from "react";
import { Mail } from "lucide-react";

interface UpdateEmailFormProps {
  email: string;
  setEmail: (email: string) => void;
  currentPassword: string;
  setCurrentPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export const UpdateEmailForm: React.FC<UpdateEmailFormProps> = ({
  email,
  setEmail,
  currentPassword,
  setCurrentPassword,
  onSubmit,
  loading
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <Mail className="w-5 h-5 text-emerald-500" /> Update Email
      </h2>
      <input
        type="email"
        placeholder="New Email"
        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Current Password (required)"
        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading} className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-2xl hover:bg-emerald-700 transition-all disabled:opacity-50">
        {loading ? "Updating..." : "Update Email"}
      </button>
    </form>
  );
};
