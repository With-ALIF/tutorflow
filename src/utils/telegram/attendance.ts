import { dispatchNotification } from "./dispatcher";

/**
 * Sends an Attendance Notification
 */
export const notifyAttendance = async (params: {
  studentName: string;
  studentTelegramChatId?: string;
  status: "present" | "absent" | "caught_up";
  date: string;
  shift: string;
  currentLectureCount: number;
  lecturesPerMonth: number;
}) => {
  const { studentName, studentTelegramChatId, status, date, shift, currentLectureCount, lecturesPerMonth } = params;
  
  const statusLabel = status === "caught_up" ? "Caught Up" : status === "present" ? "Present" : "Absent";
  
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

  const currentInCycle = ((currentLectureCount - 1) % lecturesPerMonth) + 1;
  const cycleNumber = Math.ceil(currentLectureCount / lecturesPerMonth) || 1;
  const sessionName = shift.trim() ? (shift.charAt(0).toUpperCase() + shift.slice(1)) + (shift.toLowerCase().includes('shift') ? "" : " Shift") : "";
  
  let msg = `<b>Attendance Update</b>\n\n`;
  msg += `<b>Student Name</b> : ${studentName}\n`;
  msg += `<b>Attendance  </b> : ${statusLabel}\n\n`;
  msg += `<b>Date        </b> : ${formattedDate}\n`;
  if (sessionName) {
    msg += `<b>Session     </b> : ${sessionName}\n`;
  }
  msg += `<b>Lecture     </b> : ${currentInCycle} of ${lecturesPerMonth}\n`;
  msg += `<b>Cycle       </b> : #${cycleNumber}\n\n`;
  msg += `────────────────────\n`;
  msg += `The student's attendance has been successfully updated.`;

  await dispatchNotification(studentTelegramChatId, msg);

  // Check if a new cycle started
  if ((status === "present" || status === "caught_up") && currentInCycle === 1) {
    let cycleMsg = `<b>Attendance Cycle Notification</b>\n\n`;
    cycleMsg += `<b>Student Name</b> : ${studentName}\n`;
    cycleMsg += `<b>Current Lecture</b> : 1 of ${lecturesPerMonth}\n`;
    cycleMsg += `<b>Cycle Status</b> : Active\n\n`;
    cycleMsg += `────────────────────\n`;
    cycleMsg += `A new class attendance cycle has been successfully initiated.\n\n`;
    cycleMsg += `The corresponding fee record for this cycle has been created automatically.`;
    await dispatchNotification(studentTelegramChatId, cycleMsg);
  }
};
