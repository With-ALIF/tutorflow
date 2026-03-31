import { db } from "../../firebase";
import { collection, getDocs, query, where, doc, setDoc, addDoc } from "firebase/firestore";
import { Student, AttendanceRecord } from "../types";

export const fetchStudents = async (userId: string): Promise<Student[]> => {
  const q = query(collection(db, "students"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student)).sort((a, b) => a.name.localeCompare(b.name));
};

export const fetchAttendanceByDate = async (userId: string, date: string): Promise<Record<string, 'present' | 'absent'>> => {
  const q = query(collection(db, "attendance"), where("userId", "==", userId), where("date", "==", date));
  const querySnapshot = await getDocs(q);
  const records: Record<string, 'present' | 'absent'> = {};
  querySnapshot.docs.forEach(doc => {
    const data = doc.data();
    records[data.student_id] = data.status;
  });
  return records;
};

export const saveAttendance = async (userId: string, date: string, records: Record<string, 'present' | 'absent'>, students: Student[]) => {
  // Fetch all attendance and fees for the user to avoid composite index requirements
  const allAttendanceQ = query(collection(db, "attendance"), where("userId", "==", userId));
  const allAttendanceSnapshot = await getDocs(allAttendanceQ);
  const allAttendance = allAttendanceSnapshot.docs.map(doc => doc.data() as AttendanceRecord);
  
  const allFeesQ = query(collection(db, "fees"), where("userId", "==", userId));
  const allFeesSnapshot = await getDocs(allFeesQ);
  const allFees = allFeesSnapshot.docs.map(doc => doc.data());

  for (const [studentId, status] of Object.entries(records)) {
    const attendanceId = `${studentId}_${date}`;
    const attendanceRef = doc(db, "attendance", attendanceId);
    await setDoc(attendanceRef, {
      student_id: studentId,
      userId: userId,
      date,
      status,
      created_at: new Date().toISOString()
    }, { merge: true });

    // Auto-generate fee logic
    if (status === 'present') {
      const student = students.find(s => s.id === studentId);
      if (student) {
        const lecturesPerMonth = student.lectures_per_month || 12;
        
        // Calculate present count from memory, including the current record if it wasn't already present
        let count = allAttendance.filter(a => a.student_id === studentId && a.status === 'present').length;
        const existingRecord = allAttendance.find(a => a.student_id === studentId && a.date === date);
        if (!existingRecord || existingRecord.status !== 'present') {
          count++;
        }

        if (count > 0 && count % lecturesPerMonth === 0) {
          const recordMonth = date.slice(0, 7);
          const feeExists = allFees.some(f => f.student_id === studentId && f.fee_month === recordMonth);
          
          if (!feeExists) {
            await addDoc(collection(db, "fees"), {
              student_id: studentId,
              userId: userId,
              amount: student.monthly_fee || 0,
              payment_date: date,
              fee_month: recordMonth,
              status: 'due',
              created_at: new Date().toISOString()
            });
            // Add to in-memory array to prevent duplicate fees in the same save operation
            allFees.push({
              student_id: studentId,
              fee_month: recordMonth
            } as any);
          }
        }
      }
    }
  }
};
