import React, { useState } from "react";
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { motion } from "motion/react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
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
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (error: any) {
      console.error("Error with email auth:", error);
      setError(error.message || "Authentication failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10"
      >
        <div className="p-10 text-center border-b border-slate-50 bg-slate-50/30">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white rounded-3xl shadow-xl border border-slate-100">
              <Logo className="h-12 w-auto" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{isSignUp ? "Create Account" : "Welcome Back"}</h1>
          <p className="text-slate-400 mt-2 font-medium">Sign in to manage your tuition center</p>
        </div>
        <div className="p-10">
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <form onSubmit={handleEmailAuth} className="space-y-5 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 text-left">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 text-left">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-4 bg-emerald-600 text-white font-semibold rounded-2xl hover:bg-emerald-700 transition-all mt-2"
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-slate-400 text-sm">OR</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-2xl font-medium text-[#3c4043] hover:bg-slate-50 transition-all shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.19 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </button>
          
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full mt-4 text-slate-400 text-sm hover:text-emerald-600 transition-colors"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>
        <div className="px-10 pb-10 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Powered by Tuition Hub v1.0</p>
        </div>
      </motion.div>
    </div>
  );
}
