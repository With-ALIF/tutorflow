import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

interface StatCardProps {
  key?: string | number;
  label: string;
  value: string | number;
  icon: string;
  color: string;
  link: string;
  delay: number;
}

export const StatCard = ({ label, value, icon, color, link, delay }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group relative overflow-hidden flex flex-col"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 dark:bg-slate-700/50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
    
    <div className="flex items-center justify-between mb-6 relative">
      <div className={`${color} p-4 rounded-2xl text-white shadow-lg`}>
        <img src={icon} alt={label} className="w-6 h-6 object-contain invert" referrerPolicy="no-referrer" />
      </div>
      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] leading-relaxed text-right flex-1 ml-4">{label}</p>
      <Link to={link} className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-slate-400 dark:text-slate-300 hover:text-slate-600 dark:hover:text-white transition-all ml-4">
        <ArrowUpRight className="w-5 h-5" />
      </Link>
    </div>
    
    <div className="relative mt-auto">
      <h3 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h3>
    </div>
  </motion.div>
);
