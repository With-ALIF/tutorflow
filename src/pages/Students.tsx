import React, { useState, useEffect, useContext } from "react";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  UserPlus,
  Phone,
  BookOpen,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { ToastContext } from "../context/ToastContext";
import { db, auth } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, writeBatch } from "firebase/firestore";
import { cn } from "../lib/utils";

interface Student {
  id: string;
  name: string;
  class: string;
  phone: string;
  subject: string;
  address: string;
  monthly_fee: number;
  lectures_per_month: number;
  lectures_per_week: number;
  class_days: string[];
  join_date: string;
  photo?: string;
}

export default function Students() {
  const { showToast } = useContext(ToastContext);
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<string | null>(null);
  const [newStudent, setNewStudent] = useState({
    name: "",
    class: "",
    phone: "",
    subject: "",
    address: "",
    monthly_fee: 0,
    lectures_per_month: 12,
    lectures_per_week: 3,
    class_days: [],
    join_date: new Date().toISOString().split('T')[0],
    photo: ""
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (isEdit && editingStudent) {
        setEditingStudent({ ...editingStudent, photo: base64String });
      } else {
        setNewStudent({ ...newStudent, photo: base64String });
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      if (!auth.currentUser) return;
      const q = query(collection(db, "students"), where("userId", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const studentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
      setStudents(studentsData);
    } catch (err) {
      console.error("Error fetching students:", err);
      showToast("Failed to fetch students", "error");
      setStudents([]);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, "students"), {
        ...newStudent,
        userId: auth.currentUser.uid,
        created_at: new Date().toISOString()
      });
      setIsModalOpen(false);
      fetchStudents();
      showToast("Student added successfully!");
      setNewStudent({
        name: "",
        class: "",
        phone: "",
        subject: "",
        address: "",
        monthly_fee: 0,
        lectures_per_month: 12,
        lectures_per_week: 3,
        class_days: [],
        join_date: new Date().toISOString().split('T')[0],
        photo: ""
      });
    } catch (err) {
      console.error("Error adding student:", err);
      showToast("Failed to add student", "error");
    }
  };

  const handleEditStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    try {
      const studentRef = doc(db, "students", editingStudent.id);
      await updateDoc(studentRef, { ...editingStudent });
      setIsEditModalOpen(false);
      fetchStudents();
      showToast("Student updated successfully!");
      setEditingStudent(null);
    } catch (err) {
      console.error("Error updating student:", err);
      showToast("Failed to update student", "error");
    }
  };

  const confirmDelete = async (id: string) => {
    try {
      if (!auth.currentUser) return;
      const batch = writeBatch(db);
      
      // Delete student
      batch.delete(doc(db, "students", id));
      
      // Delete associated fees
      const feesQuery = query(collection(db, "fees"), where("userId", "==", auth.currentUser.uid));
      const feesSnapshot = await getDocs(feesQuery);
      feesSnapshot.docs
        .filter(doc => doc.data().student_id === id)
        .forEach((doc) => {
          batch.delete(doc.ref);
        });
      
      await batch.commit();
      
      setIsDeleteModalOpen(null);
      fetchStudents();
      showToast("Student and associated payments deleted successfully!");
    } catch (err) {
      console.error("Error deleting student:", err);
      showToast("Failed to delete student", "error");
    }
  };


  const filteredStudents = Array.isArray(students) ? students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.class.toLowerCase().includes(search.toLowerCase())
  ) : [];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Student Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm md:text-base">Manage your students, their details and academic records.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 w-full md:w-auto"
        >
          <UserPlus className="w-5 h-5" />
          <span>Add New Student</span>
        </button>
      </header>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30 dark:bg-slate-800/30">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by name or class..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all dark:text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            <span>Total: <span className="text-emerald-600 dark:text-emerald-400">{filteredStudents.length}</span> students</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-widest font-bold border-b border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30">
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Phone Number</th>
                <th className="px-6 py-4">Monthly Fee</th>
                <th className="px-6 py-4">Lectures/Month</th>
                <th className="px-6 py-4">Per Lecture</th>
                <th className="px-6 py-4">Join Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <Link to={`/students/${student.id}`} className="flex items-center gap-4">
                      {student.photo ? (
                        <img src={student.photo} alt={student.name} className="w-12 h-12 rounded-2xl object-cover transition-transform group-hover:scale-110" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg transition-transform group-hover:scale-110">
                          {student.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">{student.name}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter">ID: {student.id.slice(0, 8)}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{student.class}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
                        <Phone className="w-4 h-4" />
                      </div>
                      <a 
                        href={`https://wa.me/${student.phone.replace(/[^0-9]/g, '').replace(/^0/, '880')}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        {student.phone}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">${student.monthly_fee}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">{student.lectures_per_month || 12}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">${Math.round(student.monthly_fee / (student.lectures_per_month || 12))}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-medium">
                    {new Date(student.join_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          setEditingStudent({
                            ...student,
                            lectures_per_week: student.lectures_per_week || 3,
                            class_days: student.class_days || []
                          });
                          setIsEditModalOpen(true);
                        }}
                        className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setIsDeleteModalOpen(student.id)}
                        className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
                      <Users className="w-12 h-12 opacity-20" />
                      <p className="text-sm font-medium">No students found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center"
            >
              <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Student</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">Are you sure you want to delete this student? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsDeleteModalOpen(null)}
                  className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => confirmDelete(isDeleteModalOpen)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Student Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center shrink-0">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add New Student</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>
              <form onSubmit={handleAddStudent} className="flex flex-col overflow-hidden">
                <div className="p-6 space-y-4 overflow-y-auto">
                  <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col items-center gap-4 mb-2">
                    {newStudent.photo ? (
                      <img src={newStudent.photo} alt="Preview" className="w-24 h-24 rounded-full object-cover border-4 border-emerald-50 dark:border-emerald-500/20" />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 border-4 border-slate-50 dark:border-slate-800">
                        <Users className="w-8 h-8" />
                      </div>
                    )}
                    <label className="cursor-pointer bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                      Upload Photo
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(e, false)} />
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all dark:text-white"
                      placeholder="Enter student name"
                      value={newStudent.name}
                      onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Class</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all dark:text-white"
                        placeholder="e.g. 10th"
                        value={newStudent.class}
                        onChange={e => setNewStudent({...newStudent, class: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Subject</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. Mathematics"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all dark:text-white"
                        value={newStudent.subject}
                        onChange={e => setNewStudent({...newStudent, subject: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Address</label>
                    <textarea 
                      required
                      rows={2}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all resize-none dark:text-white"
                      placeholder="Enter full address"
                      value={newStudent.address}
                      onChange={e => setNewStudent({...newStudent, address: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Monthly Fee ($)</label>
                      <input 
                        required
                        type="number" 
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all dark:text-white"
                        placeholder="0.00"
                        value={newStudent.monthly_fee}
                        onChange={e => setNewStudent({...newStudent, monthly_fee: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Lectures / Month</label>
                      <input 
                        required
                        type="number" 
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all dark:text-white"
                        placeholder="12"
                        value={newStudent.lectures_per_month}
                        onChange={e => setNewStudent({...newStudent, lectures_per_month: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Lectures / Week</label>
                      <input 
                        required
                        type="number" 
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all dark:text-white"
                        placeholder="3"
                        value={newStudent.lectures_per_week}
                        onChange={e => setNewStudent({...newStudent, lectures_per_week: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Class Days</label>
                      <div className="flex flex-wrap gap-2">
                        {['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              const days = newStudent.class_days.includes(day) 
                                ? newStudent.class_days.filter(d => d !== day)
                                : [...newStudent.class_days, day];
                              setNewStudent({...newStudent, class_days: days});
                            }}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors",
                              newStudent.class_days.includes(day)
                                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                                : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                            )}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                    <input 
                      required
                      type="tel" 
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all dark:text-white"
                      placeholder="+1 (555) 000-0000"
                      value={newStudent.phone}
                      onChange={e => setNewStudent({...newStudent, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Joining Date</label>
                    <input 
                      required
                      type="date" 
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all dark:text-white"
                      value={newStudent.join_date}
                      onChange={e => setNewStudent({...newStudent, join_date: e.target.value})}
                    />
                  </div>
                </div>
                </div>
                <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex gap-3 shrink-0">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    Save Student
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Student Modal */}
      <AnimatePresence>
        {isEditModalOpen && editingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
                <h2 className="text-xl font-bold text-slate-900">Edit Student</h2>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>
              <form onSubmit={handleEditStudent} className="flex flex-col overflow-hidden">
                <div className="p-6 space-y-4 overflow-y-auto">
                  <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col items-center gap-4 mb-2">
                    {editingStudent.photo ? (
                      <img src={editingStudent.photo} alt="Preview" className="w-24 h-24 rounded-full object-cover border-4 border-emerald-50" />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border-4 border-slate-50">
                        <Users className="w-8 h-8" />
                      </div>
                    )}
                    <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                      Upload Photo
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(e, true)} />
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                      value={editingStudent.name}
                      onChange={e => setEditingStudent({...editingStudent, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Class</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                        value={editingStudent.class}
                        onChange={e => setEditingStudent({...editingStudent, class: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Subject</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                        value={editingStudent.subject}
                        onChange={e => setEditingStudent({...editingStudent, subject: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Address</label>
                    <textarea 
                      required
                      rows={2}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all resize-none"
                      value={editingStudent.address}
                      onChange={e => setEditingStudent({...editingStudent, address: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Monthly Fee ($)</label>
                      <input 
                        required
                        type="number" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                        value={editingStudent.monthly_fee}
                        onChange={e => setEditingStudent({...editingStudent, monthly_fee: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Lectures / Month</label>
                      <input 
                        required
                        type="number" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                        value={editingStudent.lectures_per_month}
                        onChange={e => setEditingStudent({...editingStudent, lectures_per_month: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Lectures / Week</label>
                      <input 
                        required
                        type="number" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                        value={editingStudent.lectures_per_week}
                        onChange={e => setEditingStudent({...editingStudent, lectures_per_week: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Class Days</label>
                      <div className="flex flex-wrap gap-2">
                        {['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              const days = editingStudent.class_days?.includes(day) 
                                ? editingStudent.class_days.filter(d => d !== day)
                                : [...(editingStudent.class_days || []), day];
                              setEditingStudent({...editingStudent, class_days: days});
                            }}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors",
                              editingStudent.class_days?.includes(day)
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            )}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                    <input 
                      required
                      type="tel" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                      value={editingStudent.phone}
                      onChange={e => setEditingStudent({...editingStudent, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Joining Date</label>
                    <input 
                      required
                      type="date" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                      value={editingStudent.join_date}
                      onChange={e => setEditingStudent({...editingStudent, join_date: e.target.value})}
                    />
                  </div>
                </div>
                </div>
                <div className="p-6 border-t border-slate-100 flex gap-3 shrink-0">
                  <button 
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                  >
                    Update Student
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
