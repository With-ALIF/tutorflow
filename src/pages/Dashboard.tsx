import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  TrendingUp, 
  AlertCircle, 
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { motion } from "motion/react";
import { ToastContext } from "../context/ToastContext";
import { db, auth } from "../firebase";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { cn } from "../lib/utils";

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
    const fetchStats = async () => {
      try {
        if (!auth.currentUser) return;
        const studentsQuery = query(collection(db, "students"), where("userId", "==", auth.currentUser.uid));
        const studentsSnapshot = await getDocs(studentsQuery);
        const totalStudents = studentsSnapshot.size;
        const studentsMap = new Map();
        studentsSnapshot.docs.forEach(doc => {
          studentsMap.set(doc.id, doc.data().name);
        });
        const studentIds = new Set(studentsMap.keys());

        const currentMonth = new Date().toISOString().slice(0, 7);
        const feesQuery = query(collection(db, "fees"), where("userId", "==", auth.currentUser.uid));
        const feesSnapshot = await getDocs(feesQuery);
        
        let monthlyIncome = 0;
        let totalDueBalance = 0;
        const upcomingFees: any[] = [];

        feesSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.fee_month !== currentMonth) return;
          if (!studentIds.has(data.student_id)) return;
          if (data.status === 'paid') {
            monthlyIncome += data.amount;
          } else {
            totalDueBalance += data.amount;
            upcomingFees.push({ 
              id: doc.id, 
              studentName: studentsMap.get(data.student_id) || 'Unknown Student',
              ...data 
            });
          }
        });

        const recentActivityQuery = query(collection(db, "attendance"), where("userId", "==", auth.currentUser.uid));
        const recentActivitySnapshot = await getDocs(recentActivityQuery);
        const recentActivity = recentActivitySnapshot.docs
          .map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              studentName: studentsMap.get(data.student_id) || 'Unknown Student',
              ...data
            };
          })
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);

        setStats({
          totalStudents,
          monthlyIncome,
          dueFees: totalDueBalance,
          recentActivity,
          upcomingFees: upcomingFees.slice(0, 5)
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        showToast("Failed to fetch stats", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
      icon: "https://png.pngtree.com/png-vector/20190223/ourmid/pngtree-student-glyph-black-icon-png-image_691145.jpg",
      color: "bg-blue-500",
      trend: "+12% from last month",
      link: "/students"
    },
    {
      label: "Monthly Income",
      value: `$${(stats?.monthlyIncome || 0).toLocaleString()}`,
      icon: "https://png.pngtree.com/png-vector/20231211/ourmid/pngtree-payment-icon-income-png-image_10858293.png",
      color: "bg-emerald-500",
      trend: "+8% from last month",
      link: "/fees"
    },
    {
      label: "Due Fees",
      value: `$${(stats?.dueFees || 0).toLocaleString()}`,
      icon: "https://www.shutterstock.com/image-vector/education-grant-icon-on-white-260nw-2256198049.jpg",
      color: "bg-orange-500",
      trend: "Requires attention",
      link: "/fees"
    }
  ];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm md:text-base">Welcome back! Here's what's happening with your tuition center today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group relative overflow-hidden flex flex-col"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 dark:bg-slate-700/50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
            
            <div className="flex items-center justify-between mb-6 relative">
              <div className={`${card.color} p-4 rounded-2xl text-white shadow-lg`}>
                <img src={card.icon} alt={card.label} className="w-6 h-6 object-contain invert" referrerPolicy="no-referrer" />
              </div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] leading-relaxed text-right flex-1 ml-4">{card.label}</p>
              <Link to={card.link} className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-slate-400 dark:text-slate-300 hover:text-slate-600 dark:hover:text-white transition-all ml-4">
                <ArrowUpRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="relative mt-auto">
              <h3 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">{card.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Attendance</h2>
            <Link to="/attendance" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">View All</Link>
          </div>
          <div className="p-6">
            {stats?.recentActivity.length ? (
              <div className="space-y-6">
                {stats.recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      activity.status === 'present' 
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                        : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
                    )}>
                      {activity.status === 'present' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{activity.studentName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{activity.date}</p>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg",
                        activity.status === 'present'
                          ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
                      )}>
                        {activity.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8">No recent activity</p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Due Fees</h2>
            <Link to="/fees" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">Manage Fees</Link>
          </div>
          <div className="p-6">
            {stats?.upcomingFees.length ? (
              <div className="space-y-6">
                {stats.upcomingFees.map((fee, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-500">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{fee.studentName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Month: {fee.fee_month}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900 dark:text-white">${fee.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8">No pending fees</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
