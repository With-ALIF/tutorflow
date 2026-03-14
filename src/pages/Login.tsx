import React, { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { motion } from "motion/react";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-slate-400 mt-2 font-medium">Sign in to manage your tuition center</p>
        </div>
        <div className="p-10">
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#10b981',
                    brandAccent: '#059669',
                    inputBackground: '#f8fafc',
                    inputText: '#0f172a',
                    inputPlaceholder: '#94a3b8',
                    inputBorder: '#e2e8f0',
                    inputBorderHover: '#10b981',
                    inputBorderFocus: '#10b981',
                  },
                  radii: {
                    borderRadiusButton: '1rem',
                    buttonBorderRadius: '1rem',
                    inputBorderRadius: '1rem',
                  },
                  fonts: {
                    bodyFontFamily: `'Inter', sans-serif`,
                    buttonFontFamily: `'Inter', sans-serif`,
                    inputFontFamily: `'Inter', sans-serif`,
                    labelFontFamily: `'Inter', sans-serif`,
                  }
                }
              }
            }}
            providers={[]}
            theme="light"
          />
        </div>
        <div className="px-10 pb-10 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Powered by Tuition Hub v2.0</p>
        </div>
      </motion.div>
    </div>
  );
}
