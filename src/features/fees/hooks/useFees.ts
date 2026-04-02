import React, { useState, useEffect, useContext } from "react";
import { ToastContext } from "../../../context/ToastContext";
import { fetchStudents, fetchFees, markFeeAsPaid, addPayment, FeeRecord, Student } from "../services/feeService";
import { downloadPDF } from "../utils/feeUtils";

export const useFees = () => {
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
      const studentsData = await fetchStudents();
      setStudents(studentsData);

      const feesData = await fetchFees(studentsData);
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
      await markFeeAsPaid(id);
      fetchData();
      showToast("Fee marked as paid!");
    } catch (err: any) {
      console.error("Error updating fee status:", err);
      showToast("Failed to update fee status", "error");
    }
  };

  const handleDownloadPDF = () => {
    downloadPDF(fees);
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addPayment(newPayment);
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

  return {
    fees,
    students,
    isModalOpen,
    setIsModalOpen,
    loading,
    newPayment,
    setNewPayment,
    handleMarkAsPaid,
    handleDownloadPDF,
    handleAddPayment
  };
};
