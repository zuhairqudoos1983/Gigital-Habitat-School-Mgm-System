import React, { useState } from 'react';
import { 
  CreditCard, DollarSign, Download, Printer, Plus, 
  Search, ShieldAlert, X, Sparkles, Check, CheckCircle2 
} from 'lucide-react';
import { Invoice, Student } from '../types';

interface FeeModuleProps {
  invoices: Invoice[];
  students: Student[];
  onAddInvoice: (inv: Invoice) => void;
  onPayInvoice: (id: string, method: string) => void;
  accentColor: string;
}

export const FeeModule: React.FC<FeeModuleProps> = ({
  invoices,
  students,
  onAddInvoice,
  onPayInvoice,
  accentColor
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isBillDetailModalOpen, setIsBillDetailModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Payment processing modal state
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [payMethod, setPayMethod] = useState<'Cash' | 'Card' | 'Online' | 'Bank Transfer'>('Card');

  // New billing generation form states
  const [newBill, setNewBill] = useState({
    studentId: students[0]?.id || '',
    month: 'May 2026',
    baseAmount: 350,
    libraryFee: 15,
    sportsFee: 20,
    examFee: 30,
    discount: 0
  });

  const getStudentName = (sid: string) => {
    return students.find(s => s.id === sid)?.name || 'Unknown Student';
  };

  const getStudentClass = (sid: string) => {
    const s = students.find(s => s.id === sid);
    return s ? `${s.className}-${s.section}` : 'N/A';
  };

  const computeNewBillTotal = () => {
    return newBill.baseAmount + newBill.libraryFee + newBill.sportsFee + newBill.examFee - newBill.discount;
  };

  const handleGenerateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const count = invoices.length + 1;
    const generatedId = `INV-2026-${1000 + count}`;
    
    const created: Invoice = {
      id: generatedId,
      studentId: newBill.studentId,
      month: newBill.month,
      baseAmount: Number(newBill.baseAmount),
      libraryFee: Number(newBill.libraryFee),
      sportsFee: Number(newBill.sportsFee),
      examFee: Number(newBill.examFee),
      discount: Number(newBill.discount),
      totalAmount: computeNewBillTotal(),
      status: 'Unpaid',
      dueDate: '2026-06-10'
    };

    onAddInvoice(created);
    setIsInvoiceModalOpen(false);
  };

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingInvoice) return;
    onPayInvoice(payingInvoice.id, payMethod);
    setIsPayModalOpen(false);
  };

  const filteredInvoices = invoices.filter(inv => {
    const studentName = getStudentName(inv.studentId);
    const matchesSearch = studentName.toLowerCase().includes(search.toLowerCase()) || 
                          inv.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const aggregateCollected = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.totalAmount, 0);
  const aggregatePending = invoices.filter(i => i.status === 'Unpaid').reduce((sum, i) => sum + i.totalAmount, 0);

  const handlePrintBill = () => {
    const billContent = document.getElementById('bill-inner-preview')?.innerHTML;
    if (!billContent) return;

    const printWin = window.open('', '', 'height=600,width=800');
    if (!printWin) return;

    printWin.document.write('<html><head><title>Greenfield Invoice Bill</title>');
    printWin.document.write('<script src="https://cdn.tailwindcss.com"></script>');
    printWin.document.write('</head><body><div class="p-6">');
    printWin.document.write(billContent);
    printWin.document.write('</div></body></html>');
    printWin.document.close();

    setTimeout(() => {
      printWin.focus();
      printWin.print();
      printWin.close();
    }, 600);
  };

  return (
    <div id="fee-panel" className="space-y-6 animate-fade-in font-sans pb-20 text-gray-800 dark:text-gray-150">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-150 dark:border-slate-850 shadow-sm">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white uppercase">FEES & TRANSACTIONS</h1>
          <p className="text-xs text-gray-400">Generate student bills, process payments, and render invoice sheets dynamically.</p>
        </div>
        <button
          onClick={() => setIsInvoiceModalOpen(true)}
          id="btn-invoice-add"
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-white font-semibold text-xs hover:opacity-90 select-none transition-all cursor-pointer"
          style={{ backgroundColor: accentColor }}
        >
          <Plus className="w-4 h-4" /> Create Bill Invoice
        </button>
      </div>

      {/* Aggregate balance boards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-150 dark:border-slate-805 shadow-sm flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Total collected</p>
            <h3 className="text-xl font-bold font-mono text-gray-900 dark:text-white">PKR {aggregateCollected}</h3>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-150 dark:border-slate-805 shadow-sm flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Total outstanding balance</p>
            <h3 className="text-xl font-bold font-mono text-gray-900 dark:text-white">PKR {aggregatePending}</h3>
          </div>
          <div className="p-3 bg-rose-50 dark:bg-rose-955/20 text-rose-500 rounded-xl">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Account state Status</p>
            <h3 className="text-sm font-bold tracking-tight">Active Fiscal Quarter Q2</h3>
          </div>
          <CreditCard className="w-5 h-5 text-indigo-400" />
        </div>
      </div>

      {/* Roster list query rows */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex items-center gap-2 bg-white dark:bg-slate-900 px-3.5 py-1.5 rounded-xl border border-gray-150 dark:border-slate-800 shadow-sm">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search invoice by ID or student name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none text-xs text-gray-700 dark:text-white focus:outline-none w-full placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-gray-150 dark:border-slate-800 shadow-sm shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent border-none text-xs text-gray-700 dark:text-white focus:outline-none focus:ring-0 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Processed Paid</option>
            <option value="Unpaid">Unpaid Overdue</option>
          </select>
        </div>
      </div>

      {/* Main invoices lists */}
      <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 rounded-2xl shadow-md overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-155 dark:border-slate-805 text-gray-400 text-[10px] font-bold uppercase tracking-wider bg-gray-50/50 dark:bg-slate-850">
                <th className="py-4 px-6">Invoice ID</th>
                <th className="py-4 px-6">Student Name</th>
                <th className="py-4 px-6">Class Assignment</th>
                <th className="py-4 px-6">Pricing cycle</th>
                <th className="py-4 px-6">Collect charge</th>
                <th className="py-4 px-6">Balance Status</th>
                <th className="py-4 px-6 text-right">Transactions Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-gray-200">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-850 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold">{inv.id}</td>
                    <td className="py-4 px-6 font-semibold text-gray-950 dark:text-white">{getStudentName(inv.studentId)}</td>
                    <td className="py-4 px-6 text-gray-500 font-semibold">{getStudentClass(inv.studentId)}</td>
                    <td className="py-4 px-6 font-medium">{inv.month}</td>
                    <td className="py-4 px-6 font-bold font-mono text-gray-900 dark:text-white">PKR {inv.totalAmount}</td>
                    <td className="py-4 px-6">
                      <span className={`text-[9px] uppercase tracking-wide px-2.5 py-0.5 rounded-full font-bold ${
                        inv.status === 'Paid' 
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' 
                          : 'bg-rose-50 text-rose-600 dark:bg-rose-955/20'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="inline-flex gap-2">
                        {inv.status === 'Unpaid' && (
                          <button
                            onClick={() => {
                              setPayingInvoice(inv);
                              setIsPayModalOpen(true);
                            }}
                            id={`pay-btn-${inv.id}`}
                            className="text-[10px] font-bold uppercase text-emerald-600 hover:text-emerald-700 border border-emerald-555/20 px-2.5 py-1 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/10 transition-all select-none"
                          >
                            Pay Now
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setIsBillDetailModalOpen(true);
                          }}
                          id={`bill-vw-${inv.id}`}
                          className="bg-gray-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg hover:bg-gray-100 text-gray-700 dark:text-gray-200 transition-colors"
                        >
                          View Bill
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 font-bold uppercase select-none">
                    No matching invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE NEW INVOICE MODAL */}
      {isInvoiceModalOpen && (
        <div id="invoice-modal-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden font-sans animate-scale-up text-gray-800 dark:text-gray-150">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wide">Generate New Student Invoice</h3>
              <button onClick={() => setIsInvoiceModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGenerateInvoiceSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Select Student *</label>
                  <select
                    value={newBill.studentId}
                    onChange={(e) => setNewBill({ ...newBill, studentId: e.target.value })}
                    className="w-full text-xs p-3 bg-gray-50 dark:bg-slate-850 rounded-xl border border-gray-200 dark:border-slate-755 text-gray-800 dark:text-white cursor-pointer focus:outline-none"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.className})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Billing Month</label>
                  <select
                    value={newBill.month}
                    onChange={(e) => setNewBill({ ...newBill, month: e.target.value })}
                    className="w-full text-xs p-3 bg-gray-50 dark:bg-slate-850 rounded-xl border"
                  >
                    <option value="May 2026">May 2026</option>
                    <option value="June 2026">June 2026</option>
                    <option value="July 2026">July 2026</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Tuition Fee Base (PKR)</label>
                  <input
                    type="number"
                    value={newBill.baseAmount}
                    onChange={(e) => setNewBill({ ...newBill, baseAmount: Number(e.target.value) })}
                    className="w-full text-xs p-3 bg-gray-50 dark:bg-slate-850 rounded-xl border"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Library Charge (PKR)</label>
                  <input
                    type="number"
                    value={newBill.libraryFee}
                    onChange={(e) => setNewBill({ ...newBill, libraryFee: Number(e.target.value) })}
                    className="w-full text-xs p-3 bg-gray-50 dark:bg-slate-850 rounded-xl border"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Sports Entry Charge (PKR)</label>
                  <input
                    type="number"
                    value={newBill.sportsFee}
                    onChange={(e) => setNewBill({ ...newBill, sportsFee: Number(e.target.value) })}
                    className="w-full text-xs p-3 bg-gray-50 dark:bg-slate-850 rounded-xl border"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Exam Entrance Fee (PKR)</label>
                  <input
                    type="number"
                    value={newBill.examFee}
                    onChange={(e) => setNewBill({ ...newBill, examFee: Number(e.target.value) })}
                    className="w-full text-xs p-3 bg-gray-50 dark:bg-slate-850 rounded-xl border"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Scholarship Rebate / Discount (PKR)</label>
                  <input
                    type="number"
                    value={newBill.discount}
                    onChange={(e) => setNewBill({ ...newBill, discount: Number(e.target.value) })}
                    className="w-full text-xs p-3 bg-gray-50 dark:bg-slate-850 rounded-xl border text-rose-500 font-bold"
                  />
                </div>

                <div className="col-span-2 bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-[10px]">Calculated Net Invoice Total:</span>
                  <span className="font-mono text-base font-bold text-emerald-600">PKR {computeNewBillTotal()}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs bg-gray-100 text-slate-705 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white text-xs font-semibold select-none shadow hover:opacity-90"
                  style={{ backgroundColor: accentColor }}
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BILL DETAILS SCREEN INTERFACE MODAL */}
      {isBillDetailModalOpen && selectedInvoice && (
        <div id="bill-detail-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-155 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-5 text-slate-800 text-left relative font-sans">
            
            <button 
              onClick={() => setIsBillDetailModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Bill Preview Area to printing */}
            <div id="bill-inner-preview" className="space-y-4 text-xs font-medium text-slate-700 p-2">
              <div className="border-b border-slate-100 pb-3.5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase">GREENFIELD INTERNATIONAL SCHOOL</h3>
                  <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Official Bill statement</p>
                </div>
                <span className="p-2.5 bg-indigo-600 text-white rounded-xl text-lg font-bold">G</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] uppercase font-bold text-zinc-400">Charged To Student</span>
                  <p className="font-bold text-indigo-950 text-sm mt-0.5">{getStudentName(selectedInvoice.studentId)}</p>
                  <p className="text-[10px] text-zinc-500 font-medium">Grade Class: {getStudentClass(selectedInvoice.studentId)}</p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase font-bold text-zinc-400">Invoice Reference</span>
                  <p className="font-bold text-zinc-900 mt-0.5">{selectedInvoice.id}</p>
                  <p className="text-[10px] text-zinc-500 font-semibold mt-1">Due: {selectedInvoice.dueDate}</p>
                </div>
              </div>

              <div className="border-t border-b border-slate-100 py-3.5 space-y-2">
                <div className="flex justify-between">
                  <span>Standard Tuition Fee</span>
                  <span className="font-mono text-zinc-900 font-bold">PKR {selectedInvoice.baseAmount}.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Library Facility access</span>
                  <span className="font-mono text-zinc-900 font-bold">PKR {selectedInvoice.libraryFee}.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sports arena clearance</span>
                  <span className="font-mono text-zinc-900 font-bold">PKR {selectedInvoice.sportsFee}.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Curriculum examination marks entry fee</span>
                  <span className="font-mono text-zinc-900 font-bold">PKR {selectedInvoice.examFee}.00</span>
                </div>
                {selectedInvoice.discount > 0 && (
                  <div className="flex justify-between text-rose-500 font-bold">
                    <span>Scholarship deduction discount (-)</span>
                    <span className="font-mono">-PKR {selectedInvoice.discount}.00</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg">
                <span className="font-bold uppercase tracking-wide text-zinc-500 text-[10px]">Net grand total</span>
                <span className="font-mono text-emerald-600 font-bold text-sm">PKR {selectedInvoice.totalAmount}.00</span>
              </div>

              {/* Status footer with method */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-[9px] uppercase font-bold text-zinc-400">Invoices status</span>
                  <p className="font-bold uppercase mt-0.5" style={{ color: selectedInvoice.status === 'Paid' ? '#10b981' : '#f43f5e' }}>
                    ● {selectedInvoice.status}
                  </p>
                </div>
                {selectedInvoice.status === 'Paid' && (
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-bold text-zinc-400">Cleared via</span>
                    <p className="font-semibold text-zinc-600">{selectedInvoice.paymentMethod || 'Cash'}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-155 dark:border-slate-805 flex justify-end gap-2 mt-4">
              <button
                onClick={handlePrintBill}
                className="flex items-center gap-1 px-4 py-2 bg-indigo-50 dark:bg-slate-800 text-indigo-650 dark:text-gray-200 rounded-xl text-xs font-bold"
              >
                <Printer className="w-3.5 h-3.5" /> Printable Invoice
              </button>
              <button
                onClick={() => setIsBillDetailModalOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAY ACTION MODAL FORM */}
      {isPayModalOpen && payingInvoice && (
        <div id="payment-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl max-w-sm w-full p-5 text-gray-800 dark:text-gray-150 relative font-sans animate-scale-up">
            <h3 className="text-sm font-bold uppercase tracking-wide border-b border-gray-100 pb-3.5 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" /> Confirm Clear Payment
            </h3>

            <p className="text-xs font-medium mb-3.5 leading-normal">
              You are recording fee clearance for student **{getStudentName(payingInvoice.studentId)}** for the billing month of **{payingInvoice.month}**.
            </p>

            <form onSubmit={handlePaySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full text-xs p-3 bg-gray-50 dark:bg-slate-850 rounded-xl border border-gray-200 cursor-pointer text-gray-805 dark:text-white"
                >
                  <option value="Card">Debit/Credit Card</option>
                  <option value="Online">Online Banking Portal</option>
                  <option value="Cash">Cash at Campus Counter</option>
                  <option value="Bank Transfer">Bank Wire Transfer</option>
                </select>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-xl border flex items-center justify-between font-bold">
                <span className="text-[10px] uppercase text-emerald-600">Total Charged Amount</span>
                <span className="font-mono text-emerald-600">PKR {payingInvoice.totalAmount}</span>
              </div>

              <div className="pt-3.5 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-200 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white rounded-xl text-xs font-semibold shadow hover:opacity-90 transition-opacity flex items-center gap-1.5"
                  style={{ backgroundColor: accentColor }}
                >
                  <Check className="w-4 h-4" /> Process Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
