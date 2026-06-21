import { sendTelegramMessage } from "./dispatcher";
import { getTutorSettings } from "./settings";

/**
 * Sends a Payment Notification
 */
export const notifyPayment = async (params: {
  studentName: string;
  amount: number;
  paymentDate: string;
  feeMonth: string;
  status: "paid" | "due" | "unpaid";
}) => {
  const { studentName, amount, paymentDate, feeMonth, status } = params;
  const statusLabel = status.toUpperCase();
  
  let formattedDate = paymentDate;
  try {
    const d = new Date(paymentDate);
    if (!isNaN(d.getTime())) {
      formattedDate = d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  } catch (e) {}

  let formattedBillingMonth = feeMonth;
  try {
    const d = new Date(feeMonth + '-01');
    if (!isNaN(d.getTime())) {
      formattedBillingMonth = d.toLocaleDateString('en-GB', {
        month: 'long',
        year: 'numeric'
      });
    }
  } catch (e) {}

  const formattedAmount = `${Number(amount).toLocaleString('en-US')} BDT`;

  let msg = `<b>Fee Payment Confirmation</b>\n\n`;
  msg += `<b>Student Name</b>   : ${studentName}\n`;
  msg += `<b>Payment Amount</b> : ${formattedAmount}\n\n`;
  msg += `<b>Payment Date</b>   : ${formattedDate}\n`;
  msg += `<b>Billing Month</b>  : ${formattedBillingMonth}\n`;
  msg += `<b>Payment Status</b> : ${statusLabel}\n\n`;
  msg += `────────────────────\n`;
  msg += `The fee payment has been successfully processed and recorded.`;

  // We should notify both if student target exists
  const tutorSettings = await getTutorSettings();
  if (tutorSettings?.telegram_chat_id) {
    await sendTelegramMessage(tutorSettings.telegram_chat_id, msg);
  }
};
