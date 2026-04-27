import React from "react";
import { useProfile } from "@/src/features/profile/hooks/useProfile";
import { ProfileHeader } from "./components/ProfileHeader";
import { MessageAlert } from "./components/MessageAlert";
import { UpdateEmailForm } from "./components/UpdateEmailForm";
import { UpdatePasswordForm } from "./components/UpdatePasswordForm";

export const Profile: React.FC = () => {
    const {
    email,
    setEmail,
    newPassword,
    setNewPassword,
    currentPassword,
    setCurrentPassword,
    message,
    loading,
    providerInfo,
    handleUpdateEmail,
    handleUpdatePassword
  } = useProfile();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ProfileHeader />

      <MessageAlert message={message} />

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 shadow-sm p-6 space-y-6">
        {!providerInfo.isEmail && providerInfo.isGoogle && (
          <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl text-sm text-blue-700 dark:text-blue-300">
            <p className="font-semibold">Logged in with Google</p>
            <p className="mt-1 opacity-80">You manage your account settings (email and password) through Google.</p>
          </div>
        )}

        {providerInfo.isEmail && (
          <>
            <UpdateEmailForm 
              email={email}
              setEmail={setEmail}
              currentPassword={currentPassword}
              setCurrentPassword={setCurrentPassword}
              onSubmit={handleUpdateEmail}
              loading={loading}
            />

            <div className="h-px bg-slate-100 dark:bg-slate-700" />

            <UpdatePasswordForm 
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              currentPassword={currentPassword}
              setCurrentPassword={setCurrentPassword}
              onSubmit={handleUpdatePassword}
              loading={loading}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
