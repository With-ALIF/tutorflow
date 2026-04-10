import React from "react";
import { UserCheck, History, BarChart3 } from "lucide-react";
import { cn } from "../../../../lib/utils";
import { ActiveTab } from "../../types/attendance.types";

interface AttendanceTabsProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const AttendanceTabs: React.FC<AttendanceTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'mark', label: 'Mark Attendance', icon: UserCheck },
    { id: 'history', label: 'History', icon: History },
    { id: 'report', label: 'Monthly Report', icon: BarChart3 },
  ] as const;

  return (
    <div className="flex items-center gap-2 p-1.5 bg-slate-100/50 dark:bg-slate-800/50 rounded-3xl w-fit border border-slate-200/40 dark:border-slate-700/40">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 sm:px-6 rounded-2xl text-xs font-bold transition-all",
              isActive
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200/60 dark:border-slate-700"
                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            )}
          >
            <Icon className={cn("w-4 h-4", isActive ? "text-emerald-500" : "text-slate-400")} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
