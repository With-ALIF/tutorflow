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
import { db } from "../firebase";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";

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
        const studentsSnapshot = await getDocs(collection(db, "students"));
        const totalStudents = studentsSnapshot.size;

        const currentMonth = new Date().toISOString().slice(0, 7);
        const feesQuery = query(collection(db, "fees"), where("fee_month", "==", currentMonth));
        const feesSnapshot = await getDocs(feesQuery);
        
        let monthlyIncome = 0;
        let totalDueBalance = 0;
        const upcomingFees: any[] = [];

        feesSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.status === 'paid') {
            monthlyIncome += data.amount;
          } else {
            totalDueBalance += data.amount;
            upcomingFees.push({ id: doc.id, ...data });
          }
        });

        const recentActivityQuery = query(collection(db, "attendance"), orderBy("date", "desc"), limit(5));
        const recentActivitySnapshot = await getDocs(recentActivityQuery);
        const recentActivity = recentActivitySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

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
              <div className={`${card.color} p-5 rounded-[1.25rem] text-white shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                {typeof card.icon === 'string' ? (
                  <img src={card.icon} alt={card.label} className="w-8 h-8 object-contain invert" referrerPolicy="no-referrer" />
                ) : (
                  <card.icon className="w-8 h-8" />
                )}
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
    </div>
  );
}
