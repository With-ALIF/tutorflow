import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Student } from "../../../types/student";
import { AttendanceRecord } from "../../../types/attendance";
import { FeeRecord } from "../../../types/fee";
import { Expense } from "../../expenses/types/expense.types";

export const usePDF = () => {
  const loadImage = async (url: string): Promise<string> => {
    if (url.startsWith('data:')) return url;
    
    let targetUrl = url;
    if (url.includes('github.com') && url.includes('/blob/')) {
      targetUrl = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
    }
    
    try {
      const response = await fetch(targetUrl);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.warn("Fetch failed, falling back to Image + Canvas", error);
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/jpeg"));
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = url;
      });
    }
  };

  const downloadPDF = async (student: Student, attendance: AttendanceRecord[], fees: FeeRecord[], expenses: Expense[]) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Student Progress Report", 14, 25);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth - 14, 25, { align: 'right' });

    doc.setTextColor(0, 0, 0);
    let yPos = 55;
    if (student.photo) {
      try {
        const base64Img = await loadImage(student.photo);
        doc.setDrawColor(226, 232, 240); // slate-200
        doc.rect(13.5, yPos - 0.5, 36, 36, 'S');
        doc.addImage(base64Img, 'JPEG', 14, yPos, 35, 35);
      } catch (e) {
        console.error("Could not add student photo to PDF", e);
        // Fallback: Placeholder UI
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.rect(14, yPos, 35, 35, 'S');
        doc.setFontSize(8);
        doc.text("No Photo", 31.5, yPos + 18.5, { align: 'center' });
      }
    } else {
      doc.setDrawColor(241, 245, 249);
      doc.setFillColor(241, 245, 249);
      doc.rect(14, yPos, 35, 35, 'FD');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text("No Photo", 31.5, yPos + 18.5, { align: 'center' });
    }

    const infoX = 55;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(student.name, infoX, 55);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Roll/ID: #${student.id.slice(0, 8)}`, infoX, 61);

    doc.setTextColor(51, 65, 85);
    doc.setFont("helvetica", "bold");
    doc.text("Class:", infoX, 72);
    doc.text("Subject:", infoX, 78);
    doc.text("Join Date:", infoX, 84);
    doc.text("Phone:", infoX, 90);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(student.class || "N/A", infoX + 25, 72);
    doc.text(student.subject || "N/A", infoX + 25, 78);
    doc.text(new Date(student.join_date).toLocaleDateString(), infoX + 25, 84);
    doc.text(student.phone || "N/A", infoX + 25, 90);

    yPos = 105;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Course Details", 14, yPos);
    yPos += 5;

    autoTable(doc, {
      startY: yPos,
      head: [['Monthly Fee', 'Lectures/Month', 'Lectures/Week', 'Batch']],
      body: [[
        `BDT ${student.monthly_fee}`,
        `${student.lectures_per_month} Days`,
        `${student.lectures_per_week} Days`,
        student.batch || "N/A"
      ]],
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42] },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Payment History
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Payment History", 14, yPos);
    yPos += 5;

    const paymentData = fees.map(fee => [
      fee.fee_month,
      `BDT ${fee.amount}`,
      new Date(fee.payment_date).toLocaleDateString(),
      fee.status.toUpperCase()
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Month', 'Amount', 'Date', 'Status']],
      body: paymentData,
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] }, // indigo-600
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Student Expenses
    if (expenses.length > 0) {
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Personal Expenses History", 14, yPos);
      yPos += 5;

      const expenseData = expenses.map(exp => [
        exp.title,
        exp.category,
        `BDT ${exp.amount}`,
        new Date(exp.date).toLocaleDateString()
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['Title', 'Category', 'Amount', 'Date']],
        body: expenseData,
        theme: 'striped',
        headStyles: { fillColor: [239, 68, 68] }, // red-500
      });

      yPos = (doc as any).lastAutoTable.finalY + 15;
    }
    const totalPresent = attendance.filter(a => a.status === 'present').length;
    const totalAbsent = attendance.filter(a => a.status === 'absent').length;
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Attendance Summary", 14, yPos);
    yPos += 5;

    autoTable(doc, {
      startY: yPos,
      head: [['Total Days', 'Present', 'Absent', 'Attendance Rate']],
      body: [[
        attendance.length,
        totalPresent,
        totalAbsent,
        attendance.length > 0 ? `${((totalPresent / attendance.length) * 100).toFixed(1)}%` : '0%'
      ]],
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42] },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Attendance Records", 14, yPos);
    yPos += 5;

    const attendanceData = attendance.map((a, index) => [
      index + 1,
      new Date(a.date).toLocaleDateString(),
      a.status.charAt(0).toUpperCase() + a.status.slice(1)
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['SL', 'Date', 'Status']],
      body: attendanceData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] }, // blue-500
    });

    doc.save(`${student.name}_Report.pdf`);
  };

  const downloadAttendancePDF = async (student: Student, attendance: AttendanceRecord[]) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Attendance Report", 14, 25);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth - 14, 25, { align: 'right' });
    doc.setTextColor(0, 0, 0);
    let yPos = 55;
    const infoX = 14;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(student.name, infoX, yPos);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Roll/ID: #${student.id.slice(0, 8)}`, infoX, yPos + 6);

    yPos += 15;

    const totalPresent = attendance.filter(a => a.status === 'present').length;
    const totalAbsent = attendance.filter(a => a.status === 'absent').length;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Attendance Summary", 14, yPos);
    yPos += 5;

    autoTable(doc, {
      startY: yPos,
      head: [['Total Days', 'Present', 'Absent', 'Attendance Rate']],
      body: [[
        attendance.length,
        totalPresent,
        totalAbsent,
        attendance.length > 0 ? `${((totalPresent / attendance.length) * 100).toFixed(1)}%` : '0%'
      ]],
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42] },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Attendance Records", 14, yPos);
    yPos += 5;

    const attendanceData = attendance.map((a, index) => [
      index + 1,
      new Date(a.date).toLocaleDateString(),
      a.status.charAt(0).toUpperCase() + a.status.slice(1)
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['SL', 'Date', 'Status']],
      body: attendanceData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] }, // blue-500
    });

    doc.save(`${student.name}_Attendance_Report.pdf`);
  };

  return { downloadPDF, downloadAttendancePDF };
};
