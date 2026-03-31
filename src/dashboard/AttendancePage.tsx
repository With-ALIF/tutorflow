import React, { useState } from "react";
import { AttendanceHeader } from "./components/AttendanceHeader";
import { AttendanceTabs } from "./components/AttendanceTabs";
import { useAttendance } from "./hooks/useAttendance";
import { useAttendanceHistory } from "./hooks/useAttendanceHistory";
import { useAttendanceReport } from "./hooks/useAttendanceReport";
import { format } from "date-fns";
import { StudentTable } from "./components/StudentTable";
import { HistoryPanel } from "./history/HistoryPanel";
import { ReportTable } from "./components/ReportTable";

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<'mark' | 'history' | 'report'>('mark');
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [reportMonth, setReportMonth] = useState(format(new Date(), "yyyy-MM"));
  
  const { students, records, loading, saving, handleStatusChange, handleSave } = useAttendance(date);
  
  // History
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const { history: studentHistory, loading: fetchingHistory } = useAttendanceHistory(selectedStudentId);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  
  // Report
  const { data: reportData, loading: fetchingReport } = useAttendanceReport(reportMonth);

  return (
    <div className="space-y-10">
      <AttendanceHeader />
      <AttendanceTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === 'mark' && (
        <StudentTable 
          students={students} 
          records={records} 
          date={date} 
          setDate={setDate} 
          handleStatusChange={handleStatusChange} 
          handleSave={handleSave} 
          saving={saving}
          loading={loading}
        />
      )}
      {activeTab === 'history' && (
        <HistoryPanel 
          students={students} 
          studentHistory={studentHistory}
          selectedStudentId={selectedStudentId}
          setSelectedStudentId={setSelectedStudentId}
          fetchingHistory={fetchingHistory}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
      )}
      {activeTab === 'report' && (
        <ReportTable 
          students={students} 
          reportMonth={reportMonth} 
          setReportMonth={setReportMonth} 
          reportData={reportData}
        />
      )}
    </div>
  );
}
