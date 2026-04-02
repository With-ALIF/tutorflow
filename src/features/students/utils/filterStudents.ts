import { Student } from "../types/student.types";

export const filterStudents = (students: Student[], search: string): Student[] => {
  if (!Array.isArray(students)) return [];
  const query = search.toLowerCase();
  return students.filter(s => 
    s.name.toLowerCase().includes(query) ||
    s.class.toLowerCase().includes(query)
  );
};
