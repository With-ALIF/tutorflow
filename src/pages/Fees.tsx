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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { ToastContext } from "../context/ToastContext";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc, addDoc, query, orderBy } from "firebase/firestore";

interface FeeRecord {
  id: string;
  student_id: string;
  amount: number;
  payment_date: string;
  fee_month: string;
  status: 'paid' | 'due';
  students?: {
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
    fee_month: new Date().toISOString().slice(0, 7), // YYYY-MM format
    status: 'paid' as 'paid' | 'due'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const studentsSnapshot = await getDocs(collection(db, "students"));
      const studentsData = studentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
      setStudents(studentsData);

      const feesQuery = query(collection(db, "fees"), orderBy("payment_date", "desc"));
      const feesSnapshot = await getDocs(feesQuery);
      const feesData = feesSnapshot.docs.map(doc => {
        const data = doc.data();
        const student = studentsData.find(s => s.id === data.student_id);
        return {
          id: doc.id,
          ...data,
          students: student ? { name: student.name } : { name: "Unknown" }
        } as FeeRecord;
      });

      setFees(feesData);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      showToast("Failed to fetch data", "error");
      setFees([]);
      setStudents([]);
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    try {
      const feeRef = doc(db, "fees", id);
      await updateDoc(feeRef, {
        status: 'paid',
        payment_date: new Date().toISOString().split('T')[0]
      });
      
      fetchData();
      showToast("Fee marked as paid!");
    } catch (err: any) {
      console.error("Error updating fee status:", err);
      showToast("Failed to update fee status", "error");
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Payment History", 14, 15);
    autoTable(doc, {
      head: [['Student', 'Fee Month', 'Amount', 'Date', 'Status']],
      body: fees.map(fee => [
        fee.students?.name || 'Unknown',
        fee.fee_month ? new Date(fee.fee_month + '-01').toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'N/A',
        `$${fee.amount}`,
        new Date(fee.payment_date).toLocaleDateString(),
        fee.status
      ]),
      startY: 20
    });
    doc.save("payment_history.pdf");
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "fees"), {
        ...newPayment,
        created_at: new Date().toISOString()
      });
      
      setIsModalOpen(false);
      fetchData();
      showToast("Payment recorded successfully!");
      setNewPayment({
        student_id: "",
        amount: 0,
        payment_date: new Date().toISOString().split('T')[0],
        fee_month: new Date().toISOString().slice(0, 7),
        status: 'paid'
      });
    } catch (err: any) {
      console.error("Error recording payment:", err);
      showToast("Failed to record payment", "error");
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading records...</div>;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Tuition Fees</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm md:text-base">Track payments, manage dues and generate financial reports.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 w-full md:w-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Record Payment</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-9 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search payments..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="flex gap-2">
                <button className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
                  <Filter className="w-4 h-4" />
                </button>
                <button onClick={downloadPDF} className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-400 text-[11px] uppercase tracking-widest font-bold border-b border-slate-100 bg-slate-50/30">
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Fee Month</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {fees.map((fee) => (
                    <tr key={fee.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{fee.students.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-700">
                          {fee.fee_month ? new Date(fee.fee_month + '-01').toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono font-bold text-slate-700">${fee.amount}</span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500">
                        {new Date(fee.payment_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          fee.status === 'paid' ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"
                        )}>
                          {fee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {fee.status === 'due' && (
                          <button 
                            onClick={() => handleMarkAsPaid(fee.id)}
                            className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-bold transition-colors"
                          >
                            Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {fees.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                          <CreditCard className="w-12 h-12 opacity-20" />
                          <p className="text-sm font-medium">No payment records found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-700" />
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">Financial Summary</h3>
            <div className="space-y-6">
              <div className="relative">
                <p className="text-xs text-slate-500 font-medium mb-1">Total Collected</p>
                <p className="text-3xl font-bold text-emerald-600 tracking-tight">
                  ${fees.filter(f => f.status === 'paid').reduce((acc, f) => acc + Number(f.amount), 0).toLocaleString()}
                </p>
                <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-full" />
                </div>
              </div>
              <div className="relative">
                <p className="text-xs text-slate-500 font-medium mb-1">Total Outstanding</p>
                <p className="text-3xl font-bold text-orange-600 tracking-tight">
                  ${fees.filter(f => f.status === 'due').reduce((acc, f) => acc + Number(f.amount), 0).toLocaleString()}
                </p>
                <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-[30%]" />
                </div>
              </div>
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
              <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
                <h2 className="text-xl font-bold text-slate-900">Record Payment</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>
              <form onSubmit={handleAddPayment} className="flex flex-col overflow-hidden">
                <div className="p-6 space-y-4 overflow-y-auto">
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
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Fee Month</label>
                  <input 
                    required
                    type="month" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                    value={newPayment.fee_month}
                    onChange={e => setNewPayment({...newPayment, fee_month: e.target.value})}
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
                </div>
                <div className="p-6 border-t border-slate-100 flex gap-3 shrink-0">
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
