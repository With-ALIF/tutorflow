import React from "react";
import Logo from "../../components/Logo";

interface LoginHeaderProps {
  isSignUp: boolean;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({ isSignUp }) => {
  return (
    <div className="p-10 text-center border-b border-slate-50 bg-slate-50/30">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-white rounded-3xl shadow-xl border border-slate-100">
          <Logo className="h-12 w-auto" />
        </div>
      </div>
      <h1 className="text-3xl font-black text-slate-900 tracking-tight">
        {isSignUp ? "Create Account" : "Welcome Back"}
      </h1>
      <p className="text-slate-400 mt-2 font-medium">
        Sign in to manage your tuition center
      </p>
    </div>
  );
};
