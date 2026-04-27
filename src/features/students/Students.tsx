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
  const [showFinished, setShowFinished] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

  const filteredStudents = useMemo(() => 
    filterStudents(students.filter(s => showFinished ? true : s.status !== 'finished'), search), 
    [students, search, showFinished]
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-2 space-y-4">
      <StudentsHeader onAddClick={() => setIsAddModalOpen(true)} />
      
      <div className="flex items-center justify-end gap-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
          <input 
            type="checkbox" 
            checked={showFinished} 
            onChange={e => setShowFinished(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
         Course completed student list
        </label>
      </div>

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
