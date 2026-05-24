import React, { useState } from 'react';
import { 
  Plus, Edit, Trash2, Search, Filter, Printer, 
  X, Mail, Phone, MapPin, UserCheck, Eye, CreditCard
} from 'lucide-react';
import { Student } from '../types';

interface StudentModuleProps {
  students: Student[];
  onAddStudent: (stud: Student) => void;
  onEditStudent: (stud: Student) => void;
  onDeleteStudent: (id: string) => void;
  accentColor: string;
}

export const StudentModule: React.FC<StudentModuleProps> = ({
  students,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  accentColor
}) => {
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // ID Card printer popup state
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [selectedIDStudent, setSelectedIDStudent] = useState<Student | null>(null);

  // Student Profile details view modal state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedProfileStudent, setSelectedProfileStudent] = useState<Student | null>(null);

  // Creation form state
  const [formData, setFormData] = useState({
    name: '',
    className: 'Grade 10',
    section: 'A',
    parentName: '',
    phone: '',
    email: '',
    address: '',
    gender: 'Male',
    dob: '2011-01-01',
    status: 'Active' as 'Active' | 'Inactive',
    monthlyFee: '15000',
    annualFee: '25000',
    booksPayment: '8000',
    securityFee: '10000',
    admissionFee: '15000',
    examFee: '3000',
  });

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({
      name: '',
      className: 'Grade 10',
      section: 'A',
      parentName: '',
      phone: '',
      email: '',
      address: '',
      gender: 'Male',
      dob: '2011-01-01',
      status: 'Active',
      monthlyFee: '15000',
      annualFee: '25000',
      booksPayment: '8000',
      securityFee: '10000',
      admissionFee: '15000',
      examFee: '3000',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      className: student.className,
      section: student.section,
      parentName: student.parentName,
      phone: student.phone,
      email: student.email,
      address: student.address,
      gender: student.gender,
      dob: student.dob,
      status: student.status,
      monthlyFee: String(student.monthlyFee ?? 15000),
      annualFee: String(student.annualFee ?? 25000),
      booksPayment: String(student.booksPayment ?? 8000),
      securityFee: String(student.securityFee ?? 10000),
      admissionFee: String(student.admissionFee ?? 15000),
      examFee: String(student.examFee ?? 3000),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingStudent) {
      const updated: Student = {
        ...editingStudent,
        name: formData.name,
        className: formData.className,
        section: formData.section,
        parentName: formData.parentName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        gender: formData.gender,
        dob: formData.dob,
        status: formData.status,
        monthlyFee: Number(formData.monthlyFee) || 0,
        annualFee: Number(formData.annualFee) || 0,
        booksPayment: Number(formData.booksPayment) || 0,
        securityFee: Number(formData.securityFee) || 0,
        admissionFee: Number(formData.admissionFee) || 0,
        examFee: Number(formData.examFee) || 0,
      };
      onEditStudent(updated);
    } else {
      // Auto-generate rolling ID
      const count = students.length + 1;
      const formattedCount = String(count).padStart(3, '0');
      const generatedId = `STU-2026-${formattedCount}`;
      const rollNo = String(2600 + count);

      const created: Student = {
        id: generatedId,
        rollNo,
        name: formData.name,
        className: formData.className,
        section: formData.section,
        parentName: formData.parentName || 'Parent Name',
        phone: formData.phone || '+1 (555) 000-0000',
        email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@school.edu`,
        address: formData.address || 'Greenfield Campus Precinct',
        gender: formData.gender,
        dob: formData.dob,
        status: formData.status,
        admissionDate: new Date().toISOString().split('T')[0],
        monthlyFee: Number(formData.monthlyFee) || 0,
        annualFee: Number(formData.annualFee) || 0,
        booksPayment: Number(formData.booksPayment) || 0,
        securityFee: Number(formData.securityFee) || 0,
        admissionFee: Number(formData.admissionFee) || 0,
        examFee: Number(formData.examFee) || 0,
      };
      onAddStudent(created);
    }
    setIsModalOpen(false);
  };

  const filteredStudents = students.filter(std => {
    const matchesSearch = std.name.toLowerCase().includes(search.toLowerCase()) || 
                          std.id.toLowerCase().includes(search.toLowerCase()) ||
                          std.parentName.toLowerCase().includes(search.toLowerCase());
    const matchesClassObj = classFilter === 'All' || std.className === classFilter;
    return matchesSearch && matchesClassObj;
  });

  const uniqueClasses = Array.from(new Set(students.map(s => s.className)));

  const handlePrintIDCard = () => {
    const printContent = document.getElementById('printable-card-inner')?.innerHTML;
    if (!printContent) return;

    const printWindow = window.open('', '', 'height=500,width=800');
    if (!printWindow) return;

    printWindow.document.write('<html><head><title>Student ID Badge Printer</title>');
    printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>');
    printWindow.document.write('</head><body class="bg-gray-100 flex items-center justify-center h-screen">');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    
    // Allow styles to load
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 600);
  };

  return (
    <div id="student-module" className="space-y-6 animate-fade-in font-sans pb-20">
      
      {/* Header operations */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl glass-card shadow-sm">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">STUDENT DIRECTORY</h1>
          <p className="text-xs text-gray-500 dark:text-gray-300">Configure class lists, generate ID badges, and review performance profiles.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          id="add-student-trigger"
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-white font-semibold text-xs transition-transform select-none self-start hover:scale-[1.01]"
          style={{ backgroundColor: accentColor }}
        >
          <Plus className="w-4 h-4" /> Add Student
        </button>
      </div>

      {/* Query filters filters Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex items-center gap-2 px-3.5 py-1.5 rounded-xl shadow-sm glass-card">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search student by name, ID, parent name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none text-xs text-gray-700 dark:text-white focus:outline-none w-full placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl shadow-sm shrink-0 glass-card">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="bg-transparent border-none text-xs text-gray-755 dark:text-white focus:outline-none focus:ring-0 active:outline-none cursor-pointer"
          >
            <option value="All" className="bg-white dark:bg-slate-900">All Grades</option>
            {uniqueClasses.map(c => (
              <option key={c} value={c} className="bg-white dark:bg-slate-900">{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Database Table Grid */}
      <div className="rounded-2xl shadow-md overflow-hidden animate-fade-in glass-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-150 dark:border-slate-800 text-gray-400 text-[10px] font-bold uppercase tracking-wider bg-gray-50/50 dark:bg-slate-850">
                <th className="py-4 px-6">ID & Student</th>
                <th className="py-4 px-6">Grade Class</th>
                <th className="py-4 px-6">Parent or Guardian</th>
                <th className="py-4 px-6">Phone Number</th>
                <th className="py-4 px-6">Email Address</th>
                <th className="py-4 px-6">Account Status</th>
                <th className="py-4 px-6 text-right">Administrative Commands</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-xs">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((std) => (
                  <tr key={std.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-850 transition-colors">
                    <td className="py-4 px-6 font-medium">
                      <div className="flex items-center gap-3">
                        {/* Mock Avatar */}
                        <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 relative border border-gray-200 dark:border-slate-705 shrink-0">
                          {std.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{std.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono font-bold leading-none mt-1">Roll ID: {std.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-800 dark:text-gray-200 font-semibold truncate max-w-[7.5rem]">
                      {std.className} - {std.section}
                    </td>
                    <td className="py-4 px-6 text-gray-650 dark:text-gray-300 font-medium whitespace-nowrap">
                      {std.parentName}
                    </td>
                    <td className="py-4 px-6 text-gray-500 font-mono whitespace-nowrap">
                      {std.phone}
                    </td>
                    <td className="py-4 px-6 text-gray-505 truncate max-w-[12rem]">
                      {std.email}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[9px] uppercase tracking-wide px-2.5 py-0.5 rounded-full font-bold inline-block ${
                        std.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' 
                          : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20'
                      }`}>
                        {std.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="inline-flex gap-1">
                        {/* Profile action viewer */}
                        <button
                          onClick={() => {
                            setSelectedProfileStudent(std);
                            setIsProfileModalOpen(true);
                          }}
                          title="View Profile Details"
                          id={`std-profile-btn-${std.id}`}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-indigo-550 dark:text-indigo-400 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {/* ID Badge action printer */}
                        <button
                          onClick={() => {
                            setSelectedIDStudent(std);
                            setIsCardModalOpen(true);
                          }}
                          title="Generate ID Badge Card"
                          id={`std-idbadge-btn-${std.id}`}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-emerald-550 dark:text-emerald-450 transition-colors"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                        {/* Edit Student */}
                        <button
                          onClick={() => handleOpenEdit(std)}
                          id={`std-edit-btn-${std.id}`}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-amber-550 dark:text-amber-400 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {/* Delete Student */}
                        <button
                          onClick={() => onDeleteStudent(std.id)}
                          id={`std-del-btn-${std.id}`}
                          className="p-2 hover:bg-gray-150 dark:hover:bg-slate-800 rounded-lg text-rose-500 hover:text-rose-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 font-bold uppercase select-none">
                    No matching students found in the roster.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD/EDIT STUDENT MODAL */}
      {isModalOpen && (
        <div id="student-modal-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden font-sans my-8 animate-scale-up">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-850 dark:text-white">
                {editingStudent ? 'Configure Student Profile Details' : 'Register New Student Entry'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* General Info block */}
              <div className="border-b border-gray-100 dark:border-slate-800 pb-3">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                  1. GENERAL INFORMATION
                </h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Core registration data and system parameters</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-200 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs p-3 bg-gray-50 dark:bg-slate-850 rounded-xl border border-gray-200 dark:border-slate-755 text-gray-800 dark:text-white focus:outline-none focus:border-indigo-500 font-semibold"
                    placeholder="e.g. Samuel Patterson"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-200 mb-1.5">Classroom Grade *</label>
                  <select
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="w-full text-xs p-3 bg-gray-50 dark:bg-slate-850 rounded-xl border border-gray-200 dark:border-slate-755 text-gray-800 dark:text-white focus:outline-none cursor-pointer font-semibold"
                  >
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 8">Grade 8</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-200 mb-1.5">Section *</label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full text-xs p-3 bg-gray-50 dark:bg-slate-850 rounded-xl border border-gray-200 dark:border-slate-755 text-gray-800 dark:text-white focus:outline-none cursor-pointer font-semibold"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-200 mb-1.5">Parent/Guardian Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full text-xs p-3 bg-gray-50 dark:bg-slate-850 rounded-xl border border-gray-200 dark:border-slate-755 text-gray-800 dark:text-white font-semibold"
                    placeholder="e.g. Robert Wright"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-200 mb-1.5">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs p-3 bg-gray-50 dark:bg-slate-850 rounded-xl border border-gray-200 dark:border-slate-755 text-gray-800 dark:text-white font-mono font-semibold"
                    placeholder="e.g. +92 300 1234567"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-200 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs p-3 bg-gray-50 dark:bg-slate-850 rounded-xl border border-gray-200 dark:border-slate-755 text-gray-800 dark:text-white font-semibold"
                    placeholder="e.g. student@school.edu"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-200 mb-1.5">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full text-xs p-3 bg-gray-50 dark:bg-slate-850 rounded-xl border border-gray-200 dark:border-slate-755 text-gray-800 dark:text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-200 mb-1.5">Gender</label>
                  <div className="flex gap-4 p-2.5">
                    <label className="flex items-center gap-1.5 text-xs text-zinc-700 dark:text-zinc-200 font-semibold cursor-pointer select-none">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={formData.gender === 'Male'}
                        onChange={() => setFormData({ ...formData, gender: 'Male' })}
                        className="accent-indigo-600"
                      /> Male
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-zinc-700 dark:text-zinc-200 font-semibold cursor-pointer select-none">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={formData.gender === 'Female'}
                        onChange={() => setFormData({ ...formData, gender: 'Female' })}
                        className="accent-indigo-600"
                      /> Female
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-200 mb-1.5">Account Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
                    className="w-full text-xs p-3 bg-gray-50 dark:bg-slate-850 rounded-xl border border-gray-200 dark:border-slate-755 text-gray-850 dark:text-white cursor-pointer font-semibold"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Direct fee specification parameters segment */}
                <div className="col-span-2 border-t border-gray-100 dark:border-slate-800 pt-4 mt-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1 bg-emerald-55/10 dark:bg-emerald-950/20 px-2.5 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900/40">
                    💰 2. STUDENT CHARGES & SCHOOL FEES (PKR)
                  </h4>
                  <p className="text-[10px] text-zinc-600 dark:text-zinc-300 font-medium">Define custom base scales registered to this student's financial ledger</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-150 mb-1.5">Monthly Fee (PKR) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.monthlyFee}
                    onChange={(e) => setFormData({ ...formData, monthlyFee: e.target.value })}
                    className="w-full text-xs p-3 bg-gray-55 dark:bg-slate-850 rounded-xl border border-zinc-300 dark:border-slate-755 text-zinc-950 dark:text-white font-bold font-mono"
                    placeholder="e.g. 15000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-150 mb-1.5">Annual Fee (PKR) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.annualFee}
                    onChange={(e) => setFormData({ ...formData, annualFee: e.target.value })}
                    className="w-full text-xs p-3 bg-gray-55 dark:bg-slate-850 rounded-xl border border-zinc-300 dark:border-slate-755 text-zinc-950 dark:text-white font-bold font-mono"
                    placeholder="e.g. 25000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-150 mb-1.5">Books Payment (PKR) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.booksPayment}
                    onChange={(e) => setFormData({ ...formData, booksPayment: e.target.value })}
                    className="w-full text-xs p-3 bg-gray-55 dark:bg-slate-850 rounded-xl border border-zinc-300 dark:border-slate-755 text-zinc-950 dark:text-white font-bold font-mono"
                    placeholder="e.g. 8000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-150 mb-1.5">Security Deposit (PKR) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.securityFee}
                    onChange={(e) => setFormData({ ...formData, securityFee: e.target.value })}
                    className="w-full text-xs p-3 bg-gray-55 dark:bg-slate-850 rounded-xl border border-zinc-300 dark:border-slate-755 text-zinc-950 dark:text-white font-bold font-mono"
                    placeholder="e.g. 10000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-150 mb-1.5">Admission Fee (PKR) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.admissionFee}
                    onChange={(e) => setFormData({ ...formData, admissionFee: e.target.value })}
                    className="w-full text-xs p-3 bg-gray-55 dark:bg-slate-850 rounded-xl border border-zinc-300 dark:border-slate-755 text-zinc-950 dark:text-white font-bold font-mono"
                    placeholder="e.g. 15000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-150 mb-1.5">Exam Entrance Fee (PKR) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.examFee}
                    onChange={(e) => setFormData({ ...formData, examFee: e.target.value })}
                    className="w-full text-xs p-3 bg-gray-55 dark:bg-slate-850 rounded-xl border border-zinc-300 dark:border-slate-755 text-zinc-950 dark:text-white font-bold font-mono"
                    placeholder="e.g. 3000"
                  />
                </div>
              </div>

              <div className="pt-5 border-t border-gray-150 dark:border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-750 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white text-xs font-semibold select-none shadow hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: accentColor }}
                >
                  {editingStudent ? 'Save Changes' : 'Record admission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STUDENT PROFILE VIEWER MODAL */}
      {isProfileModalOpen && selectedProfileStudent && (
        <div id="student-profile-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden font-sans animate-scale-up text-gray-800 dark:text-gray-150">
            <div className="relative h-24 bg-gradient-to-r from-slate-900 to-indigo-950 p-5 flex items-end justify-between">
              <button 
                onClick={() => setIsProfileModalOpen(false)} 
                className="absolute top-4 right-4 text-white/75 hover:text-white p-1 rounded-full bg-white/10 hover:bg-white/15"
              >
                <X className="w-4 h-4" />
              </button>
              {/* Profile layout header details */}
            </div>

            <div className="p-6 pt-0 space-y-4 relative">
              {/* Avatar position offset */}
              <div className="flex gap-4 -mt-8 items-end justify-between">
                <div className="w-18 h-18 rounded-full bg-slate-200 dark:bg-slate-850 border-4 border-white dark:border-slate-900 flex items-center justify-center font-bold text-2xl shadow-md text-slate-800 dark:text-gray-200">
                  {selectedProfileStudent.name.charAt(0)}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-50 dark:bg-slate-805 border px-2 py-0.5 rounded-full uppercase leading-none">
                    Status: {selectedProfileStudent.status}
                  </span>
                </div>
              </div>

              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white leading-none">{selectedProfileStudent.name}</h2>
                <p className="text-xs text-gray-400 font-medium mt-1">Class Room: {selectedProfileStudent.className} ({selectedProfileStudent.section})</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3.5 border-t border-gray-100 dark:border-slate-800 text-xs">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Registration Roll</p>
                  <p className="font-semibold">{selectedProfileStudent.rollNo}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Admin Register Date</p>
                  <p className="font-semibold">{selectedProfileStudent.admissionDate}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Date Of Birth</p>
                  <p className="font-semibold">{selectedProfileStudent.dob}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Gender Status</p>
                  <p className="font-semibold">{selectedProfileStudent.gender}</p>
                </div>
              </div>

              <div className="pt-3.5 border-t border-gray-100 dark:border-slate-800 space-y-2.5 text-xs text-gray-650 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-gray-400 shrink-0" />
                  <span><strong>Guardian:</strong> {selectedProfileStudent.parentName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <span><strong>Primary Email:</strong> {selectedProfileStudent.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <span><strong>Phone Contact:</strong> {selectedProfileStudent.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <span><strong>Address Info:</strong> {selectedProfileStudent.address}</span>
                </div>
              </div>

              {/* Profile custom registered fees structure */}
              <div className="pt-3.5 border-t border-gray-150 dark:border-slate-800 space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Registered Ledger Fee Schedule (PKR)
                </h4>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div className="bg-slate-50 dark:bg-slate-850 p-2 rounded-lg border border-gray-100 dark:border-slate-800 text-center">
                    <span className="block text-[8px] font-bold text-gray-500 dark:text-zinc-400 uppercase">Monthly Fee</span>
                    <span className="font-bold font-mono text-slate-850 dark:text-white">PKR {selectedProfileStudent.monthlyFee ?? 15000}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-850 p-2 rounded-lg border border-gray-100 dark:border-slate-800 text-center">
                    <span className="block text-[8px] font-bold text-gray-500 dark:text-zinc-400 uppercase">Annual Fee</span>
                    <span className="font-bold font-mono text-slate-850 dark:text-white">PKR {selectedProfileStudent.annualFee ?? 25000}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-850 p-2 rounded-lg border border-gray-100 dark:border-slate-800 text-center">
                    <span className="block text-[8px] font-bold text-gray-500 dark:text-zinc-400 uppercase">Books Pay</span>
                    <span className="font-bold font-mono text-slate-850 dark:text-white">PKR {selectedProfileStudent.booksPayment ?? 8000}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-850 p-2 rounded-lg border border-gray-100 dark:border-slate-800 text-center">
                    <span className="block text-[8px] font-bold text-gray-500 dark:text-zinc-400 uppercase">Security</span>
                    <span className="font-bold font-mono text-slate-850 dark:text-white">PKR {selectedProfileStudent.securityFee ?? 10000}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-850 p-2 rounded-lg border border-gray-100 dark:border-slate-800 text-center">
                    <span className="block text-[8px] font-bold text-gray-500 dark:text-zinc-400 uppercase">Admission</span>
                    <span className="font-bold font-mono text-slate-850 dark:text-white">PKR {selectedProfileStudent.admissionFee ?? 15000}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-850 p-2 rounded-lg border border-gray-100 dark:border-slate-800 text-center">
                    <span className="block text-[8px] font-bold text-gray-500 dark:text-zinc-400 uppercase">Exam Fee</span>
                    <span className="font-bold font-mono text-slate-850 dark:text-white">PKR {selectedProfileStudent.examFee ?? 3000}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-semibold"
                >
                  Close Profile Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STUDENT ID BADGE PRINTER MODAL */}
      {isCardModalOpen && selectedIDStudent && (
        <div id="student-id-card-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl max-w-sm w-full shadow-2xl p-6 font-sans text-gray-700 dark:text-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-805 pb-3.5 mb-5">
              <h3 className="text-xs font-bold uppercase tracking-wide">ID Badge Print Preview</h3>
              <button onClick={() => setIsCardModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Print badge container */}
            <div id="printable-card-inner" className="bg-white p-5 rounded-2xl border-2 border-indigo-600 shadow-lg text-slate-800 text-center space-y-4 max-w-full">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between gap-2 text-left">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase">GREENFIELD ACADEMY</h4>
                  <p className="text-[8px] text-slate-400 font-bold uppercase">Campus ID Card</p>
                </div>
                <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">G</div>
              </div>

              <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center font-bold text-lg text-slate-500">
                {selectedIDStudent.name.charAt(0)}
              </div>

              <div>
                <h5 className="font-bold text-sm text-slate-900 leading-none">{selectedIDStudent.name}</h5>
                <p className="text-[10px] text-slate-500 font-medium mt-1">Student Category: Grade Room ({selectedIDStudent.className})</p>
              </div>

              <div className="grid grid-cols-2 text-left text-[10px] gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">ID Card number</span>
                  <p className="font-semibold text-slate-900">{selectedIDStudent.id}</p>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">Roll Assign</span>
                  <p className="font-semibold text-slate-900"># {selectedIDStudent.rollNo}</p>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">Emergency Call</span>
                  <p className="font-semibold text-slate-900 select-all">{selectedIDStudent.phone}</p>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">Register Date</span>
                  <p className="font-semibold text-slate-900">{selectedIDStudent.admissionDate}</p>
                </div>
              </div>

              {/* Bar code simulation placeholder */}
              <div className="pt-2 border-t border-slate-100 text-center">
                <div className="font-mono text-[9px] text-gray-400 tracking-widest leading-none bg-slate-50 py-1.5 px-3 rounded-lg border inline-block">
                  |||||| | | |||| |||| ||||
                </div>
              </div>
            </div>

            <div className="pt-5 flex justify-end gap-2.5 mt-5 border-t border-gray-100 dark:border-slate-805">
              <button
                onClick={() => setIsCardModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handlePrintIDCard}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white text-xs font-semibold shadow hover:opacity-90 transition-opacity"
                style={{ backgroundColor: accentColor }}
              >
                <Printer className="w-3.5 h-3.5" /> Direct printing
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
