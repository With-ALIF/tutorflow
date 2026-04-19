import React from "react";
import { Lock } from "lucide-react";

interface UpdatePasswordFormProps {
  newPassword: string;
  setNewPassword: (password: string) => void;
  currentPassword: string;
  setCurrentPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export const UpdatePasswordForm: React.FC<UpdatePasswordFormProps> = ({
  newPassword,
  setNewPassword,
  currentPassword,
  setCurrentPassword,
  onSubmit,
  loading
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <Lock className="w-5 h-5 text-emerald-500" /> Change Password
      </h2>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Current Password</label>
          <input
            type="password"
            placeholder="Required to confirm changes"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
      </div>
      <button type="submit" disabled={loading} className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-2xl hover:bg-emerald-700 transition-all disabled:opacity-50">
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
};
