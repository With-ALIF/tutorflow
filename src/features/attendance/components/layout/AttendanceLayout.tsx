import React from "react";
import { AttendanceHeader } from "./AttendanceHeader";
import { AttendanceTabs } from "./AttendanceTabs";
import { ActiveTab } from "../../types/attendance.types";

interface AttendanceLayoutProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  children: React.ReactNode;
}

export const AttendanceLayout: React.FC<AttendanceLayoutProps> = ({ 
  activeTab, 
  setActiveTab, 
  children 
}) => {
  return (
    <div className="space-y-6">
      <AttendanceHeader />
      <AttendanceTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="min-h-[500px]">
        {children}
      </div>
    </div>
  );
};
