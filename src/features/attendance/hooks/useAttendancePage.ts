import { useState, useCallback } from "react";
import { format } from "date-fns";
import { ActiveTab } from "../types/attendance.types";

export const useAttendancePage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('mark');
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [reportMonth, setReportMonth] = useState(format(new Date(), "yyyy-MM"));
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const handleTabChange = useCallback((tab: ActiveTab) => {
    setActiveTab(tab);
  }, []);

  const handleDateChange = useCallback((newDate: string) => {
    setDate(newDate);
  }, []);

  return {
    activeTab,
    handleTabChange,
    date,
    handleDateChange,
    reportMonth,
    setReportMonth,
    selectedStudentId,
    setSelectedStudentId,
    selectedMonth,
    setSelectedMonth,
  };
};
