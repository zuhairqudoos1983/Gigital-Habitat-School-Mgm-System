import React, { useState } from 'react';
import { 
  Award, Medal, ClipboardList, Plus, Printer, 
  X, HelpCircle, Check, Search, Trash2 
} from 'lucide-react';
import { Exam, MarksRecord, Student } from '../types';

interface ExamModuleProps {
  exams: Exam[];
  marks: MarksRecord[];
  students: Student[];
  onAddExam: (ex: Exam) => void;
  onAddMarks: (mrk: MarksRecord) => void;
  accentColor: string;
}

export const ExamModule: React.FC<ExamModuleProps> = ({
  exams,
  marks,
  students,
  onAddExam,
  onAddMarks,
  accentColor
}) => {
  const [selectedClass, setSelectedClass] = useState('G10-A');
  const [selectedExamId, setSelectedExamId] = useState(exams[0]?.id || '');

  // Report card preview overlays
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedReportStudent, setSelectedReportStudent] = useState<Student | null>(null);

  // New Exam Creation Form Overlay
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [examForm, setExamForm] = useState({
    name: 'Midterm Assessment 2',
    subject: 'Mathematics',
    maxMarks: 100,
    date: '2026-06-15'
  });

  // Score management marks entry state
  // key: "studentId_examId", value: number
  const [editingMarks, setEditingMarks] = useState<Record<string, number>>({});
  const [editingRemarks, setEditingRemarks] = useState<Record<string, string>>({});

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    const count = exams.length + 1;
    const created: Exam = {
      id: `EXM-26-${String(count).padStart(3, '0')}`,
      name: examForm.name,
      classId: selectedClass,
      subject: examForm.subject,
      date: examForm.date,
      maxMarks: Number(examForm.maxMarks)
    };
    onAddExam(created);
    setIsExamModalOpen(false);
  };

  // Filter students enrolled in the currently selected exam's class
  const activeExamObj = exams.find(e => e.id === selectedExamId);
  const examClassId = activeExamObj?.classId || 'G10-A';
  
  // Grade matching (G10-A -> Grade 10)
  const matchingStudents = students.filter(s => {
    if (examClassId === 'G10-A') return s.className === 'Grade 10';
    if (examClassId === 'G9-B') return s.className === 'Grade 9';
    return true;
  });

  const getStudentScore = (studentId: string) => {
    // Check local editing state first, then database
    if (editingMarks[studentId] !== undefined) return editingMarks[studentId];
    const rec = marks.find(m => m.examId === selectedExamId && m.studentId === studentId);
    return rec ? rec.marksObtained : 0;
  };

  const getStudentRemarks = (studentId: string) => {
    if (editingRemarks[studentId] !== undefined) return editingRemarks[studentId];
    const rec = marks.find(m => m.examId === selectedExamId && m.studentId === studentId);
    return rec ? rec.remarks : '';
  };

  const handleUpdateMarks = (studentId: string, score: number, remarks: string) => {
    setEditingMarks(prev => ({ ...prev, [studentId]: score }));
    setEditingRemarks(prev => ({ ...prev, [studentId]: remarks }));

    const count = marks.length + 1;
    const created: MarksRecord = {
      id: `MRK-${String(count).padStart(3, '0')}`,
      studentId,
      examId: selectedExamId,
      marksObtained: Number(score),
      remarks
    };
    onAddMarks(created);
  };

  // GPA calculation function
  const calculateGPA = (marks: number, max: number) => {
    const percentage = (marks / max) * 100;
    if (percentage >= 90) return { gpa: '4.0', grade: 'A+', color: 'text-emerald-500' };
    if (percentage >= 80) return { gpa: '3.7', grade: 'A', color: 'text-emerald-450' };
    if (percentage >= 70) return { gpa: '3.3', grade: 'B', color: 'text-indigo-400' };
    if (percentage >= 60) return { gpa: '2.7', grade: 'C', color: 'text-amber-500' };
    if (percentage >= 50) return { gpa: '2.0', grade: 'D', color: 'text-rose-500' };
    return { gpa: '0.0', grade: 'F', color: 'text-rose-600 font-bold' };
  };

  // Combined score list for student report cards
  const getStudentReportCardRecords = (studentId: string) => {
    const records = marks.filter(m => m.studentId === studentId);
    return records.map(r => {
      const examObj = exams.find(e => e.id === r.examId);
      return {
        id: r.id,
        examName: examObj?.name || 'Assessment Spec',
        subject: examObj?.subject || 'Curriculum',
        max: examObj?.maxMarks || 100,
        obtained: r.marksObtained,
        remarks: r.remarks
      };
    });
  };

  const handlePrintReportCard = () => {
    const reportContent = document.getElementById('report-inner-card')?.innerHTML;
    if (!reportContent) return;

    const printWin = window.open('', '', 'height=700,width=850');
    if (!printWin) return;

    printWin.document.write('<html><head><title>Academic Achievement Report</title>');
    printWin.document.write('<script src="https://cdn.tailwindcss.com"></script>');
    printWin.document.write('</head><body class="bg-gray-100 flex items-center justify-center p-6 bg-white min-h-screen">');
    printWin.document.write('<div class="max-w-3xl w-full">');
    printWin.document.write(reportContent);
    printWin.document.write('</div></body></html>');
    printWin.document.close();

    setTimeout(() => {
      printWin.focus();
      printWin.print();
      printWin.close();
    }, 600);
  };

  return (
    <div id="exam-dashboard" className="space-y-6 animate-fade-in font-sans pb-20 text-gray-800 dark:text-gray-150">
      
      {/* Header controls panels */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-150 dark:border-slate-850 shadow-sm animate-fade-in">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white uppercase">EXAMINATIONS & RESULTS</h1>
          <p className="text-xs text-gray-400">Add course examinations, record grade points, and compile official PDF/Print report cards.</p>
        </div>
        <button
          onClick={() => setIsExamModalOpen(true)}
          id="btn-exam-add"
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-white font-semibold text-xs hover:opacity-90 select-none transition-all cursor-pointer"
          style={{ backgroundColor: accentColor }}
        >
          <Plus className="w-4 h-4" /> Schedule New Exam
        </button>
      </div>

      {/* Aggregate metrics banners */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-150 dark:border-slate-805 shadow-sm flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Registered assessments</p>
            <h3 className="text-xl font-bold font-mono text-gray-900 dark:text-white">{exams.length}</h3>
          </div>
          <ClipboardList className="w-5 h-5 text-indigo-500" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-150 dark:border-slate-855 shadow-sm flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Exam Passing Target Code</p>
            <h3 className="text-sm font-bold tracking-tight">C-Grade (Min score: 60%)</h3>
          </div>
          <Medal className="w-5 h-5 text-amber-500 font-bold" />
        </div>

        <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Curriculums</p>
            <h3 className="text-sm font-bold">Standard Cambridge Framework</h3>
          </div>
          <Award className="w-5 h-5 text-indigo-400" />
        </div>
      </div>

      {/* Course select selector row */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Exam Schedule list selector */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3.5 py-1.5 rounded-xl border border-gray-150 dark:border-slate-800 shadow-sm shrink-0">
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="bg-transparent border-none text-xs text-gray-700 dark:text-white focus:outline-none focus:ring-0 cursor-pointer"
          >
            {exams.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.name} - {ex.subject}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Database gradebook marking logs */}
      <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-815 rounded-2xl shadow-md overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-slate-850 bg-gray-50/50 dark:bg-slate-850 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active gradebook ({matchingStudents.length} Eligible candidates)</span>
          <span className="text-[10px] text-gray-400 font-bold uppercase">Topic: {activeExamObj?.subject}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-150 dark:border-slate-800 text-gray-400 text-[10px] font-bold uppercase tracking-wider bg-gray-50/50 dark:bg-slate-850">
                <th className="py-4 px-6">Roll & Student ID</th>
                <th className="py-4 px-6">Full Candidate Name</th>
                <th className="py-4 px-6">Score Obtains (Max: {activeExamObj?.maxMarks || 100})</th>
                <th className="py-4 px-6">Course Grade Point (GPA)</th>
                <th className="py-4 px-6">Teacher Notes & Remarks</th>
                <th className="py-4 px-6 text-right">Commit Marks / Reports</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-xs">
              {matchingStudents.map((std) => {
                const score = getStudentScore(std.id);
                const remark = getStudentRemarks(std.id);
                const calculation = calculateGPA(score, activeExamObj?.maxMarks || 100);

                return (
                  <tr key={std.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-850 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-gray-500">{std.id}</td>
                    <td className="py-4 px-6 font-semibold text-gray-900 dark:text-white">{std.name}</td>
                    <td className="py-4 px-6">
                      <input
                        type="number"
                        min="0"
                        max={activeExamObj?.maxMarks || 100}
                        value={score}
                        id={`marks-num-${std.id}`}
                        onChange={(e) => handleUpdateMarks(std.id, Number(e.target.value), remark)}
                        className="w-16 p-1 bg-gray-100 dark:bg-slate-800 rounded text-center font-bold text-xs"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <span className={`p-1.5 px-2.5 rounded-lg text-[10px] font-extrabold uppercase bg-gray-50 dark:bg-slate-800 ${calculation.color}`}>
                        {calculation.grade} (GPA: {calculation.gpa})
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <input
                        type="text"
                        value={remark}
                        id={`marks-rem-${std.id}`}
                        onChange={(e) => handleUpdateMarks(std.id, score, e.target.value)}
                        placeholder="e.g. Needs logical progression refinement"
                        className="w-full text-xs p-1 px-2.5 bg-gray-50 dark:bg-slate-850 border border-gray-100 dark:border-slate-800 rounded"
                      />
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedReportStudent(std);
                          setIsReportOpen(true);
                        }}
                        id={`std-repcard-${std.id}`}
                        className="text-[10px] font-bold uppercase text-indigo-550 border border-indigo-550/20 px-2.5 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all select-none"
                      >
                        Print report card
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SCHEDULE NEW EXAM MODAL */}
      {isExamModalOpen && (
        <div id="exam-modal-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden font-sans animate-scale-up text-gray-800 dark:text-gray-150">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wide">Schedule Assessment Course</h3>
              <button onClick={() => setIsExamModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase">Assessment Title</label>
                <input
                  type="text"
                  required
                  value={examForm.name}
                  onChange={(e) => setExamForm({ ...examForm, name: e.target.value })}
                  className="w-full p-3 bg-gray-50 rounded-xl text-gray-805"
                  placeholder="e.g. Midterm Term 2 Project"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase">Subject Area</label>
                <select
                  value={examForm.subject}
                  onChange={(e) => setExamForm({ ...examForm, subject: e.target.value })}
                  className="w-full p-3 bg-gray-50 rounded-xl text-gray-805"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="English Literature">English Literature</option>
                  <option value="Computer Science">Computer Science</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase">Maximum Score (Max marks)</label>
                <input
                  type="number"
                  required
                  value={examForm.maxMarks}
                  onChange={(e) => setExamForm({ ...examForm, maxMarks: Number(e.target.value) })}
                  className="w-full p-3 bg-gray-50 rounded-xl text-gray-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase">Examination Date</label>
                <input
                  type="date"
                  required
                  value={examForm.date}
                  onChange={(e) => setExamForm({ ...examForm, date: e.target.value })}
                  className="w-full p-3 bg-gray-50 rounded-xl text-gray-805 cursor-pointer"
                />
              </div>

              <div className="pt-3.5 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsExamModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-slate-705 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white font-semibold rounded-xl"
                  style={{ backgroundColor: accentColor }}
                >
                  Commit Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REPORT CARD VIEWER OVERLAY MODAL */}
      {isReportOpen && selectedReportStudent && (
        <div id="report-modal-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-155 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl p-6 text-slate-800 text-left relative font-sans">
            
            <button
              onClick={() => setIsReportOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Print inner card content */}
            <div id="report-inner-card" className="space-y-5 p-2 text-xs text-slate-705">
              <div className="border-b-2 border-indigo-600 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-none uppercase">GREENFIELD INTERNATIONAL ACADEMY</h3>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-1">Official Student Progress report card</p>
                </div>
                <div className="p-3 bg-indigo-600 text-white rounded-xl text-xl font-black">G</div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl text-[10px]">
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[8px]">Student Candidate</span>
                  <p className="font-bold text-indigo-950 mt-0.5">{selectedReportStudent.name}</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[8px]">Registration ID</span>
                  <p className="font-bold text-zinc-800 font-mono mt-0.5">{selectedReportStudent.id}</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[8px]">Roll Reference</span>
                  <p className="font-bold text-zinc-850 mt-0.5"># {selectedReportStudent.rollNo}</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[8px]">Class Room Enrolled</span>
                  <p className="font-bold text-zinc-850 mt-0.5">{selectedReportStudent.className}-{selectedReportStudent.section}</p>
                </div>
              </div>

              <div className="border border-slate-205 rounded-xl overflow-hidden">
                <table className="w-full text-left font-sans">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                      <th className="p-3">Examination Name</th>
                      <th className="p-3">Subject Area</th>
                      <th className="p-3">Obtained / Max Score</th>
                      <th className="p-3">GPA Rank</th>
                      <th className="p-3">Teacher Audit Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-755 font-medium">
                    {getStudentReportCardRecords(selectedReportStudent.id).length > 0 ? (
                      getStudentReportCardRecords(selectedReportStudent.id).map((mr, idx) => {
                        const scoreGpa = calculateGPA(mr.obtained, mr.max);
                        return (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-3 font-semibold text-slate-900">{mr.examName}</td>
                            <td className="p-3 font-semibold">{mr.subject}</td>
                            <td className="p-3 font-mono font-bold">{mr.obtained} / {mr.max}</td>
                            <td className={`p-3 font-black text-[10px] uppercase ${scoreGpa.color}`}>{scoreGpa.grade} (GPA: {scoreGpa.gpa})</td>
                            <td className="p-3 italic max-w-xs truncate text-[11px] text-slate-400 font-medium">{mr.remarks || 'Excellent'}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-slate-400 font-bold uppercase uppercase">
                          No score logging registered in system database.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="pt-6 grid grid-cols-2 text-center text-[10px] font-bold text-zinc-400 border-t border-slate-100 uppercase">
                <div>
                  <div className="border-b mx-auto w-36 py-4"></div>
                  <span className="mt-2 block font-bold text-indigo-950">Academic Coordinator</span>
                </div>
                <div>
                  <div className="border-b mx-auto w-36 py-4"></div>
                  <span className="mt-2 block font-bold text-indigo-950">Campus Principal Seal</span>
                </div>
              </div>

            </div>

            <div className="pt-5 flex justify-end gap-2.5 mt-5 border-t border-gray-155 dark:border-slate-805">
              <button
                onClick={handlePrintReportCard}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white text-xs font-semibold shadow hover:opacity-90 select-none"
                style={{ backgroundColor: accentColor }}
              >
                <Printer className="w-3.5 h-3.5" /> Direct Report Print
              </button>
              <button
                onClick={() => setIsReportOpen(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs bg-slate-900 text-white font-bold"
              >
                Dismiss View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
