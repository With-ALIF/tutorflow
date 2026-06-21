import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Student } from "../../../../types/student";
import { AttendanceRecord } from "../../../../types/attendance";
import { drawHeader } from "./pdfHeader";

export const generateRunningMonthReport = async (
  student: Student,
  attendance: AttendanceRecord[]
): Promise<void> => {
  const doc = new jsPDF();
  drawHeader(doc, "Active Month Progress Report", `Generated: ${new Date().toLocaleDateString()}`, [79, 70, 229]);

  doc.setTextColor(0, 0, 0);
  let yPos = 55;
  const infoX = 14;
  
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(student.name, infoX, yPos);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Roll/ID: #${student.id.slice(0, 8)}  |  Batch: ${student.batch || "N/A"}`, infoX, yPos + 6);
  
  yPos += 15;
  
  const sortedAttendance = [...attendance]
    .filter(a => a.status === 'present' || a.status === 'caught_up')
    .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const presents = sortedAttendance;
  const totalPresent = presents.length;
  const lecturesPerMonth = student.lectures_per_month || 12;
  const monthsCompleted = Math.floor(totalPresent / lecturesPerMonth);
  const currentCycleAttendanceCount = totalPresent % lecturesPerMonth;
  const lecturesRemaining = lecturesPerMonth - currentCycleAttendanceCount;
  
  let currentCycleRecords: AttendanceRecord[] = [];
  if (totalPresent > 0) {
    const currentCyclePresentsStartIdx = monthsCompleted * lecturesPerMonth;
    if (currentCyclePresentsStartIdx < presents.length) {
      const currentCycleFirstPresent = presents[currentCyclePresentsStartIdx];
      currentCycleRecords = sortedAttendance.filter(a => new Date(a.date).getTime() >= new Date(currentCycleFirstPresent.date).getTime());
    } else {
      const lastPresentOfPrevCycle = presents[currentCyclePresentsStartIdx - 1];
      if (lastPresentOfPrevCycle) {
        currentCycleRecords = sortedAttendance.filter(a => new Date(a.date).getTime() > new Date(lastPresentOfPrevCycle.date).getTime());
      } else {
        currentCycleRecords = sortedAttendance;
      }
    }
  } else {
    currentCycleRecords = sortedAttendance;
  }
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Current Active Month Summary", 14, yPos);
  
  autoTable(doc, {
    startY: yPos + 5,
    head: [['Active Study Month', 'Completed Lectures', 'Remaining Lectures', 'Billing State']],
    body: [[
      `Month #${monthsCompleted + 1}`,
      `${currentCycleAttendanceCount} / ${lecturesPerMonth} Lectures`,
      `${lecturesRemaining} Lectures`,
      currentCycleAttendanceCount >= lecturesPerMonth ? "Cycle Completed" : "Under Active Cycle"
    ]],
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] },
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 12;
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Active Month Attendance Log", 14, yPos);
  yPos += 5;
  
  if (currentCycleRecords.length === 0) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100);
    doc.text("No attendance days recorded inside this active month yet.", 14, yPos);
  } else {
    const logRows = currentCycleRecords.map((r, i) => {
      const dateObj = new Date(r.date);
      const dayName = dateObj.toLocaleDateString(undefined, { weekday: 'long' });
      
      let shiftDisplay = r.shift || 'Morning';
      if (r.status === 'caught_up' && r.shift?.startsWith('CaughtUp_')) {
        const parts = r.shift.split('_');
        const actualShift = parts[2] || 'Morning';
        shiftDisplay = `Caught Up (${actualShift === 'Evening' ? 'Afternoon' : actualShift})`;
      } else {
        shiftDisplay = shiftDisplay === 'Evening' ? 'Afternoon' : shiftDisplay;
      }

      return [
        i + 1,
        dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
        dayName,
        shiftDisplay
      ];
    });
    
    autoTable(doc, {
      startY: yPos,
      head: [['SL', 'Date', 'Day of Week', 'Shift']],
      body: logRows,
      theme: 'striped',
      headStyles: { fillColor: [30, 41, 59] },
      bodyStyles: { fontStyle: 'bold' }
    });
  }
  
  doc.save(`${student.name}_Running_Month_Report.pdf`);
};
