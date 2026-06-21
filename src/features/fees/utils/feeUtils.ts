import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FeeRecord } from '../types/fee.types';

export const downloadPDF = (fees: FeeRecord[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Header Title
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text("Tuition Fee Report", 14, 20);

  // Date
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(`Report Generated On: ${new Date().toLocaleDateString()}`, 14, 26);

  // Summary Box
  const totalAmount = fees.reduce((sum, fee) => sum + (fee.amount || 0), 0);
  doc.setFillColor(241, 245, 249); // slate-100
  doc.rect(14, 35, pageWidth - 28, 15, 'F');
  
  doc.setTextColor(51, 65, 85); // slate-700
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Total Records: ${fees.length}`, 20, 44);
  doc.text(`Total Amount: BDT ${totalAmount.toLocaleString()}`, pageWidth - 20, 44, { align: 'right' });

  // Table
  autoTable(doc, {
    startY: 55,
    head: [['Student', 'Fee Month', 'Amount (BDT)', 'Date', 'Status']],
    body: fees.map(fee => [
      fee.students?.name || 'Unknown',
      fee.fee_month ? new Date(fee.fee_month + '-01').toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'N/A',
      fee.amount?.toLocaleString(),
      new Date(fee.payment_date).toLocaleDateString(),
      fee.status.charAt(0).toUpperCase() + fee.status.slice(1)
    ]),
    headStyles: { fillColor: [51, 65, 85], textColor: 255, fontSize: 10, fontStyle: 'bold' }, 
    bodyStyles: { fontSize: 9, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [248, 250, 252] }, 
    margin: { left: 14, right: 14 },
    theme: 'grid'
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, doc.internal.pageSize.height - 10, { align: 'right' });
  }

  doc.save("tuition_fee_report.pdf");
};

