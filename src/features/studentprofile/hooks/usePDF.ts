import jsPDF from "jspdf";
import { Student } from "../../../types/student";
import { AttendanceRecord } from "../../../types/attendance";
import { FeeRecord } from "../../../types/fee";
import { Routine } from "../../routine/types/routine.types";
import { drawHeader } from "../utils/pdf/pdfHeader";
import { drawStudentInfo } from "../utils/pdf/pdfStudentInfo";
import { drawCourseTable } from "../utils/pdf/pdfCourseTable";
import { drawPaymentTable } from "../utils/pdf/pdfPaymentTable";
import { drawAttendanceTables } from "../utils/pdf/pdfAttendanceTables";
import { generateRunningMonthReport } from "../utils/pdf/pdfRunnerReport";

export const usePDF = () => {
  const downloadPDF = async (
    student: Student, 
    attendance: AttendanceRecord[], 
    fees: FeeRecord[]
  ): Promise<void> => {
    const doc = new jsPDF();
    drawHeader(doc, "Student Progress Report");
    
    let yPos = 55;
    yPos = await drawStudentInfo(doc, student, yPos);
    yPos = drawCourseTable(doc, student, yPos);
    yPos = drawPaymentTable(doc, fees, yPos);
    drawAttendanceTables(doc, attendance, yPos);
    
    doc.save(`${student.name}_Report.pdf`);
  };

  const downloadAttendancePDF = async (
    student: Student, 
    attendance: AttendanceRecord[]
  ): Promise<void> => {
    const doc = new jsPDF();
    drawHeader(doc, "Attendance Report");
    
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
    drawAttendanceTables(doc, attendance, yPos);
    
    doc.save(`${student.name}_Attendance_Report.pdf`);
  };

  const downloadRunningMonthReportPDF = async (
    student: Student, 
    attendance: AttendanceRecord[], 
    routines: Routine[]
  ): Promise<void> => {
    await generateRunningMonthReport(student, attendance);
  };

  return { downloadPDF, downloadAttendancePDF, downloadRunningMonthReportPDF };
};
export default usePDF;
