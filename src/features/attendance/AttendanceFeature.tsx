import React from "react";
import { useAttendancePage } from "@/src/features/attendance/hooks/useAttendancePage";
import { useStudents } from "@/src/features/attendance/hooks/useStudents";
import { useAttendanceHistory } from "@/src/features/attendance/hooks/useAttendanceHistory";
import { useAttendanceReport } from "@/src/features/attendance/hooks/useAttendanceReport";
import { useAllAttendanceHistory } from "@/src/features/attendance/hooks/useAllAttendanceHistory";
import { AttendanceLayout } from "./components/layout/AttendanceLayout";
import { AttendancePanel } from "./components/marking/AttendancePanel";
import { HistoryPanel } from "./components/history/HistoryPanel";
import { AttendanceReport as ReportPanel } from "./components/report/AttendanceReport";
import { CalendarView } from "./components/calendar/CalendarView";

export const AttendanceFeature: React.FC = () => {
  const page = useAttendancePage();
  const { students, loading: studentsLoading } = useStudents();
  
  const activeStudents = students.filter(s => s.status !== 'finished');
  
  const { history: studentHistory, loading: fetchingHistory } = useAttendanceHistory(page.selectedStudentId, page.activeTab);
  const { history: allHistory, loading: allHistoryLoading } = useAllAttendanceHistory(page.activeTab);
  const { data: reportData } = useAttendanceReport(page.reportMonth, page.activeTab);

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
      {page.activeTab === 'calendar' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
          {(studentsLoading || allHistoryLoading) ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest animate-pulse">
                Syncing Attendance Data...
              </p>
            </div>
          ) : (
            <CalendarView records={allHistory} students={students} />
          )}
        </div>
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
