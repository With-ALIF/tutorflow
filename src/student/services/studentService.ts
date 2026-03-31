// src/student/services/studentService.ts
import { Student } from "../types";

export const fetchStudent = async (id: string): Promise<Student> => {
  // Mock implementation
  return {
    id,
    name: "John Doe",
    class: "10th Grade",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    address: "123 Main St, Springfield",
    attendanceRate: 92,
    dueFees: 150,
  };
};
