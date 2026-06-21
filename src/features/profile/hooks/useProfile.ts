import React, { useState } from "react";
import { reauthenticate, updateUserPassword } from "../services/profileService";

export const useProfile = () => {
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 7000);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await reauthenticate(currentPassword);
      await updateUserPassword(newPassword);
      showMessage("Password updated successfully!", "success");
      setNewPassword("");
      setCurrentPassword("");
    } catch (error: any) {
      showMessage(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    newPassword,
    setNewPassword,
    currentPassword,
    setCurrentPassword,
    message,
    loading,
    handleUpdatePassword
  };
};
