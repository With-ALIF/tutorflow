import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Info, Sparkles, Globe, ArrowLeft, Github, Mail } from "lucide-react";
import aboutData from "./data/aboutData.json";
import { cn } from "../../lib/utils";

type Language = "en" | "bn";

export const About: React.FC = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState<Language>("bn");
  const content = aboutData[lang];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 pt-4 px-4 overflow-x-hidden">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 font-bold text-xs uppercase tracking-widest transition-colors mb-6 group bg-slate-100 dark:bg-white/5 rounded-xl border border-transparent hover:border-emerald-500/20"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back</span>
      </motion.button>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
        <div className="space-y-4 flex-1">
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            {content.title}
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl font-medium">
            {content.description}
          </p>
        </div>

        {/* Language Toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 w-fit shrink-0">
          <button
            onClick={() => setLang("en")}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2",
              lang === "en" 
                ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xl shadow-black/5" 
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            )}
          >
            <Globe className="w-4 h-4" />
            English
          </button>
          <button
            onClick={() => setLang("bn")}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2",
              lang === "bn" 
                ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xl shadow-black/5" 
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            )}
          >
            <Globe className="w-4 h-4" />
            বাংলা
          </button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="wait">
          {content.features.map((feature, idx) => (
            <motion.div
              key={`${lang}-feature-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 hover:border-emerald-500/30 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500" />
              
              <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform duration-500 border border-slate-100 dark:border-slate-700 group-hover:border-emerald-500/20">
                <Sparkles className="w-6 h-6" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {feature.details}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* App Version Info */}
      <div className="pt-12 border-t border-slate-100 dark:border-slate-800">
        {/* Developer Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center gap-6 p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white dark:border-slate-700 shadow-xl">
              <img 
                src="https://raw.githubusercontent.com/With-ALIF/logo_zone/main/alif/logo.jpg" 
                alt="Md. Abdullah - Al - Khalid Alif" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">Developed By</p>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">
              Md. Abdullah - Al - Khalid Alif
            </h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 pt-2">
              <a 
                href="https://github.com/With-ALIF" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors group"
              >
                <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>With-ALIF</span>
              </a>
              <a 
                href="mailto:alifbrur16@gmail.com" 
                className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors group"
              >
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>alifbrur16@gmail.com</span>
              </a>
            </div>
          </div>
          <div className="hidden lg:block text-right">
            <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Version</p>
            <p className="text-sm font-black text-slate-400 dark:text-slate-500">v2.1.0</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
