import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../../../lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  link: string;
  delay: number;
  key?: string;
}

export const StatCard = ({ label, value, icon: Icon, color, link, delay }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, type: "spring", stiffness: 100 }}
    className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden flex flex-col"
  >
    <div className={cn(
      "absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-700 bg-gradient-to-br",
      color
    )} />
    
    <div className="flex items-center justify-between mb-8 relative">
      <div className={cn("p-4 rounded-2xl text-white shadow-lg bg-gradient-to-br", color)}>
        <Icon className="w-6 h-6" />
      </div>
      <Link to={link} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-2xl text-slate-400 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all">
        <ArrowUpRight className="w-5 h-5" />
      </Link>
    </div>
    
    <div className="relative mt-auto">
      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">{label}</p>
      <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h3>
    </div>
  </motion.div>
);
