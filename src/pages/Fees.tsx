import React, { useState, useEffect, useContext } from "react";
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download,
  Plus,
  CheckCircle2,
  Clock,
  Send
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { ToastContext } from "../context/ToastContext";

interface FeeRecord {
  id: string;
  student_id: string;
  amount: number;
  payment_date: string;
  status: 'paid' | 'due';
  students: {
    name: string;
  };
}

interface Student {
  id: string;
  name: string;
  monthly_fee: number;
  phone: string;
}

export default function Fees() {
  const { showToast } = useContext(ToastContext);
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newPayment, setNewPayment] = useState({
    student_id: "",
    amount: 0,
    payment_date: new Date().toISOString().split('T')[0],
    status: 'paid' as 'paid' | 'due'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [feesRes, studentsRes] = await Promise.all([
        fetch("/api/fees"),
        fetch("/api/students")
      ]);
      
      if (!feesRes.ok) throw feesRes;
      if (!studentsRes.ok) throw studentsRes;
      
      const feesData = await feesRes.json();
      const studentsData = await studentsRes.json();
      
      setFees(Array.isArray(feesData) ? feesData : []);
      setStudents(Array.isArray(studentsData) ? studentsData : []);
      setLoading(false);
    } catch (err: any) {
      const errorData = await err.json().catch(() => ({ error: "Failed to fetch data" }));
      showToast(errorData.error || "Failed to fetch data", "error");
      setFees([]);
      setStudents([]);
      setLoading(false);
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPayment)
      });
      
      if (!res.ok) throw res;
      
      setIsModalOpen(false);
      fetchData();
      showToast("Payment recorded successfully!");
      setNewPayment({
        student_id: "",
        amount: 0,
        payment_date: new Date().toISOString().split('T')[0],
        status: 'paid'
      });
    } catch (err: any) {
      const errorData = await err.json().catch(() => ({ error: "Failed to record payment" }));
      showToast(errorData.error || "Failed to record payment", "error");
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading records...</div>;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Tuition Fees</h1>
          <p className="text-slate-500 mt-1">Track payments, manage dues and generate financial reports.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-5 h-5" />
          <span>Record Payment</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm md:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search payments..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div className="flex gap-2">
              <button className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50">
                <Filter className="w-4 h-4" />
              </button>
              <button className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-500 text-[10px] uppercase tracking-widest font-bold border-b border-slate-100">
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {fees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-4">
                      <p className="text-sm font-semibold text-slate-900">{fee.students.name}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-mono font-bold text-slate-700">${fee.amount}</span>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">
                      {new Date(fee.payment_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter",
                        fee.status === 'paid' ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"
                      )}>
                        {fee.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500">Total Collected</p>
                <p className="text-2xl font-bold text-emerald-400">
                  ${fees.filter(f => f.status === 'paid').reduce((acc, f) => acc + Number(f.amount), 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Total Outstanding</p>
                <p className="text-2xl font-bold text-orange-400">
                  ${fees.filter(f => f.status === 'due').reduce((acc, f) => acc + Number(f.amount), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Payment Methods</h3>
            <div className="space-y-3">
              {['Cash', 'Bank Transfer', 'Mobile Pay'].map(method => (
                <div key={method} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{method}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Record Payment Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">Record Payment</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>
              <form onSubmit={handleAddPayment} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Select Student</label>
                  <select 
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                    value={newPayment.student_id}
                    onChange={e => {
                      const student = students.find(s => s.id === e.target.value);
                      setNewPayment({
                        ...newPayment, 
                        student_id: e.target.value,
                        amount: student?.monthly_fee || 0
                      });
                    }}
                  >
                    <option value="">Choose a student...</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.class})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Amount ($)</label>
                  <input 
                    required
                    type="number" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                    value={newPayment.amount}
                    onChange={e => setNewPayment({...newPayment, amount: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Payment Date</label>
                  <input 
                    required
                    type="date" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                    value={newPayment.payment_date}
                    onChange={e => setNewPayment({...newPayment, payment_date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="status" 
                        checked={newPayment.status === 'paid'}
                        onChange={() => setNewPayment({...newPayment, status: 'paid'})}
                      />
                      <span className="text-sm font-medium">Paid</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="status" 
                        checked={newPayment.status === 'due'}
                        onChange={() => setNewPayment({...newPayment, status: 'due'})}
                      />
                      <span className="text-sm font-medium">Due</span>
                    </label>
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    Save Payment
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
