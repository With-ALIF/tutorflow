import React, { useState, useEffect, useContext } from "react";
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Save,
  ChevronLeft,
  ChevronRight,
  History,
  UserCheck,
  Search,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { format, parseISO } from "date-fns";
import { cn } from "../lib/utils";
import { ToastContext } from "../context/ToastContext";
import { db } from "../firebase";
import { collection, getDocs, query, where, orderBy, doc, setDoc, getDoc, addDoc, getCountFromServer } from "firebase/firestore";

interface Student {
  id: string;
  name: string;
  class: string;
  phone: string;
  monthly_fee?: number;
  lectures_per_month?: number;
  photo?: string;
}

interface AttendanceRecord {
  id: string;
  student_id: string;
  date: string;
  status: 'present' | 'absent';
  created_at: string;
}

export default function Attendance() {
  const { showToast } = useContext(ToastContext);
  const [activeTab, setActiveTab] = useState<'mark' | 'history'>('mark');
  const [students, setStudents] = useState<Student[]>([]);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [records, setRecords] = useState<Record<string, 'present' | 'absent'>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // History state
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [studentHistory, setStudentHistory] = useState<AttendanceRecord[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [fetchingHistory, setFetchingHistory] = useState(false);

  useEffect(() => {
    setSelectedMonth("");
  }, [selectedStudentId]);

  useEffect(() => {
    if (studentHistory.length > 0 && !selectedMonth) {
      const grouped = studentHistory.reduce((acc, record) => {
        const month = format(parseISO(record.date), "MMMM yyyy");
        if (!acc[month]) acc[month] = [];
        acc[month].push(record);
        return acc;
      }, {} as Record<string, AttendanceRecord[]>);
      setSelectedMonth(Object.keys(grouped)[0]);
    }
  }, [studentHistory]);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (activeTab === 'mark') {
      fetchDailyAttendance();
    }
  }, [date, activeTab]);

  useEffect(() => {
    if (activeTab === 'history' && selectedStudentId) {
      fetchStudentHistory();
    }
  }, [selectedStudentId, activeTab]);

  const fetchStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "students"));
      const studentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
      setStudents(studentsData.sort((a, b) => a.name.localeCompare(b.name)));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching students:", err);
      showToast("Failed to fetch students", "error");
      setLoading(false);
    }
  };

  const fetchDailyAttendance = async () => {
    try {
      const q = query(collection(db, "attendance"), where("date", "==", date));
      const querySnapshot = await getDocs(q);
      const initialRecords: Record<string, 'present' | 'absent'> = {};
      querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        initialRecords[data.student_id] = data.status;
      });
      setRecords(initialRecords);
    } catch (err) {
      console.error("Error fetching daily attendance:", err);
      showToast("Failed to fetch attendance", "error");
    }
  };

  const fetchStudentHistory = async () => {
    setFetchingHistory(true);
    try {
      const q = query(collection(db, "attendance"), where("student_id", "==", selectedStudentId), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const historyData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AttendanceRecord));
      setStudentHistory(historyData);
    } catch (err) {
      console.error("Error fetching student history:", err);
      showToast("Failed to fetch history", "error");
    } finally {
      setFetchingHistory(false);
    }
  };

  const handleStatusChange = (studentId: string, status: 'present' | 'absent') => {
    setRecords(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [studentId, status] of Object.entries(records)) {
        const attendanceId = `${studentId}_${date}`;
        const attendanceRef = doc(db, "attendance", attendanceId);
        await setDoc(attendanceRef, {
          student_id: studentId,
          date,
          status,
          created_at: new Date().toISOString()
        }, { merge: true });

        // Auto-generate fee logic
        if (status === 'present') {
          const student = students.find(s => s.id === studentId);
          if (student) {
            const lecturesPerMonth = student.lectures_per_month || 12;
            const q = query(collection(db, "attendance"), where("student_id", "==", studentId), where("status", "==", "present"));
            const snapshot = await getCountFromServer(q);
            const count = snapshot.data().count;

            if (count > 0 && count % lecturesPerMonth === 0) {
              const currentMonth = new Date().toISOString().slice(0, 7);
              const feeQ = query(collection(db, "fees"), where("student_id", "==", studentId), where("fee_month", "==", currentMonth));
              const feeSnapshot = await getDocs(feeQ);
              
              if (feeSnapshot.empty) {
                await addDoc(collection(db, "fees"), {
                  student_id: studentId,
                  amount: student.monthly_fee || 0,
                  payment_date: new Date().toISOString().split('T')[0],
                  fee_month: currentMonth,
                  status: 'due',
                  created_at: new Date().toISOString()
                });
              }
            }
          }
        }
      }
      
      showToast("Attendance saved successfully!");
    } catch (err: any) {
      console.error("Error saving attendance:", err);
      showToast(err.message || "Failed to save attendance", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Attendance Management</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm md:text-base">Mark daily presence or view student attendance history.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('mark')}
            className={cn(
              "flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex-1 sm:flex-none",
              activeTab === 'mark' ? "bg-white text-emerald-600 shadow-md" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <UserCheck className="w-4 h-4" />
            <span>Mark Daily</span>
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={cn(
              "flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex-1 sm:flex-none",
              activeTab === 'history' ? "bg-white text-emerald-600 shadow-md" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <History className="w-4 h-4" />
            <span>History</span>
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'mark' ? (
          <motion.div 
            key="mark"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-slate-200/60 shadow-sm">
                <button 
                  onClick={() => {
                    const d = new Date(date);
                    d.setDate(d.getDate() - 1);
                    setDate(format(d, "yyyy-MM-dd"));
                  }}
                  className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors active:scale-90"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 px-4 border-x border-slate-100">
                  <Calendar className="w-5 h-5 text-emerald-500" />
                  <input 
                    type="date" 
                    className="font-bold text-slate-700 focus:outline-none bg-transparent"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => {
                    const d = new Date(date);
                    d.setDate(d.getDate() + 1);
                    setDate(format(d, "yyyy-MM-dd"));
                  }}
                  className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors active:scale-90"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-slate-400 text-[11px] uppercase tracking-widest font-bold border-b border-slate-100 bg-slate-50/30">
                      <th className="px-8 py-5">Student</th>
                      <th className="px-8 py-5">Class</th>
                      <th className="px-8 py-5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/30 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            {student.photo ? (
                              <img src={student.photo} alt={student.name} className="w-10 h-10 rounded-xl object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                {student.name.charAt(0)}
                              </div>
                            )}
                            <span className="font-bold text-slate-900">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-widest">{student.class}</span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center justify-center gap-2 sm:gap-4">
                            <button 
                              onClick={() => handleStatusChange(student.id, 'present')}
                              className={cn(
                                "flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2.5 rounded-2xl text-[10px] sm:text-xs font-bold transition-all border-2",
                                records[student.id] === 'present'
                                  ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30 scale-105"
                                  : "bg-white text-slate-400 border-slate-100 hover:border-emerald-200 hover:text-emerald-600 active:scale-95"
                              )}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Present</span>
                            </button>
                            <button 
                              onClick={() => handleStatusChange(student.id, 'absent')}
                              className={cn(
                                "flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2.5 rounded-2xl text-[10px] sm:text-xs font-bold transition-all border-2",
                                records[student.id] === 'absent'
                                  ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/30 scale-105"
                                  : "bg-white text-slate-400 border-slate-100 hover:border-red-200 hover:text-red-600 active:scale-95"
                              )}
                            >
                              <XCircle className="w-4 h-4" />
                              <span>Absent</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all disabled:opacity-50 shadow-xl active:scale-95"
                >
                  <Save className="w-5 h-5" />
                  {saving ? "Saving..." : "Save Attendance"}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-10"
          >
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Search className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Select Student</h2>
                </div>
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {students.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => setSelectedStudentId(student.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left group",
                        selectedStudentId === student.id
                          ? "bg-emerald-50 border-emerald-500 shadow-sm"
                          : "bg-white border-slate-50 hover:border-emerald-100 hover:bg-slate-50/50"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-colors",
                          selectedStudentId === student.id ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600"
                        )}>
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className={cn("text-sm font-bold transition-colors", selectedStudentId === student.id ? "text-emerald-900" : "text-slate-900 group-hover:text-emerald-600")}>
                            {student.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{student.class}</p>
                        </div>
                      </div>
                      <ArrowRight className={cn("w-4 h-4 transition-all", selectedStudentId === student.id ? "text-emerald-500 translate-x-1" : "text-slate-200 opacity-0 group-hover:opacity-100 group-hover:translate-x-1")} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              {selectedStudentId ? (
                <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col h-full">
                  <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-2xl font-bold text-emerald-500 shadow-sm">
                        {students.find(s => s.id === selectedStudentId)?.name.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                          {students.find(s => s.id === selectedStudentId)?.name}
                        </h2>
                        {(() => {
                          const student = students.find(s => s.id === selectedStudentId);
                          const lecturesPerMonth = student?.lectures_per_month || 0;
                          const presentCount = studentHistory.filter(h => h.status === 'present').length;
                          const months = lecturesPerMonth > 0 ? Math.floor(presentCount / lecturesPerMonth) : 0;
                          const days = lecturesPerMonth > 0 ? presentCount % lecturesPerMonth : presentCount;
                          return (
                            <p className="text-sm font-bold text-emerald-600 mt-1">
                              {months} মাস {days.toString().padStart(2, '0')} দিন
                            </p>
                          );
                        })()}
                        <p className="text-xs text-slate-500 font-medium">Detailed attendance logs and statistics.</p>
                      </div>
                    </div>
                    <div className="text-right flex gap-6">
                      {(() => {
                        const student = students.find(s => s.id === selectedStudentId);
                        const lecturesPerMonth = student?.lectures_per_month || 0;
                        const presentCount = studentHistory.filter(h => h.status === 'present').length;
                        const absentCount = studentHistory.filter(h => h.status === 'absent').length;
                        return (
                          <>
                            <div>
                              <div className="text-3xl font-black text-emerald-600 tracking-tighter">
                                {presentCount} {lecturesPerMonth > 0 && <span className="text-sm text-slate-400 font-medium">/ {lecturesPerMonth}</span>}
                              </div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Present</div>
                            </div>
                            <div>
                              <div className="text-3xl font-black text-red-600 tracking-tighter">
                                {absentCount} {lecturesPerMonth > 0 && <span className="text-sm text-slate-400 font-medium">/ {lecturesPerMonth}</span>}
                              </div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Absent</div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                    <div className="flex-1 flex flex-col h-full overflow-hidden">
                      {fetchingHistory ? (
                        <div className="flex items-center justify-center h-60">
                          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : studentHistory.length > 0 ? (
                        (() => {
                          const grouped = studentHistory.reduce((acc, record) => {
                            const month = format(parseISO(record.date), "MMMM yyyy");
                            if (!acc[month]) acc[month] = [];
                            acc[month].push(record);
                            return acc;
                          }, {} as Record<string, AttendanceRecord[]>);
                          
                          const months = Object.keys(grouped);

                          return (
                            <>
                              <div className="flex gap-2 p-4 border-b border-slate-100 overflow-x-auto">
                                {months.map(month => (
                                  <button
                                    key={month}
                                    onClick={() => setSelectedMonth(month)}
                                    className={cn(
                                      "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all",
                                      selectedMonth === month 
                                        ? "bg-emerald-500 text-white shadow-md" 
                                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                    )}
                                  >
                                    {month}
                                  </button>
                                ))}
                              </div>
                              <div className="flex-1 overflow-y-auto p-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                  {grouped[selectedMonth]?.map((record) => (
                                    <div 
                                      key={record.id} 
                                      className={cn(
                                        "flex items-center justify-between p-5 rounded-2xl border-2 transition-all hover:scale-[1.02]",
                                        record.status === 'present' 
                                          ? "bg-emerald-50/30 border-emerald-100/50" 
                                          : "bg-red-50/30 border-red-100/50"
                                      )}
                                    >
                                      <div className="flex items-center gap-4">
                                        <div className={cn(
                                          "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm",
                                          record.status === 'present' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                                        )}>
                                          {record.status === 'present' ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                                        </div>
                                        <div>
                                          <p className="text-sm font-bold text-slate-900">
                                            {format(parseISO(record.date), "MMMM d, yyyy")}
                                          </p>
                                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                            {format(parseISO(record.date), "EEEE")}
                                          </p>
                                        </div>
                                      </div>
                                      <span className={cn(
                                        "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                                        record.status === 'present' ? "text-emerald-600" : "text-red-600"
                                      )}>
                                        {record.status}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          );
                        })()
                      ) : (
                        <div className="flex flex-col items-center justify-center h-80 text-slate-400">
                          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <Calendar className="w-10 h-10 opacity-20" />
                          </div>
                          <p className="text-sm font-bold uppercase tracking-widest">No records found</p>
                        </div>
                      )}
                    </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border-2 border-slate-100 border-dashed h-full flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8">
                    <UserCheck className="w-12 h-12 text-slate-200" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">No Student Selected</h3>
                  <p className="text-slate-500 max-w-xs mx-auto text-sm font-medium leading-relaxed">
                    Select a student from the list on the left to view their detailed attendance history and statistics.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
