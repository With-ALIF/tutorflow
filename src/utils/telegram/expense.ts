import { sendTelegramMessage } from "./dispatcher";
import { getTutorSettings } from "./settings";

/**
 * Sends an Expense Notification
 */
export const notifyExpense = async (params: {
  title: string;
  amount: number;
  category: string;
  date: string;
  studentName?: string;
}) => {
  const { title, amount, category, date, studentName } = params;
  
  let formattedDate = date;
  try {
    const d = new Date(date);
    if (!isNaN(d.getTime())) {
      formattedDate = d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  } catch (e) {}

  const formattedAmount = `${Number(amount).toLocaleString('en-US')} BDT`;
  
  let msg = `<b>New Expense Entry</b>\n\n`;
  msg += `<b>Expense Title</b> : ${title}\n`;
  msg += `<b>Amount</b>        : ${formattedAmount}\n`;
  msg += `<b>Category</b>      : ${category}\n`;
  msg += `<b>Entry Date</b>    : ${formattedDate}\n`;
  if (studentName) {
    msg += `<b>Student</b>       : ${studentName}\n`;
  }
  msg += `\n────────────────────\n`;
  msg += `Expense information has been successfully recorded.`;

  const tutorSettings = await getTutorSettings();
  if (tutorSettings?.telegram_chat_id) {
    await sendTelegramMessage(tutorSettings.telegram_chat_id, msg);
  }
};
