import jsPDF from "jspdf";
import { Student } from "../../../../types/student";
import { loadImage } from "./loadImage";

export const drawStudentInfo = async (
  doc: jsPDF, 
  student: Student, 
  yPos: number
): Promise<number> => {
  if (student.photo) {
    try {
      const base64Img = await loadImage(student.photo);
      doc.setDrawColor(226, 232, 240);
      doc.rect(13.5, yPos - 0.5, 36, 36, 'S');
      doc.addImage(base64Img, 'JPEG', 14, yPos, 35, 35);
    } catch (e) {
      console.error("Could not add student photo to PDF", e);
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
  doc.text(student.name, infoX, yPos);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Roll/ID: #${student.id.slice(0, 8)}`, infoX, yPos + 6);

  doc.setTextColor(51, 65, 85);
  doc.setFont("helvetica", "bold");
  doc.text("Class:", infoX, yPos + 17);
  doc.text("Subject:", infoX, yPos + 23);
  doc.text("Join Date:", infoX, yPos + 29);
  doc.text("Phone:", infoX, yPos + 35);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text(student.class || "N/A", infoX + 25, yPos + 17);
  doc.text(student.subject || "N/A", infoX + 25, yPos + 23);
  doc.text(new Date(student.join_date).toLocaleDateString(), infoX + 25, yPos + 29);
  doc.text(student.phone || "N/A", infoX + 25, yPos + 35);

  return yPos + 50;
};
