import { db, auth } from "../../../firebase";
import { collection, getDocs, query, where, limit, orderBy } from "firebase/firestore";
import { Student } from "../../../types/student";
import { FeeRecord } from "../../../types/fee";
import { AttendanceRecord } from "../../../types/attendance";
import { Stats } from "../types/dashboard.types";

export const fetchDashboardData = async (): Promise<Stats> => {
  if (!auth.currentUser) throw new Error("User not authenticated");
  
  const studentsQuery = query(collection(db, "students"), where("userId", "==", auth.currentUser.uid));
  const studentsSnapshot = await getDocs(studentsQuery);
  const totalStudents = studentsSnapshot.size;
  const studentsMap = new Map<string, string>();
  studentsSnapshot.docs.forEach(doc => {
    studentsMap.set(doc.id, doc.data().name);
  });
  const studentIds = new Set(studentsMap.keys());

  const currentMonth = new Date().toISOString().slice(0, 7);
  const feesQuery = query(collection(db, "fees"), where("userId", "==", auth.currentUser.uid));
  const expensesQuery = query(collection(db, "expenses"), where("userId", "==", auth.currentUser.uid));
  
  const [feesSnapshot, expensesSnapshot] = await Promise.all([
    getDocs(feesQuery),
    getDocs(expensesQuery)
  ]);
  
  let monthlyIncome = 0;
  let totalDueBalance = 0;
  let monthlyExpenses = 0;
  const upcomingFees: any[] = [];

  feesSnapshot.forEach(doc => {
    const data = doc.data() as FeeRecord;
    if (data.fee_month !== currentMonth) return;
    if (!studentIds.has(data.student_id)) return;
    if (data.status === 'paid') {
      monthlyIncome += data.amount;
    } else if (data.status === 'due' || data.status === 'pending') {
      totalDueBalance += data.amount;
      upcomingFees.push({ 
        id: doc.id, 
        studentName: studentsMap.get(data.student_id) || 'Unknown Student',
        ...data 
      });
    }
  });

  expensesSnapshot.forEach(doc => {
    const data = doc.data();
    if (data.date && data.date.startsWith(currentMonth)) {
      monthlyExpenses += data.amount || 0;
    }
  });

  const recentActivityQuery = query(
    collection(db, "attendance"), 
    where("userId", "==", auth.currentUser.uid),
    orderBy("created_at", "desc"),
    limit(5)
  );
  const recentActivitySnapshot = await getDocs(recentActivityQuery);
  const recentActivity = recentActivitySnapshot.docs
    .map(doc => {
      const data = doc.data() as AttendanceRecord;
      return {
        id: doc.id,
        studentName: studentsMap.get(data.student_id) || 'Unknown Student',
        ...data
      };
    });

  return {
    totalStudents,
    monthlyIncome,
    monthlyExpenses,
    dueFees: totalDueBalance,
    recentActivity,
    upcomingFees: upcomingFees.slice(0, 5)
  };
};
