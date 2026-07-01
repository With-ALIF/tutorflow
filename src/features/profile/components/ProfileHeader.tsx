import React from "react";
import { useUser } from "@/src/hooks/useUser";

export const ProfileHeader: React.FC = () => {
  const { userProfile, loading } = useUser();

  return (
    <header>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
        {loading ? "Loading..." : userProfile?.full_name || "Profile Settings"}
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
        {userProfile?.full_name ? "Manage your account credentials." : "Manage your account credentials."}
      </p>
    </header>
  );
};
