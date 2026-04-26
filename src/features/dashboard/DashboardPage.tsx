import React from "react";
import { useDashboard } from "@/src/features/dashboard/hooks/useDashboard";
import { StatsCards } from "./components/StatsCards";
import { RecentAttendance } from "./components/RecentAttendance";
import { DueFees } from "./components/DueFees";

export default function DashboardPage() {
  const { stats, loading } = useDashboard();

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl w-full" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-slate-200 dark:bg-slate-800 rounded-[2.5rem]" />)}
    </div>
  </div>;

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl min-[400px]:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">Dashboard Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm md:text-base">Welcome back! Here’s a quick summary of what’s happening in your tuition center today.</p>
      </header>

      <StatsCards stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentAttendance activity={stats?.recentActivity || []} />
        <DueFees fees={stats?.upcomingFees || []} />
      </div>
    </div>
  );
}
