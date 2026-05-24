import React, { useState } from 'react';
import { 
  BookOpen, Plus, Search, BookMarked, RefreshCcw, 
  Trash2, X, GraduationCap, CheckCircle2, AlertTriangle 
} from 'lucide-react';
import { Book, BookIssueRecord, Student } from '../types';

interface LibraryModuleProps {
  books: Book[];
  issues: BookIssueRecord[];
  students: Student[];
  onAddBook: (book: Book) => void;
  onIssueBook: (rec: BookIssueRecord) => void;
  onReturnBook: (id: string) => void;
  accentColor: string;
}

export const LibraryModule: React.FC<LibraryModuleProps> = ({
  books,
  issues,
  students,
  onAddBook,
  onIssueBook,
  onReturnBook,
  accentColor
}) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'catalogue' | 'issued'>('catalogue');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  // New Book Form
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Mathematics',
    quantity: 5
  });

  // Issue Book Form
  const [issueForm, setIssueForm] = useState({
    bookId: books[0]?.id || '',
    studentId: students[0]?.id || '',
    dueDate: '2026-06-07' // 14 days standard default
  });

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookForm.title || !bookForm.author) return;

    const count = books.length + 1;
    const created: Book = {
      id: `BOK-${String(count).padStart(3, '0')}`,
      title: bookForm.title,
      author: bookForm.author,
      isbn: bookForm.isbn || String(9781000000000 + count),
      category: bookForm.category,
      quantity: Number(bookForm.quantity),
      available: Number(bookForm.quantity)
    };
    onAddBook(created);
    setIsBookModalOpen(false);
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const count = issues.length + 1;
    const createdIssue: BookIssueRecord = {
      id: `ISS-${String(count).padStart(3, '0')}`,
      bookId: issueForm.bookId,
      studentId: issueForm.studentId,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: issueForm.dueDate,
      status: 'Issued'
    };
    onIssueBook(createdIssue);
    setIsIssueModalOpen(false);
  };

  const getStudentName = (sid: string) => {
    return students.find(s => s.id === sid)?.name || 'Unknown Student';
  };

  const getBookTitle = (bid: string) => {
    return books.find(b => b.id === bid)?.title || 'Unknown Book';
  };

  const getBookCategory = (bid: string) => {
    return books.find(b => b.id === bid)?.category || 'General';
  };

  const filteredBooks = books.filter(b => {
    return b.title.toLowerCase().includes(search.toLowerCase()) || 
           b.author.toLowerCase().includes(search.toLowerCase()) || 
           b.category.toLowerCase().includes(search.toLowerCase());
  });

  const totalQty = books.reduce((sum, b) => sum + b.quantity, 0);
  const totalAvail = books.reduce((sum, b) => sum + b.available, 0);

  return (
    <div id="library-dashboard" className="space-y-6 animate-fade-in font-sans pb-20 text-gray-800 dark:text-gray-150">
      
      {/* Header operations */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-150 dark:border-slate-850 shadow-sm">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white uppercase font-sans">CAMPUS LIBRARY</h1>
          <p className="text-xs text-gray-400">Add materials to digital catalogue, track active card issues, and check library dues.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsBookModalOpen(true)}
            id="btn-book-add"
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-white font-semibold text-xs transition-colors hover:scale-[1.01]"
            style={{ backgroundColor: accentColor }}
          >
            + Add New Book
          </button>
          <button
            onClick={() => {
              if (books.length > 0) {
                setIssueForm({ ...issueForm, bookId: books[0].id });
              }
              setIsIssueModalOpen(true);
            }}
            id="btn-book-issue"
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-455/10 rounded-xl text-xs font-semibold select-none transition-colors"
          >
            Issue Book
          </button>
        </div>
      </div>

      {/* Aggregate balance board */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-150 dark:border-slate-805 shadow-sm flex items-center justify-between group">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1 shadow-none">Catalogue Items</p>
            <h3 className="text-base font-bold text-gray-905">{books.length} Unique Titles</h3>
          </div>
          <BookOpen className="w-5 h-5 text-indigo-505" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-150 dark:border-slate-805 shadow-sm flex items-center justify-between group">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1 shadow-none">Total Units</p>
            <h3 className="text-base font-bold text-gray-905">{totalQty} Books</h3>
          </div>
          <BookMarked className="w-5 h-5 text-emerald-505" />
        </div>

        <div className="bg-slate-900 text-white p-4 rounded-xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1 border-none shadow-none">Copies Available</p>
            <h3 className="text-base font-bold">{totalAvail} units</h3>
          </div>
          <span className="text-xs bg-indigo-650 px-2 py-1 rounded">Active Circ</span>
        </div>
      </div>

      {/* Roster tab filters */}
      <div className="flex border-b border-gray-150 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('catalogue')}
          className={`px-5 py-3 text-xs font-semibold select-none leading-none border-b-2 transition-colors ${
            activeTab === 'catalogue' 
              ? 'border-indigo-600 text-indigo-600 dark:text-white bg-slate-50/50' 
              : 'border-transparent text-gray-400'
          }`}
        >
          Book Catalogue Repository
        </button>
        <button
          onClick={() => setActiveTab('issued')}
          className={`px-5 py-3 text-xs font-semibold select-none leading-none border-b-2 transition-colors ${
            activeTab === 'issued' 
              ? 'border-indigo-600 text-indigo-600 dark:text-white bg-slate-50/50' 
              : 'border-transparent text-gray-400'
          }`}
        >
          Active Card Issues logs
        </button>
      </div>

      {/* Grid: Search and table lists */}
      {activeTab === 'catalogue' ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3.5 py-1.5 rounded-xl border border-gray-150 dark:border-slate-800 shadow-sm max-w-sm w-full">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search catalogue by title, category, author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none text-xs text-gray-700 dark:text-white focus:outline-none w-full placeholder:text-gray-400"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 shadow-md rounded-2xl overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-150 dark:border-slate-805 text-gray-400 text-[10px] font-bold uppercase tracking-wider bg-gray-50/50 dark:bg-slate-850">
                    <th className="py-4 px-6">Book Reference ID</th>
                    <th className="py-4 px-6">Book Title & Author</th>
                    <th className="py-4 px-6">Category Classification</th>
                    <th className="py-4 px-6">ISBN Core</th>
                    <th className="py-4 px-6">Copies Stock</th>
                    <th className="py-4 px-6 text-right">Circulation status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-850 text-xs">
                  {filteredBooks.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-850 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-gray-400">{b.id}</td>
                      <td className="py-4 px-6">
                        <p className="font-semibold text-gray-900 dark:text-white">{b.title}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5 leading-none">By: {b.author}</p>
                      </td>
                      <td className="py-4 px-6 text-indigo-600 dark:text-indigo-400 font-semibold">{b.category}</td>
                      <td className="py-4 px-6 font-mono text-gray-400">{b.isbn}</td>
                      <td className="py-4 px-6 font-bold">{b.available} / {b.quantity} Available</td>
                      <td className="py-4 px-6 text-right">
                        <span className={`text-[9px] uppercase tracking-wide px-2.5 py-0.5 rounded-full font-bold inline-block ${
                          b.available > 0 
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' 
                            : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20'
                        }`}>
                          {b.available > 0 ? 'Copies Available' : 'Out Of Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 shadow-md rounded-2xl overflow-hidden animate-fade-in text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-150 dark:border-slate-805 text-gray-400 text-[10px] font-bold uppercase tracking-wider bg-gray-50/50 dark:bg-slate-850">
                  <th className="py-4 px-6">Issue ID</th>
                  <th className="py-4 px-6">Enrolled Student Card</th>
                  <th className="py-4 px-6">Issued Book Item</th>
                  <th className="py-4 px-6">Issue Date</th>
                  <th className="py-4 px-6">Due Date Return</th>
                  <th className="py-4 px-6">Current Return State</th>
                  <th className="py-4 px-6 text-right">Card Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-850 text-slate-705 dark:text-gray-200 font-medium">
                {issues.map((iss) => (
                  <tr key={iss.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-850">
                    <td className="py-4 px-6 font-mono font-bold text-gray-400">{iss.id}</td>
                    <td className="py-4 px-6 font-semibold text-gray-905 dark:text-white">{getStudentName(iss.studentId)}</td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-gray-900 dark:text-white leading-tight">{getBookTitle(iss.bookId)}</p>
                      <p className="text-[9px] text-zinc-400 mt-1 uppercase tracking-wide leading-none">{getBookCategory(iss.bookId)}</p>
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-gray-500">{iss.issueDate}</td>
                    <td className="py-4 px-6 font-mono font-bold text-gray-500">{iss.dueDate}</td>
                    <td className="py-4 px-6">
                      <span className={`text-[9px] uppercase tracking-wide px-2.5 py-0.5 rounded-full font-bold ${
                        iss.status === 'Returned' 
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' 
                          : 'bg-amber-50 text-amber-600 dark:bg-amber-950/20'
                      }`}>
                        {iss.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      {iss.status === 'Issued' && (
                        <button
                          onClick={() => onReturnBook(iss.id)}
                          id={`issue-return-${iss.id}`}
                          className="text-[10px] font-bold uppercase text-indigo-505 border border-indigo-400/20 px-2.5 py-1 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          Mark Returned
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* NEW MATERIAL CATALOGUE ADD MODAL */}
      {isBookModalOpen && (
        <div id="book-modal-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden font-sans animate-scale-up text-xs">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wide">Record New Catalogue Book</h3>
              <button onClick={() => setIsBookModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBook} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase">Book Title *</label>
                <input
                  type="text"
                  required
                  value={bookForm.title}
                  onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 rounded text-gray-805"
                  placeholder="e.g. Clean Code Principles"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase">Author Name *</label>
                <input
                  type="text"
                  required
                  value={bookForm.author}
                  onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 rounded text-gray-850"
                  placeholder="e.g. Robert C. Martin"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase">Category Class</label>
                <select
                  value={bookForm.category}
                  onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 rounded text-gray-805 cursor-pointer"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics / Cosmology">Physics / Cosmology</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Literature">Literature</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase">Book ISBN Core</label>
                <input
                  type="text"
                  value={bookForm.isbn}
                  onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 rounded"
                  placeholder="e.g. 978-0132350884"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase">Quantity Copies *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={bookForm.quantity}
                  onChange={(e) => setBookForm({ ...bookForm, quantity: Number(e.target.value) })}
                  className="w-full p-2.5 bg-gray-50 rounded"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 rounded font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white font-semibold rounded"
                  style={{ backgroundColor: accentColor }}
                >
                  Catalog Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ISSUE BOOK FORM ACTION MODAL */}
      {isIssueModalOpen && (
        <div id="issue-modal-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-155 dark:border-slate-800 rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden font-sans animate-scale-up text-xs">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wide">Issue Catalogue Material</h3>
              <button onClick={() => setIsIssueModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleIssueSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase">Select Book Title *</label>
                <select
                  value={issueForm.bookId}
                  onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 rounded text-gray-805 cursor-pointer"
                >
                  {books.filter(b => b.available > 0).map(b => (
                    <option key={b.id} value={b.id}>{b.title} ({b.available} Unit Avail)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase">Select Student Candidate *</label>
                <select
                  value={issueForm.studentId}
                  onChange={(e) => setIssueForm({ ...issueForm, studentId: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 rounded text-gray-805 cursor-pointer"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase">Due Return Date</label>
                <input
                  type="date"
                  value={issueForm.dueDate}
                  onChange={(e) => setIssueForm({ ...issueForm, dueDate: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 rounded cursor-pointer text-gray-805"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 rounded font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white font-semibold rounded"
                  style={{ backgroundColor: accentColor }}
                >
                  Issue Card Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
