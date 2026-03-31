import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithEmail, signUpWithEmail, loginWithGoogle } from "../services/authService";

export const useAuth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      let errorMessage = error.message || "Failed to sign in with Google.";
      if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "Google Sign-In is not enabled. Please enable it in your Firebase Console.";
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign-in popup was closed before completing.";
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = "This domain is not authorized for OAuth operations. Please add it in Firebase Console.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      navigate("/");
    } catch (error: any) {
      console.error("Error with email auth:", error);
      setError(error.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isSignUp,
    setIsSignUp,
    error,
    handleGoogleLogin,
    handleEmailAuth,
    loading
  };
};
