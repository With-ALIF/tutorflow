import React, { useState, useMemo } from "react";
import { reauthenticate, updateUserEmail, updateUserPassword } from "../services/profileService";
import { auth } from "../../../firebase";

export const useProfile = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);

  const providerInfo = useMemo(() => {
    const user = auth.currentUser;
    if (!user) return { isGoogle: false, isEmail: false };
    return {
      isGoogle: user.providerData.some(p => p.providerId === 'google.com'),
      isEmail: user.providerData.some(p => p.providerId === 'password')
    };
  }, []);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 7000);
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await reauthenticate(currentPassword);
      await updateUserEmail(email);
      showMessage("Email updated successfully!", "success");
      setEmail("");
      setCurrentPassword("");
    } catch (error: any) {
      showMessage(error.message, "error");
    } finally {
      setLoading(false);
    }
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
  };
};
