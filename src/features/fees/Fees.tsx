import React from "react";
import { useFees } from "@/src/features/fees/hooks/useFees";
import { FeesHeader } from "./components/FeesHeader";
import { FeesTable } from "./components/FeesTable";
import { SummaryCard } from "./components/SummaryCard";
import { PaymentModal } from "./components/PaymentModal";

export const Fees: React.FC = () => {
  const {
    fees,
    students,
    isModalOpen,
    setIsModalOpen,
    loading,
    newPayment,
    setNewPayment,
    handleMarkAsPaid,
    handleMarkAsUnpaid,
    handleDownloadPDF,
    handleAddPayment,
    sortConfig,
    requestSort,
    searchTerm,
    setSearchTerm
  } = useFees();

  if (loading) return <div className="p-8 text-center text-slate-500">Loading records...</div>;

  return (
    <div className="space-y-4">
      <FeesHeader onRecordPayment={() => setIsModalOpen(true)} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-9 space-y-4">
          <FeesTable 
            fees={fees} 
            onDownloadPDF={handleDownloadPDF} 
            onMarkAsPaid={handleMarkAsPaid} 
            onMarkAsUnpaid={handleMarkAsUnpaid}
            onSort={requestSort}
            sortConfig={sortConfig}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>

        <div className="lg:col-span-3 space-y-4">
          <SummaryCard fees={fees} />
        </div>
      </div>

      <PaymentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        students={students}
        newPayment={newPayment}
        setNewPayment={setNewPayment}
        onSubmit={handleAddPayment}
      />
    </div>
  );
};

export default Fees;
