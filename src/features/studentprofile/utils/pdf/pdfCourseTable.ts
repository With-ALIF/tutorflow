import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Student } from "../../../../types/student";

export const drawCourseTable = (doc: jsPDF, student: Student, yPos: number): number => {
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Course Details", 14, yPos);
  
  autoTable(doc, {
    startY: yPos + 5,
    head: [['Monthly Fee', 'Lectures/Month', 'Lectures/Week']],
    body: [[
      `BDT ${student.monthly_fee}`,
      `${student.lectures_per_month} Days`,
      `${student.lectures_per_week} Days`
    ]],
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42] },
  });

  return (doc as any).lastAutoTable.finalY + 15;
};
