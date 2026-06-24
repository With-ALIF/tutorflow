import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AttendanceRecord } from "../../../../types/attendance";

export const drawAttendanceTables = (
  doc: jsPDF, 
  attendance: AttendanceRecord[], 
  yPos: number
): number => {
  const presentsOnly = attendance.filter(a => a.status === 'present' || a.status === 'caught_up');
  const totalPresent = presentsOnly.length;

  let currentY = yPos;
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Attendance Summary", 14, currentY);

  autoTable(doc, {
    startY: currentY + 5,
    head: [['Total Lectures Attended']],
    body: [[totalPresent]],
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42] },
  });

  currentY = (doc as any).lastAutoTable.finalY + 15;

  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Attendance Records", 14, currentY);

  const attendanceData = presentsOnly.map((a, index) => {
    const dateObj = new Date(a.date);
    const dayName = dateObj.toLocaleDateString(undefined, { weekday: 'long' });
    
    let shiftDisplay = a.shift || 'Morning';
    if (a.status === 'caught_up' && a.shift?.startsWith('CaughtUp_')) {
      const parts = a.shift.split('_');
      const missedDate = parts[1];
      const actualShift = parts[2] || 'Morning';
      shiftDisplay = `Makeup for ${missedDate} (${actualShift === 'Evening' ? 'Afternoon' : actualShift})`;
    } else {
      shiftDisplay = shiftDisplay === 'Evening' ? 'Afternoon' : shiftDisplay;
    }

    return [
      index + 1,
      dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      dayName,
      shiftDisplay
    ];
  });

  autoTable(doc, {
    startY: currentY + 5,
    head: [['SL', 'Date', 'Day of Week', 'Shift']],
    body: attendanceData,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
  });

  return (doc as any).lastAutoTable.finalY + 15;
};
