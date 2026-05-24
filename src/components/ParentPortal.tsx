import React from 'react';
import { 
  Users, BookOpen, Clock, FileCheck, CheckCircle2, 
  CreditCard, Award, Printer, ShieldAlert 
} from 'lucide-react';
import { Student, Invoice, MarksRecord, Exam } from '../types';

interface ParentPortalProps {
  students: Student[];
  invoices: Invoice[];
  marks: MarksRecord[];
  exams: Exam[];
  accentColor: string;
  onPayInvoice: (id: string, method: string) => void;
  onTriggerToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({
  students,
  invoices,
  marks,
  exams,
  accentColor,
  onPayInvoice,
  onTriggerToast
}) => {
  // Let's assume the logged-in parent is connected to standard student "STU-2026-001" (Noah Mitchell)
  const childrenId = "STU-2026-001";
  const child = students.find(s => s.id === childrenId);
  const childInvoices = invoices.filter(i => i.studentId === childrenId);
  const childMarks = marks.filter(m => m.studentId === childrenId);

  const getExamTitle = (eid: string) => {
    return exams.find(e => e.id === eid)?.name || 'Term Exam Assessment';
  };

  const calculateGrade = (score: number) => {
    if (score >= 90) return { letter: 'A+', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' };
    if (score >= 80) return { letter: 'A', color: 'text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20' };
    if (score >= 70) return { letter: 'B', color: 'text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20' };
    if (score >= 60) return { letter: 'C', color: 'text-amber-500 bg-amber-50 dark:bg-amber-955/20' };
    return { letter: 'D', color: 'text-rose-500 bg-rose-50 dark:bg-rose-955/20' };
  };

  const handleOnlinePay = (invId: string) => {
    onPayInvoice(invId, 'Online Card Portal');
    onTriggerToast(`Cleared tuition dues for Invoice ${invId} successfully!`, 'success');
  };

  return (
    <div id="parent-portal-dashboard" className="space-y-6 animate-fade-in font-sans pb-20 text-gray-800 dark:text-gray-150">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl border border-slate-800 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <span className="text-[9px] uppercase tracking-widest text-indigo-300 font-extrabold px-2.5 py-0.5 rounded bg-white/10">Guardian Gateway Portal</span>
          <h1 className="text-lg font-bold">Welcome Back, Mitchell Representative!</h1>
          <p className="text-xs text-indigo-200">Track Mitchell's real-time campus performance, term grade boards, and clearance bills.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600/50 flex items-center justify-center font-bold border border-white/20 shadow">
            M
          </div>
          <div>
            <p className="text-xs font-bold leading-none">Mitchell Guardian</p>
            <p className="text-[10px] text-gray-400 mt-1 font-semibold leading-none">ID: PAR-2026-905</p>
          </div>
        </div>
      </div>

      {child ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Child Profile summary & stats */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 shadow-sm p-5 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">Mitchell Enrolled Member</h3>
              
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-slate-850 mx-auto flex items-center justify-center text-xl font-bold border shadow">
                  {child.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-905 dark:text-white leading-none">{child.name}</h4>
                  <p className="text-[10px] text-gray-405 font-mono mt-1.5 font-bold">Registration Ref: {child.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center border-t border-gray-50 dark:border-slate-805 pt-4">
                <div className="p-3 bg-gray-50 dark:bg-slate-850/50 rounded-xl leading-none">
                  <p className="text-xs font-black text-gray-900 dark:text-white">{child.className} - {child.section}</p>
                  <p className="text-[9px] text-gray-400 uppercase font-bold mt-1 shadow-none">Class Assignment</p>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl leading-none">
                  <p className="text-xs font-black text-emerald-600 dark:text-emerald-450">94.3%</p>
                  <p className="text-[9px] text-emerald-600 uppercase font-bold mt-1 shadow-none">Attendance Rate</p>
                </div>
              </div>
            </div>

            {/* Quick school calendar events */}
            <div className="bg-white dark:bg-slate-900 border border-gray-155 dark:border-slate-850 p-5 rounded-2xl shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">Upcoming Schedule Events</h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/10 border-l-4 border-indigo-600 rounded">
                  <p className="font-bold">Quarterly Parent-Teacher Meeting</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">May 28, 2026 @ 02:00 PM</p>
                </div>
                <div className="p-3 bg-amber-50/50 dark:bg-amber-955/10 border-l-4 border-amber-500 rounded">
                  <p className="font-bold">Term Math Competition Trials</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">June 04, 2026 @ 10:00 AM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Child active Exam scores card panels */}
          <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 shadow-sm rounded-2xl p-5 space-y-4 lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wide border-b pb-3 flex items-center gap-1.5 text-gray-900 dark:text-white">
              <Award className="w-5 h-5 text-indigo-555" />
              Comprehensive Academic Assessment Results
            </h3>

            <div className="divide-y divide-gray-100 dark:divide-slate-855">
              {childMarks.length > 0 ? (
                childMarks.map((m, idx) => {
                  const gradeInfo = calculateGrade(m.marksObtained);
                  return (
                    <div key={idx} className="py-3.5 flex items-center justify-between hover:bg-gray-50/30 transition-colors">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-gray-900 dark:text-white">{getExamTitle(m.examId)}</p>
                        <p className="text-[10px] text-gray-400 italic">Faculty notes: "{m.remarks || 'Outstanding dedication'}"</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-xs">{m.marksObtained} % Marks</span>
                        <span className={`p-1.5 px-3 rounded-lg text-[10px] font-extrabold ${gradeInfo.color}`}>
                          Grade {gradeInfo.letter}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-gray-400 font-bold uppercase">No examinations grades registered for your child.</div>
              )}
            </div>

            {/* Quick fee invoices clearance list inside cards */}
            <div className="pt-5 border-t border-gray-100 dark:border-slate-855 space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none flex items-center gap-1">
                <CreditCard className="w-4 h-4 text-emerald-500" />
                Dues Account & Fee Invoices
              </h3>

              <div className="space-y-3">
                {childInvoices.map((inv) => (
                  <div 
                    key={inv.id} 
                    className="p-4 bg-gray-50/50 dark:bg-slate-850/50 border border-gray-150 dark:border-slate-845 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black">{inv.id}</span>
                        <span className="text-[10px] font-semibold text-gray-400">({inv.month})</span>
                      </div>
                      <p className="text-[11px] font-bold text-emerald-600 mt-1">Total Fee Invoice: PKR {inv.totalAmount}</p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' : 'bg-rose-50 text-rose-600 dark:bg-rose-955/20'
                      }`}>
                        {inv.status}
                      </span>

                      {inv.status === 'Unpaid' && (
                        <button
                          onClick={() => handleOnlinePay(inv.id)}
                          id={`parent-pay-btn-${inv.id}`}
                          className="px-3 py-1.5 text-white font-bold rounded-lg text-xs hover:opacity-90 transition-opacity flex items-center gap-1 shadow-sm select-none"
                          style={{ backgroundColor: accentColor }}
                        >
                          Clear Dues Now
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="py-16 text-center text-gray-400 font-semibold uppercase">Mitchel Child records missing. Please configure main students db.</div>
      )}

    </div>
  );
};
