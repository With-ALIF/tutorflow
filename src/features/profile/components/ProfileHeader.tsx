import React from "react";

export const ProfileHeader: React.FC = () => {
  return (
    <header>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Profile Settings</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage your account credentials.</p>
    </header>
  );
};
