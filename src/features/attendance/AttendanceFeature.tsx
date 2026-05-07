import React from "react";
import { useAttendancePage } from "@/src/features/attendance/hooks/useAttendancePage";
import { useStudents } from "@/src/features/attendance/hooks/useStudents";
import { useAttendanceHistory } from "@/src/features/attendance/hooks/useAttendanceHistory";
import { useAttendanceReport } from "@/src/features/attendance/hooks/useAttendanceReport";
import { AttendanceLayout } from "./components/layout/AttendanceLayout";
import { AttendancePanel } from "./components/marking/AttendancePanel";
import { HistoryPanel } from "./components/history/HistoryPanel";
import { AttendanceReport as ReportPanel } from "./components/report/AttendanceReport";

export const AttendanceFeature: React.FC = () => {
  const page = useAttendancePage();
  const { students } = useStudents();
  
  const activeStudents = students.filter(s => s.status !== 'finished');
  
  const { history: studentHistory, loading: fetchingHistory } = useAttendanceHistory(page.selectedStudentId);
  const { data: reportData } = useAttendanceReport(page.reportMonth);

  return (
    <AttendanceLayout activeTab={page.activeTab} setActiveTab={page.handleTabChange}>
      {page.activeTab === 'mark' && (
        <AttendancePanel date={page.date} setDate={page.handleDateChange} />
      )}
      {page.activeTab === 'history' && (
        <HistoryPanel 
          students={students} 
          studentHistory={studentHistory}
          selectedStudentId={page.selectedStudentId}
          setSelectedStudentId={page.setSelectedStudentId}
          fetchingHistory={fetchingHistory}
          selectedMonth={page.selectedMonth}
          setSelectedMonth={page.setSelectedMonth}
        />
      )}
      {page.activeTab === 'report' && (
        <ReportPanel 
          students={activeStudents} 
          reportMonth={page.reportMonth} 
          setReportMonth={page.setReportMonth} 
          reportData={reportData}
        />
      )}
    </AttendanceLayout>
  );
};
