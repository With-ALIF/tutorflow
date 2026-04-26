import React, { useState, useEffect, useContext } from "react";
import { ToastContext } from "../../../context/ToastContext";
import { fetchStudents, fetchFees, markFeeAsPaid, markFeeAsUnpaid, addPayment } from "../services/feeService";
import { Student, FeeRecord } from "../types/fee.types";
import { downloadPDF } from "../utils/feeUtils";

export const useFees = () => {
  const { showToast } = useContext(ToastContext);
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof FeeRecord | 'amount'; direction: 'asc' | 'desc' } | null>(null);
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

  const handleMarkAsUnpaid = async (id: string) => {
    try {
      await markFeeAsUnpaid(id);
      fetchData();
      showToast("Fee marked as unpaid and closed.");
    } catch (err: any) {
      console.error("Error updating fee status:", err);
      showToast("Failed to update fee status", "error");
    }
  };

  const handleDownloadPDF = () => {
    downloadPDF(filteredAndSortedFees);
  };

  const requestSort = (key: keyof FeeRecord | 'amount') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedFees = React.useMemo(() => {
    let result = [...fees];

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(fee => {
        const studentName = fee.students?.name?.toLowerCase() || "";
        const feeMonth = fee.fee_month?.toLowerCase() || "";
        const status = fee.status?.toLowerCase() || "";
        const amount = fee.amount?.toString() || "";
        const paymentDate = new Date(fee.payment_date).toLocaleDateString().toLowerCase();
        const monthName = fee.fee_month ? new Date(fee.fee_month + '-01').toLocaleDateString(undefined, { month: 'long' }).toLowerCase() : "";

        return studentName.includes(term) || 
               feeMonth.includes(term) || 
               status.includes(term) || 
               amount.includes(term) || 
               paymentDate.includes(term) ||
               monthName.includes(term);
      });
    }

    if (sortConfig !== null) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return result;
  }, [fees, sortConfig, searchTerm]);

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
    fees: filteredAndSortedFees,
    sortConfig,
    requestSort,
    searchTerm,
    setSearchTerm,
    students,
    isModalOpen,
    setIsModalOpen,
    loading,
    newPayment,
    setNewPayment,
    handleMarkAsPaid,
    handleMarkAsUnpaid,
    handleDownloadPDF,
    handleAddPayment
  };
};
