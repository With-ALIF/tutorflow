import React from "react";

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center">
        <img 
          src="https://i.postimg.cc/BbtKrYNg/IMG-20260618-092615.png"
          alt="Tuition Hub Logo"
          className="w-10 h-10 object-contain rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 bg-white"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-indigo-500/10 blur-lg rounded-full scale-125 opacity-30" />
      </div>
      <div className="flex flex-col -space-y-1">
        <span className="text-sm font-black text-slate-400 dark:text-slate-500 tracking-widest uppercase">
          Tuition
        </span>
        <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">
          Hub
        </span>
      </div>
    </div>
  );
}
