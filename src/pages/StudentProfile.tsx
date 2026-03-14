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

interface Student {
  id: string;
  name: string;
  class: string;
  phone: string;
  monthly_fee: number;
  lectures_per_month: number;
  join_date: string;
}

export default function StudentProfile() {
  const { id } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we'd have a specific endpoint for student details
    // For now, we'll filter from the general lists or fetch by ID if implemented
    fetch("/api/students")
      .then(res => res.json())
      .then(data => {
        const found = data.find((s: any) => s.id === id);
        setStudent(found);
        setLoading(false);
      });
    
    // Fetch related data (mocked or filtered)
    fetch("/api/attendance").then(res => res.json()).then(data => {
      setAttendance(data.filter((a: any) => a.student_id === id));
    });
    fetch("/api/fees").then(res => res.json()).then(data => {
      setFees(data.filter((f: any) => f.student_id === id));
    });
  }, [id]);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading profile...</div>;
  if (!student) return <div className="p-8 text-center text-red-500">Student not found.</div>;

  const totalPresent = attendance.filter(a => a.status === 'present').length;
  const lecturesPerMonth = student.lectures_per_month || 12;
  const monthsCompleted = Math.floor(totalPresent / lecturesPerMonth);
  const currentCycleAttendance = totalPresent % lecturesPerMonth;
  const progressPercentage = (currentCycleAttendance / lecturesPerMonth) * 100;

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
        <Link to="/students" className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all text-slate-500">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Student Profile</h1>
          <p className="text-slate-500 mt-1">Detailed overview of academic and financial records.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <div className="px-6 pb-6">
              <div className="-mt-12 mb-4">
                <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                  <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-400">
                    {student.name.charAt(0)}
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{student.name}</h2>
              <p className="text-slate-500 font-medium">Class {student.class}</p>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="text-sm">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Phone</p>
                    <p className="font-medium">{student.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="text-sm">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Joined On</p>
                    <p className="font-medium">{new Date(student.join_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="text-sm">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Lectures / Month</p>
                    <p className="font-medium">{student.lectures_per_month || 12} Lectures</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div className="text-sm">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Monthly Fee</p>
                    <p className="font-bold text-emerald-600">${student.monthly_fee}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Records Tabs/Sections */}
        <div className="lg:col-span-2 space-y-8">
          {/* Attendance Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-500" />
                Attendance Progress
              </h3>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cycle Progress</span>
                <p className="text-sm font-bold text-emerald-600">{currentCycleAttendance} / {lecturesPerMonth}</p>
              </div>
            </div>

            <div className="mb-8">
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                />
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-xs text-slate-500 font-medium">{monthsCompleted} Months Completed</p>
                <p className="text-xs text-slate-500 font-medium">{lecturesPerMonth - currentCycleAttendance} more to next month</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Total Present</p>
                <p className="text-2xl font-bold text-emerald-600">{totalPresent}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Total Absent</p>
                <p className="text-2xl font-bold text-red-600">{attendance.filter(a => a.status === 'absent').length}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Months Paid</p>
                <p className="text-2xl font-bold text-blue-600">{fees.filter(f => f.status === 'paid').length}</p>
              </div>
            </div>
            <div className="space-y-3">
              {attendance.slice(0, 5).map((record, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">{new Date(record.date).toLocaleDateString()}</span>
                  </div>
                  <span className={cn(
                    "flex items-center gap-1 text-xs font-bold uppercase tracking-wider",
                    record.status === 'present' ? "text-emerald-600" : "text-red-600"
                  )}>
                    {record.status === 'present' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {record.status}
                  </span>
                </div>
              ))}
              {attendance.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No attendance records found.</p>}
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-500" />
              Payment History
            </h3>
            <div className="space-y-3">
              {fees.map((fee, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      fee.status === 'paid' ? "bg-emerald-100 text-emerald-600" : "bg-orange-100 text-orange-600"
                    )}>
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">${fee.amount}</p>
                      <p className="text-xs text-slate-500">{new Date(fee.payment_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                    fee.status === 'paid' ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"
                  )}>
                    {fee.status}
                  </span>
                </div>
              ))}
              {fees.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No payment records found.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
