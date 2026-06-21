import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FeeRecord } from "../../../../types/fee";

export const drawPaymentTable = (doc: jsPDF, fees: FeeRecord[], yPos: number): number => {
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Payment History", 14, yPos);

  const paymentData = fees.map(fee => [
    fee.fee_month,
    `BDT ${fee.amount}`,
    new Date(fee.payment_date).toLocaleDateString(),
    fee.status.toUpperCase()
  ]);

  autoTable(doc, {
    startY: yPos + 5,
    head: [['Month', 'Amount', 'Date', 'Status']],
    body: paymentData,
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229] },
  });

  return (doc as any).lastAutoTable.finalY + 15;
};
