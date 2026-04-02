import React, { useState, useMemo } from "react";
import { useStudents } from "@/src/features/students/hooks/useStudents";
import { filterStudents } from "./utils/filterStudents";
import { StudentsHeader } from "./components/StudentsHeader";
import { StudentsTable } from "./components/StudentsTable";
import { AddStudentModal } from "./components/AddStudentModal";
import { EditStudentModal } from "./components/EditStudentModal";
import { DeleteModal } from "./components/DeleteModal";
import { Student } from "./types/student.types";

export const Students: React.FC = () => {
  const { students, loading, addStudent, updateStudent, deleteStudent } = useStudents();
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

  const filteredStudents = useMemo(() => 
    filterStudents(students, search), 
    [students, search]
  );

  const handleEditClick = (student: Student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setStudentToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (studentToDelete) {
      await deleteStudent(studentToDelete);
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
    }
  };

  if (loading && students.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <StudentsHeader onAddClick={() => setIsAddModalOpen(true)} />
      
      <StudentsTable 
        students={filteredStudents}
        search={search}
        onSearchChange={setSearch}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <AddStudentModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={addStudent}
      />

      <EditStudentModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={updateStudent}
        student={selectedStudent}
      />

      <DeleteModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};
