import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  TrendingUp, 
  AlertCircle, 
  ArrowUpRight,
  Calendar
} from "lucide-react";
import { motion } from "motion/react";
import { ToastContext } from "../context/ToastContext";

interface Stats {
  totalStudents: number;
  monthlyIncome: number;
  dueFees: number;
  recentActivity: any[];
  upcomingFees: any[];
}

export default function Dashboard() {
  const { showToast } = useContext(ToastContext);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(async err => {
        const errorData = await err.json().catch(() => ({ error: "Failed to fetch stats" }));
        showToast(errorData.error || "Failed to fetch stats", "error");
        setLoading(false);
      });
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="h-32 bg-slate-200 rounded-2xl w-full" />
    <div className="grid grid-cols-3 gap-6">
      {[1, 2, 3].map(i => <div key={i} className="h-40 bg-slate-200 rounded-2xl" />)}
    </div>
  </div>;

  const cards = [
    {
      label: "Total Students",
      value: stats?.totalStudents || 0,
      icon: Users,
      color: "bg-blue-500",
      trend: "+12% from last month",
      link: "/students"
    },
    {
      label: "Monthly Income",
      value: `$${(stats?.monthlyIncome || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-emerald-500",
      trend: "+8% from last month",
      link: "/fees"
    },
    {
      label: "Due Fees",
      value: stats?.dueFees || 0,
      icon: AlertCircle,
      color: "bg-orange-500",
      trend: "Requires attention",
      link: "/fees"
    }
  ];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1 font-medium text-sm md:text-base">Welcome back! Here's what's happening with your tuition center today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group relative overflow-hidden flex flex-col"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
            
            <div className="flex justify-between items-start mb-10 relative">
              <div className={`${card.color} p-5 rounded-[1.25rem] text-white shadow-xl shadow-${card.color.split('-')[1]}-500/30 group-hover:scale-110 transition-transform duration-300`}>
                <card.icon className="w-8 h-8" />
              </div>
              <Link to={card.link} className="p-2 bg-slate-50/80 rounded-xl text-slate-400 hover:text-slate-600 transition-all">
                <ArrowUpRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="relative mt-auto">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] mb-2 leading-relaxed max-w-[120px]">{card.label}</p>
              <h3 className="text-5xl font-black text-slate-900 tracking-tight mb-6">{card.value}</h3>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full">
                  {card.trend.split(' ')[0]}
                </span>
                <span className="text-xs text-slate-400 font-medium leading-tight">
                  {card.trend.split(' ').slice(1).join(' ')}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
              <p className="text-xs text-slate-400 font-medium mt-1">Latest updates from your center</p>
            </div>
            <Link to="/attendance" className="px-4 py-2 bg-slate-50 text-slate-600 text-xs font-bold rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all">View all</Link>
          </div>
          <div className="space-y-2">
            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${activity.type === 'attendance' ? 'bg-blue-50 text-blue-500' : 'bg-emerald-50 text-emerald-500'}`}>
                    {activity.type === 'attendance' ? <Calendar className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{activity.title}</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{formatTime(activity.time)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center py-12 text-slate-300">
                <Calendar className="w-12 h-12 opacity-20 mb-2" />
                <p className="text-sm font-medium">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Upcoming Fees</h2>
              <p className="text-xs text-slate-400 font-medium mt-1">Payments expected this week</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-slate-50 text-slate-400 text-xs font-bold rounded-xl hover:text-slate-600 transition-all">Remind All</button>
              <Link to="/fees" className="px-4 py-2 bg-slate-50 text-slate-600 text-xs font-bold rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all">View all</Link>
            </div>
          </div>
          <div className="space-y-2">
            {stats?.upcomingFees && stats.upcomingFees.length > 0 ? (
              stats.upcomingFees.map((fee, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 font-bold text-lg transition-transform group-hover:scale-110">
                      {fee.students?.name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-orange-600 transition-colors">{fee.students?.name}</p>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">Due: ${fee.amount}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-full uppercase tracking-wider">PENDING</span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center py-12 text-slate-300">
                <AlertCircle className="w-12 h-12 opacity-20 mb-2" />
                <p className="text-sm font-medium">No pending fees</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
