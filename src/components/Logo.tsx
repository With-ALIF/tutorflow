import React from "react";

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center">
        <svg 
          viewBox="0 0 24 24" 
          className="w-8 h-8 text-indigo-600 dark:text-indigo-400 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16.446 6c-1.391 0-2.617.502-3.6 1.488L12.5 7.828l-.346-.34c-.983-.986-2.209-1.488-3.6-1.488-2.822 0-5.115 2.293-5.115 5.115s2.293 5.115 5.115 5.115c1.391 0 2.617-.502 3.6-1.488l.346-.34.346.34c.983.986 2.209 1.488 3.6 1.488 2.822 0 5.115-2.293 5.115-5.115S19.268 6 16.446 6zM8.868 14.88c-.917 0-1.724-.33-2.371-.977-.647-.647-.977-1.454-.977-2.371H5.51c0-1.844 1.5-3.344 3.344-3.344 1.844 0 3.344 1.5 3.344 3.344s-1.5 3.344-3.344 3.344zm7.578-.014c-1.844 0-3.344-1.5-3.344-3.344s1.5-3.344 3.344-3.344c1.844 0 3.344 1.5 3.344 3.344s-1.5 3.344-3.344 3.344z"/>
        </svg>
        <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full scale-150 opacity-50" />
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
