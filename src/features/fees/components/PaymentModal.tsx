import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";
import { Student } from "../types/fee.types";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  newPayment: {
    student_id: string;
    amount: number;
    payment_date: string;
    fee_month: string;
    status: 'paid' | 'due';
  };
  setNewPayment: (payment: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  students,
  newPayment,
  setNewPayment,
  onSubmit
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Record Payment</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <form onSubmit={onSubmit} className="flex flex-col overflow-hidden">
              <div className="p-6 space-y-4 overflow-y-auto">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Student</label>
                  <select 
                    required
                    className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none dark:text-white"
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
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Amount ($)</label>
                  <input 
                    required
                    type="number" 
                    className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none dark:text-white"
                    value={newPayment.amount}
                    onChange={e => setNewPayment({...newPayment, amount: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Fee Month</label>
                  <input 
                    required
                    type="month" 
                    className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none dark:text-white"
                    value={newPayment.fee_month}
                    onChange={e => setNewPayment({...newPayment, fee_month: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Payment Date</label>
                  <input 
                    required
                    type="date" 
                    className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none dark:text-white"
                    value={newPayment.payment_date}
                    onChange={e => setNewPayment({...newPayment, payment_date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="status" 
                        checked={newPayment.status === 'paid'}
                        onChange={() => setNewPayment({...newPayment, status: 'paid'})}
                        className="accent-emerald-600"
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Paid</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="status" 
                        checked={newPayment.status === 'due'}
                        onChange={() => setNewPayment({...newPayment, status: 'due'})}
                        className="accent-emerald-600"
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Due</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex gap-3 shrink-0">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
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
  );
};
