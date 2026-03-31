import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Student, AttendanceRecord } from "../types";

export const usePDF = () => {
  const downloadPDF = (student: Student, attendance: AttendanceRecord[]) => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text(`Student Attendance Report: ${student.name}`, 14, 20);
    
    doc.setFontSize(12);
    doc.text(`Class: ${student.class}`, 14, 30);
    doc.text(`Subject: ${student.subject}`, 14, 36);
    doc.text(`Join Date: ${new Date(student.join_date).toLocaleDateString()}`, 14, 42);

    const tableData = attendance.map((a, index) => [
      index + 1,
      new Date(a.date).toLocaleDateString(),
      a.status.charAt(0).toUpperCase() + a.status.slice(1)
    ]);

    autoTable(doc, {
      startY: 50,
      head: [['SL', 'Date', 'Status']],
      body: tableData,
    });

    doc.save(`${student.name}_Attendance_Report.pdf`);
  };

  return { downloadPDF };
};
