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

interface Student {
  id: string;
  name: string;
  class: string;
  phone: string;
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
  const [fetchingHistory, setFetchingHistory] = useState(false);

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
      const res = await fetch("/api/students");
      if (!res.ok) throw res;
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      showToast("Failed to fetch students", "error");
      setLoading(false);
    }
  };

  const fetchDailyAttendance = async () => {
    try {
      const res = await fetch(`/api/attendance?date=${date}`);
      if (!res.ok) throw res;
      const data = await res.json();
      const initialRecords: Record<string, 'present' | 'absent'> = {};
      if (Array.isArray(data)) {
        data.forEach((rec: any) => {
          initialRecords[rec.student_id] = rec.status;
        });
      }
      setRecords(initialRecords);
    } catch (err) {
      showToast("Failed to fetch attendance", "error");
    }
  };

  const fetchStudentHistory = async () => {
    setFetchingHistory(true);
    try {
      const res = await fetch(`/api/attendance?student_id=${selectedStudentId}`);
      if (!res.ok) throw res;
      const data = await res.json();
      setStudentHistory(Array.isArray(data) ? data : []);
    } catch (err) {
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
    const payload = Object.entries(records).map(([studentId, status]) => ({
      student_id: studentId,
      date,
      status
    }));

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw res;
      
      showToast("Attendance saved successfully!");
    } catch (err: any) {
      const errorData = await err.json().catch(() => ({ error: "Failed to save attendance" }));
      showToast(errorData.error || "Failed to save attendance", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Attendance Management</h1>
          <p className="text-slate-500 mt-1">Mark daily presence or view student attendance history.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button 
            onClick={() => setActiveTab('mark')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'mark' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <UserCheck className="w-4 h-4" />
            <span>Mark Daily</span>
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'history' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
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
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                <button 
                  onClick={() => {
                    const d = new Date(date);
                    d.setDate(d.getDate() - 1);
                    setDate(format(d, "yyyy-MM-dd"));
                  }}
                  className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 px-3">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <input 
                    type="date" 
                    className="font-semibold text-slate-700 focus:outline-none"
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
                  className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                      <th className="px-6 py-4">Student</th>
                      <th className="px-6 py-4">Class</th>
                      <th className="px-6 py-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                              {student.name.charAt(0)}
                            </div>
                            <span className="font-medium text-slate-900">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-sm">{student.class}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-4">
                            <button 
                              onClick={() => handleStatusChange(student.id, 'present')}
                              className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border",
                                records[student.id] === 'present'
                                  ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20"
                                  : "bg-white text-slate-400 border-slate-200 hover:border-emerald-500 hover:text-emerald-500"
                              )}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Present</span>
                            </button>
                            <button 
                              onClick={() => handleStatusChange(student.id, 'absent')}
                              className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border",
                                records[student.id] === 'absent'
                                  ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20"
                                  : "bg-white text-slate-400 border-slate-200 hover:border-red-500 hover:text-red-500"
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
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-emerald-600" />
                  Select Student
                </h2>
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {students.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => setSelectedStudentId(student.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left",
                        selectedStudentId === student.id
                          ? "bg-emerald-50 border-emerald-200 ring-1 ring-emerald-200"
                          : "bg-white border-slate-100 hover:border-emerald-200 hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                          selectedStudentId === student.id ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600"
                        )}>
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className={cn("text-sm font-bold", selectedStudentId === student.id ? "text-emerald-900" : "text-slate-900")}>
                            {student.name}
                          </p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">{student.class}</p>
                        </div>
                      </div>
                      <ArrowRight className={cn("w-4 h-4 transition-transform", selectedStudentId === student.id ? "text-emerald-500 translate-x-1" : "text-slate-300")} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              {selectedStudentId ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                  <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {students.find(s => s.id === selectedStudentId)?.name}'s History
                      </h2>
                      <p className="text-sm text-slate-500">Detailed attendance logs and statistics.</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-emerald-600">
                        {studentHistory.filter(h => h.status === 'present').length}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Present</div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6">
                    {fetchingHistory ? (
                      <div className="flex items-center justify-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                      </div>
                    ) : studentHistory.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {studentHistory.map((record) => (
                          <div 
                            key={record.id} 
                            className={cn(
                              "flex items-center justify-between p-4 rounded-2xl border transition-all",
                              record.status === 'present' 
                                ? "bg-emerald-50/30 border-emerald-100" 
                                : "bg-red-50/30 border-red-100"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center",
                                record.status === 'present' ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                              )}>
                                {record.status === 'present' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900">
                                  {format(parseISO(record.date), "MMMM d, yyyy")}
                                </p>
                                <p className="text-[10px] text-slate-500 font-medium">
                                  {format(parseISO(record.date), "EEEE")}
                                </p>
                              </div>
                            </div>
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                              record.status === 'present' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                            )}>
                              {record.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-60 text-slate-400">
                        <Calendar className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-sm font-medium">No attendance records found for this student.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 border-dashed h-full flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <UserCheck className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No Student Selected</h3>
                  <p className="text-slate-500 max-w-xs mx-auto text-sm">
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
