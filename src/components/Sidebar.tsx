import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  CreditCard, 
  MessageSquare,
  GraduationCap,
  X,
  LogOut
} from "lucide-react";
import { cn } from "../lib/utils";
import { supabase } from "../lib/supabase";
import Logo from "./Logo";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "Students", path: "/students" },
  { icon: CalendarCheck, label: "Attendance", path: "/attendance" },
  { icon: CreditCard, label: "Tuition Fees", path: "/fees" },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email || null);
    });
  }, []);

  return (
    <aside className="w-64 bg-slate-900 text-white h-full flex flex-col border-r border-slate-800">
      <div className="p-4 flex items-center justify-between border-b border-slate-800">
        <Link to="/" className="flex items-center gap-2 overflow-hidden">
          <Logo className="h-10 w-auto" />
        </Link>
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden p-2 hover:bg-slate-800 rounded-lg text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              isActive 
                ? "bg-emerald-500/10 text-emerald-400 font-medium shadow-sm border border-emerald-500/20" 
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-colors",
              "group-hover:text-white"
            )} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Logged in as</p>
          <p className="text-sm text-slate-300 truncate font-medium mb-3">
            {userEmail || "Loading..."}
          </p>
          <button 
            onClick={() => supabase.auth.signOut()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white text-sm font-bold rounded-lg transition-all border border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
