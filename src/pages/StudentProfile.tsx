import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  User, 
  Phone, 
  Calendar, 
  CreditCard, 
  ChevronLeft,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";
import { db } from "../firebase";
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";

interface Student {
  id: string;
  name: string;
  class: string;
  phone: string;
  subject: string;
  address: string;
  monthly_fee: number;
  lectures_per_month: number;
  lectures_per_week: number;
  class_days: string[];
  join_date: string;
  photo?: string;
}

export default function StudentProfile() {
  const { id } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!id) return;
      try {
        const studentDoc = await getDoc(doc(db, "students", id));
        if (studentDoc.exists()) {
          setStudent({ id: studentDoc.id, ...studentDoc.data() } as Student);
        }

        const attendanceQuery = query(collection(db, "attendance"), where("student_id", "==", id), orderBy("date", "desc"));
        const attendanceSnapshot = await getDocs(attendanceQuery);
        setAttendance(attendanceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const feesQuery = query(collection(db, "fees"), where("student_id", "==", id), orderBy("payment_date", "desc"));
        const feesSnapshot = await getDocs(feesQuery);
        setFees(feesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      } catch (error) {
        console.error("Error fetching student profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading profile...</div>;
  if (!student) return <div className="p-8 text-center text-red-500">Student not found.</div>;

  const totalPresent = attendance.filter(a => a.status === 'present').length;
  const lecturesPerMonth = student.lectures_per_month || 12;
  const monthsCompleted = Math.floor(totalPresent / lecturesPerMonth);
  const currentCycleAttendance = totalPresent % lecturesPerMonth;
  const progressPercentage = (currentCycleAttendance / lecturesPerMonth) * 100;

  return (
    <div className="space-y-10">
      <header className="flex items-center gap-6">
        <Link to="/students" className="p-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 shadow-sm transition-all text-slate-500 active:scale-95">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Student Profile</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm md:text-base">Detailed overview of academic and financial records.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="h-32 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 blur-xl" />
            </div>
            <div className="px-8 pb-8">
              <div className="-mt-16 mb-6 relative">
                <div className="w-32 h-32 rounded-3xl bg-white p-1.5 shadow-2xl">
                  {student.photo ? (
                    <img src={student.photo} alt={student.name} className="w-full h-full rounded-2xl object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center text-4xl font-bold text-slate-400">
                      {student.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center text-white">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{student.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-widest">Class {student.class}</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest">{student.subject || 'No Subject'}</span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest">Active</span>
              </div>
              
              <div className="mt-8 space-y-5">
                <div className="flex items-center gap-4 text-slate-600 group">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Phone</p>
                    <p className="font-bold text-slate-700">{student.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-600 group">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Address</p>
                    <p className="font-bold text-slate-700">{student.address || 'Not Provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-600 group">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Joined On</p>
                    <p className="font-bold text-slate-700">{new Date(student.join_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="space-y-4 text-slate-600">
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Lectures / Month</p>
                      <p className="font-bold text-slate-700">{student.lectures_per_month || 12} Lectures</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Lectures / Week</p>
                      <p className="font-bold text-slate-700">{student.lectures_per_week || 3} Lectures</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Class Days</p>
                      <p className="font-bold text-slate-700">{student.class_days?.join(', ') || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-600 group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Monthly Fee</p>
                    <p className="text-xl font-bold text-emerald-600">${student.monthly_fee}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Records Tabs/Sections */}
        <div className="lg:col-span-2 space-y-10">
          {/* Attendance Summary */}
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">Attendance Progress</h3>
                  <p className="text-xs text-slate-500 font-medium">Current academic cycle tracking</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cycle Progress</span>
                <p className="text-xl font-bold text-emerald-600">{currentCycleAttendance} <span className="text-slate-300 text-sm font-medium">/ {lecturesPerMonth}</span></p>
              </div>
            </div>

            <div className="mb-10">
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 p-1">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                />
              </div>
              <div className="flex justify-between mt-3">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{monthsCompleted} Months Completed</p>
                <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">{lecturesPerMonth - currentCycleAttendance} more to next month</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total Present</p>
                <p className="text-3xl font-bold text-emerald-600 tracking-tight">{totalPresent}</p>
              </div>
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total Absent</p>
                <p className="text-3xl font-bold text-red-600 tracking-tight">{attendance.filter(a => a.status === 'absent').length}</p>
              </div>
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Months Paid</p>
                <p className="text-3xl font-bold text-blue-600 tracking-tight">{fees.filter(f => f.status === 'paid').length}</p>
              </div>
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Lectures Left</p>
                <p className="text-3xl font-bold text-emerald-600 tracking-tight">{lecturesPerMonth - currentCycleAttendance}</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Recent Logs</p>
              {attendance.slice(0, 5).map((record, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 hover:border-emerald-100 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                      record.status === 'present' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                    )}>
                      {record.status === 'present' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">{new Date(record.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{record.status === 'present' ? 'Attended' : 'Missed'}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors",
                    record.status === 'present' ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white" : "bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white"
                  )}>
                    {record.status}
                  </span>
                </div>
              ))}
              {attendance.length === 0 && (
                <div className="text-center py-10 bg-slate-50/30 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-sm text-slate-400 font-medium">No attendance records found.</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Payment History</h3>
                <p className="text-xs text-slate-500 font-medium">Financial transaction logs</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {fees.map((fee, idx) => (
                <div key={idx} className="flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-100 hover:border-blue-100 transition-colors group">
                  <div className="flex items-center gap-5">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110",
                      fee.status === 'paid' ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                    )}>
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-900 tracking-tight">${fee.amount}</p>
                      <p className="text-xs text-slate-400 font-medium">{new Date(fee.payment_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={cn(
                      "px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest",
                      fee.status === 'paid' ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"
                    )}>
                      {fee.status}
                    </span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Confirmed</p>
                  </div>
                </div>
              ))}
              {fees.length === 0 && (
                <div className="text-center py-10 bg-slate-50/30 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-sm text-slate-400 font-medium">No payment records found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
