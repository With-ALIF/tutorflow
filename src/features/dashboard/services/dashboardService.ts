import { db, auth } from "../../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export const fetchDashboardData = async () => {
  if (!auth.currentUser) throw new Error("User not authenticated");
  
  const studentsQuery = query(collection(db, "students"), where("userId", "==", auth.currentUser.uid));
  const studentsSnapshot = await getDocs(studentsQuery);
  const totalStudents = studentsSnapshot.size;
  const studentsMap = new Map();
  studentsSnapshot.docs.forEach(doc => {
    studentsMap.set(doc.id, doc.data().name);
  });
  const studentIds = new Set(studentsMap.keys());

  const currentMonth = new Date().toISOString().slice(0, 7);
  const feesQuery = query(collection(db, "fees"), where("userId", "==", auth.currentUser.uid));
  const feesSnapshot = await getDocs(feesQuery);
  
  let monthlyIncome = 0;
  let totalDueBalance = 0;
  const upcomingFees: any[] = [];

  feesSnapshot.forEach(doc => {
    const data = doc.data();
    if (data.fee_month !== currentMonth) return;
    if (!studentIds.has(data.student_id)) return;
    if (data.status === 'paid') {
      monthlyIncome += data.amount;
    } else {
      totalDueBalance += data.amount;
      upcomingFees.push({ 
        id: doc.id, 
        studentName: studentsMap.get(data.student_id) || 'Unknown Student',
        ...data 
      });
    }
  });

  const recentActivityQuery = query(collection(db, "attendance"), where("userId", "==", auth.currentUser.uid));
  const recentActivitySnapshot = await getDocs(recentActivityQuery);
  const recentActivity = recentActivitySnapshot.docs
    .map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        studentName: studentsMap.get(data.student_id) || 'Unknown Student',
        ...data
      };
    })
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return {
    totalStudents,
    monthlyIncome,
    dueFees: totalDueBalance,
    recentActivity,
    upcomingFees: upcomingFees.slice(0, 5)
  };
};
