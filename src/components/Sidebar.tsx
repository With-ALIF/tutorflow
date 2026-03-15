import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  CreditCard, 
  User,
  X,
  LogOut
} from "lucide-react";
import { cn } from "../lib/utils";
import { auth, signOut } from "../firebase";
import Logo from "./Logo";
import { motion } from "motion/react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "Students", path: "/students" },
  { icon: CalendarCheck, label: "Attendance", path: "/attendance" },
  { icon: CreditCard, label: "Tuition Fees", path: "/fees" },
  { icon: User, label: "Profile", path: "/profile" },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (auth.currentUser) {
      setUserEmail(auth.currentUser.email || null);
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <aside className="w-64 bg-[#0F172A] text-white h-full flex flex-col border-r border-white/5">
      <div className="p-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 overflow-hidden">
          <Logo className="h-8 w-auto" />
        </Link>
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group relative",
              isActive 
                ? "bg-emerald-500/10 text-emerald-400 font-semibold" 
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r-full"
                  />
                )}
                <item.icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-emerald-400" : "group-hover:text-white"
                )} />
                <span className="text-sm">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4">
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Account</p>
          <p className="text-xs text-slate-300 truncate font-medium mb-4">
            {userEmail || "Loading..."}
          </p>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/5 text-slate-300 hover:bg-red-500 hover:text-white text-xs font-bold rounded-xl transition-all border border-white/5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
