import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FeeRecord } from '../services/feeService';

export const downloadPDF = (fees: FeeRecord[]) => {
  const doc = new jsPDF();
  doc.text("Payment History", 14, 15);
  autoTable(doc, {
    head: [['Student', 'Fee Month', 'Amount', 'Date', 'Status']],
    body: fees.map(fee => [
      fee.students?.name || 'Unknown',
      fee.fee_month ? new Date(fee.fee_month + '-01').toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'N/A',
      `$${fee.amount}`,
      new Date(fee.payment_date).toLocaleDateString(),
      fee.status
    ]),
    startY: 20
  });
  doc.save("payment_history.pdf");
};
