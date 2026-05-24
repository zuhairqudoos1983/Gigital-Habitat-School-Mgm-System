import React, { useState } from 'react';
import { 
  Plus, Edit, Trash2, Search, Mail, Phone, 
  GraduationCap, Calendar, DollarSign, X 
} from 'lucide-react';
import { Teacher } from '../types';

interface TeacherModuleProps {
  teachers: Teacher[];
  onAddTeacher: (tch: Teacher) => void;
  onEditTeacher: (tch: Teacher) => void;
  onDeleteTeacher: (id: string) => void;
  accentColor: string;
}

export const TeacherModule: React.FC<TeacherModuleProps> = ({
  teachers,
  onAddTeacher,
  onEditTeacher,
  onDeleteTeacher,
  accentColor
}) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  // Profile overlay modal
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedProfileTeacher, setSelectedProfileTeacher] = useState<Teacher | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Mathematics',
    qualification: '',
    salary: 3500,
    status: 'Active' as 'Active' | 'Inactive',
  });

  const subjectsList = [
    'Mathematics', 'Physics', 'English Literature', 'Computer Science', 
    'Chemistry', 'Biology', 'History', 'Islamic Studies'
  ];

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'Mathematics',
      qualification: '',
      salary: 3500,
      status: 'Active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tch: Teacher) => {
    setEditingTeacher(tch);
    setFormData({
      name: tch.name,
      email: tch.email,
      phone: tch.phone,
      subject: tch.subject,
      qualification: tch.qualification,
      salary: tch.salary,
      status: tch.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingTeacher) {
      const updated: Teacher = {
        ...editingTeacher,
        ...formData
      };
      onEditTeacher(updated);
    } else {
      const idCount = teachers.length + 1;
      const id = `TCH-${String(idCount).padStart(3, '0')}`;

      const created: Teacher = {
        id,
        name: formData.name,
        email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@school.edu`,
        phone: formData.phone || '+1 (555) 001-2000',
        subject: formData.subject,
        qualification: formData.qualification || 'B.Ed. Certification',
        classes: ['Grade 10-A'], // default assignment
        salary: Number(formData.salary),
        status: formData.status,
        joinDate: new Date().toISOString().split('T')[0],
        attendance: {},
      };
      onAddTeacher(created);
    }
    setIsModalOpen(false);
  };

  const filteredTeachers = teachers.filter(tch => {
    return tch.name.toLowerCase().includes(search.toLowerCase()) || 
           tch.subject.toLowerCase().includes(search.toLowerCase()) || 
           tch.id.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div id="teacher-module" className="space-y-6 animate-fade-in font-sans pb-20">
      
      {/* Header panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl glass-card shadow-sm animate-fade-in">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">FACULTY & TEACHERS</h1>
          <p className="text-xs text-gray-400 dark:text-gray-300">Review teacher subject allocations, payroll figures, and certification levels.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          id="add-teacher-trigger"
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-white font-semibold text-xs hover:opacity-90 select-none transition-all cursor-pointer"
          style={{ backgroundColor: accentColor }}
        >
          <Plus className="w-4 h-4" /> Add Teacher
        </button>
      </div>

      {/* Query filters */}
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl max-w-sm w-full glass-card shadow-sm">
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Search teachers by name, subject, ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none text-xs text-gray-700 dark:text-white focus:outline-none w-full placeholder:text-gray-400"
        />
      </div>

      {/* Database Listing Table */}
      <div className="rounded-2xl shadow-md overflow-hidden glass-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-150 dark:border-slate-805 text-gray-400 text-[10px] font-bold uppercase tracking-wider bg-gray-50/50 dark:bg-slate-850">
                <th className="py-4 px-6">ID & Teacher Info</th>
                <th className="py-4 px-6">Assigned Subject</th>
                <th className="py-4 px-6">Highest Qualification</th>
                <th className="py-4 px-6">Monthly Payroll</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-gray-200">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((tch) => (
                  <tr key={tch.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-850 transition-colors">
                    <td className="py-4 px-6 font-semibold">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold shrink-0">
                          {tch.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-950 dark:text-white">{tch.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono font-bold mt-1">ID Code: {tch.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold">
                      <span className="p-1 px-2.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-lg">
                        {tch.subject}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-300 font-medium">
                      {tch.qualification}
                    </td>
                    <td className="py-4 px-6 font-semibold font-mono">
                      PKR {tch.salary}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[9px] uppercase tracking-wide px-2.5 py-0.5 rounded-full font-bold ${
                        tch.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' 
                          : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20'
                      }`}>
                        {tch.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => {
                            setSelectedProfileTeacher(tch);
                            setIsProfileModalOpen(true);
                          }}
                          id={`tch-vw-btn-${tch.id}`}
                          title="View Profile Metrics"
                          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-indigo-550 dark:text-indigo-400"
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => handleOpenEdit(tch)}
                          id={`tch-edit-btn-${tch.id}`}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-amber-550 dark:text-amber-450"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDeleteTeacher(tch.id)}
                          id={`tch-del-btn-${tch.id}`}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-rose-500 hover:text-rose-700 font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 font-bold uppercase select-none">
                    No matching faculty records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD/EDIT FACULTY MODAL */}
      {isModalOpen && (
        <div id="teacher-modal-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden font-sans animate-scale-up">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 dark:text-white">
                {editingTeacher ? 'Adjust Register Rules' : 'Registry New Teacher Entry'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs p-3 bg-gray-50 dark:bg-slate-850 rounded-xl border border-gray-200 dark:border-slate-755 text-gray-850 dark:text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Sarah Jenkins"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5 font-sans">Primary Subject *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full text-xs p-3 bg-gray-50 dark:bg-slate-850 rounded-xl border border-gray-200 dark:border-slate-755 text-gray-800 dark:text-white focus:outline-none cursor-pointer"
                  >
                    {subjectsList.map(subj => (
                      <option key={subj} value={subj}>{subj}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5 font-sans">Salary Pay Amount (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                    className="w-full text-xs p-3 bg-gray-50 dark:bg-slate-850 rounded-xl border border-gray-200 dark:border-slate-755 text-gray-800 dark:text-white"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Highest Qualification</label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full text-xs p-3 bg-gray-50 dark:bg-slate-850 rounded-xl border border-gray-200 dark:border-slate-755 text-gray-800 dark:text-white"
                    placeholder="e.g. Ph.D. in Physics, MIT"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Primary email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs p-3 bg-gray-50 dark:bg-slate-850 rounded-xl border border-gray-200 dark:border-slate-755 text-gray-850 dark:text-white"
                    placeholder="e.g. jenkins@school.edu"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5 font-mono">Mobile Contact</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs p-3 bg-gray-50 dark:bg-slate-850 rounded-xl border border-gray-200 dark:border-slate-755 text-gray-850 dark:text-white"
                    placeholder="e.g. +1 (555) 0122-835"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Account Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
                    className="w-full text-xs p-3 bg-gray-50 dark:bg-slate-850 rounded-xl border border-gray-200 dark:border-slate-755 text-gray-850 dark:text-white cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-slate-800 text-gray-650 dark:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white text-xs font-semibold select-none shadow hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: accentColor }}
                >
                  {editingTeacher ? 'Save Changes' : 'Record faculty member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEACHER PROFILE OVERLAY VIEWER */}
      {isProfileModalOpen && selectedProfileTeacher && (
        <div id="teacher-profile-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden font-sans animate-scale-up text-gray-800 dark:text-gray-150">
            <div className="relative h-24 bg-gradient-to-r from-slate-900 to-indigo-950 p-5 flex items-end justify-between">
              <button 
                onClick={() => setIsProfileModalOpen(false)} 
                className="absolute top-4 right-4 text-white/75 hover:text-white p-1 rounded-full bg-white/10 hover:bg-white/15"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 pt-0 space-y-4">
              <div className="flex gap-4 -mt-8 items-end justify-between">
                <div className="w-18 h-18 rounded-full bg-slate-200 dark:bg-slate-850 border-4 border-white dark:border-slate-900 flex items-center justify-center font-bold text-2xl shadow-md text-slate-800 dark:text-gray-200">
                  {selectedProfileTeacher.name.charAt(0)}
                </div>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-50 dark:bg-slate-805 border px-2.5 py-0.5 rounded-full uppercase leading-none">
                  Rank: {selectedProfileTeacher.status}
                </span>
              </div>

              <div>
                <h2 className="text-base font-bold text-gray-950 dark:text-white leading-none">{selectedProfileTeacher.name}</h2>
                <p className="text-xs text-gray-400 font-medium mt-1">Assigned Subject: {selectedProfileTeacher.subject}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3.5 border-t border-gray-100 dark:border-slate-800 text-xs">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Faculty Access ID</p>
                  <p className="font-semibold">{selectedProfileTeacher.id}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Campus Hire Date</p>
                  <p className="font-semibold">{selectedProfileTeacher.joinDate}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Pay Wage Scale</p>
                  <p className="font-semibold font-mono">PKR {selectedProfileTeacher.salary} / Month</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Education Degree</p>
                  <p className="font-semibold">{selectedProfileTeacher.qualification}</p>
                </div>
              </div>

              {/* Subject Classes Assignment list */}
              <div className="pt-3.5 border-t border-gray-100 dark:border-slate-800">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Classroom Taught Assignments</p>
                <div className="flex gap-2 flex-wrap">
                  {selectedProfileTeacher.classes.map((cls, idx) => (
                    <span key={idx} className="p-1 px-2.5 bg-gray-50 dark:bg-slate-805 rounded-lg border text-[11px] font-semibold">
                      {cls}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3.5 border-t border-gray-100 dark:border-slate-800 space-y-2.5 text-xs text-gray-650 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-450 shrink-0" />
                  <span><strong>Work Mail:</strong> {selectedProfileTeacher.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-450 shrink-0" />
                  <span><strong>Work Cell:</strong> {selectedProfileTeacher.phone}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-end">
                <button
                  type="button"
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

    </div>
  );
};
