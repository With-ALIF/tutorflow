import jsPDF from "jspdf";

export const drawHeader = (
  doc: jsPDF, 
  title: string, 
  subtitle?: string, 
  bgColor: [number, number, number] = [15, 23, 42]
) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(title, 14, 25);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const rightText = subtitle || `Generated on: ${new Date().toLocaleDateString()}`;
  doc.text(rightText, pageWidth - 14, 25, { align: 'right' });
};
