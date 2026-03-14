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
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back! Here's what's happening with your tuition center.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`${card.color} p-3 rounded-xl text-white shadow-lg shadow-${card.color.split('-')[1]}-500/20`}>
                <card.icon className="w-6 h-6" />
              </div>
              <Link to={card.link} className="text-slate-400 hover:text-slate-600 transition-colors">
                <ArrowUpRight className="w-5 h-5" />
              </Link>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{card.label}</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{card.value}</h3>
              <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                {card.trend}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
            <Link to="/attendance" className="text-sm text-emerald-600 font-medium hover:underline">View all</Link>
          </div>
          <div className="space-y-4">
            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'attendance' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {activity.type === 'attendance' ? <Calendar className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">{activity.title}</p>
                    <p className="text-xs text-slate-500">{formatTime(activity.time)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">No recent activity found.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Upcoming Fees</h2>
            <div className="flex gap-3">
              <button className="text-sm text-slate-400 font-medium hover:text-slate-600">Send Reminders</button>
              <Link to="/fees" className="text-sm text-emerald-600 font-medium hover:underline">View all</Link>
            </div>
          </div>
          <div className="space-y-4">
            {stats?.upcomingFees && stats.upcomingFees.length > 0 ? (
              stats.upcomingFees.map((fee, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold uppercase">
                      {fee.students?.name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{fee.students?.name}</p>
                      <p className="text-xs text-slate-500">Due: ${fee.amount}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-orange-100 text-orange-600 text-[10px] font-bold rounded-full uppercase tracking-tighter">DUE</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">No upcoming fees found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
