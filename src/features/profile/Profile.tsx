import React from "react";
import { useProfile } from "./hooks/useProfile";
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
    handleUpdateEmail,
    handleUpdatePassword
  } = useProfile();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <ProfileHeader />

      <MessageAlert message={message} />

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 shadow-sm p-8 space-y-8">
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
      </div>
    </div>
  );
};

export default Profile;
