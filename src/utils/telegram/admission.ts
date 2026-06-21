import { sendTelegramMessage } from "./dispatcher";
import { getTutorSettings } from "./settings";

/**
 * Sends a Student Admission Notification
 */
export const notifyStudentAdmission = async (params: {
  name: string;
  class: string;
  batch?: string;
  monthly_fee: number;
  join_date: string;
  phone?: string;
  subject?: string;
}) => {
  const { name, class: className, batch, monthly_fee, join_date, phone, subject } = params;
  
  let formattedDate = join_date;
  try {
    const d = new Date(join_date);
    if (!isNaN(d.getTime())) {
      formattedDate = d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  } catch (e) {}

  const formattedFee = `${Number(monthly_fee).toLocaleString('en-US')} BDT`;

  let msg = `<b>Student Admission Confirmation</b>\n\n`;
  msg += `<b>Student Name</b>   : ${name}\n`;
  msg += `<b>Class</b>          : ${className}\n`;
  if (batch) {
    msg += `<b>Batch</b>          : ${batch}\n`;
  }
  if (subject) {
    msg += `<b>Subject</b>        : ${subject}\n`;
  }
  msg += `<b>Monthly Fee</b>    : ${formattedFee}\n`;
  msg += `<b>Admission Date</b> : ${formattedDate}\n`;
  if (phone) {
    msg += `<b>Contact No</b>     : ${phone}\n`;
  }
  msg += `\n────────────────────\n`;
  msg += `The student has been successfully admitted and registered.`;

  const tutorSettings = await getTutorSettings();
  if (tutorSettings?.telegram_chat_id) {
    await sendTelegramMessage(tutorSettings.telegram_chat_id, msg);
  }
};
