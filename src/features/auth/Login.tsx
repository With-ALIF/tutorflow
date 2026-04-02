import React from "react";
import { motion } from "motion/react";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { LoginHeader } from "./components/LoginHeader";
import { LoginForm } from "./components/LoginForm";
import { GoogleButton } from "./components/GoogleButton";

export const Login: React.FC = () => {
  const {
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
  } = useAuth();

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
        <LoginHeader isSignUp={isSignUp} />
        
        <div className="p-10">
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          
          <LoginForm 
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            isSignUp={isSignUp}
            onSubmit={handleEmailAuth}
            loading={loading}
          />
          
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-slate-400 text-sm">OR</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <GoogleButton onClick={handleGoogleLogin} loading={loading} />
          
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
};

export default Login;
