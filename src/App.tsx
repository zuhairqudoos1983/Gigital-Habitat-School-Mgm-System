import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { ToastContainer, ToastType } from './components/Toast';
import { DashboardView } from './components/DashboardView';
import { StudentModule } from './components/StudentModule';
import { TeacherModule } from './components/TeacherModule';
import { AttendanceModule } from './components/AttendanceModule';
import { FeeModule } from './components/FeeModule';
import { ExamModule } from './components/ExamModule';
import { AcademicModule } from './components/AcademicModule';
import { LibraryModule } from './components/LibraryModule';
import { ParentPortal } from './components/ParentPortal';
import { SettingsView } from './components/SettingsView';
import { ChatbotWidget } from './components/ChatbotWidget';
import { UserRole, Student, Teacher, Invoice, Exam, MarksRecord, TimetableEntry, Book, BookIssueRecord, Announcement, ClassSection } from './types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_TEACHERS, 
  INITIAL_CLASSES, 
  INITIAL_TIMETABLE, 
  INITIAL_EXAMS, 
  INITIAL_MARKS, 
  INITIAL_INVOICES, 
  INITIAL_BOOKS, 
  INITIAL_BOOK_ISSUES, 
  INITIAL_ANNOUNCEMENTS 
} from './mockData';

// Multi-language Translation definitions
const TRANSLATIONS = {
  en: {
    dashboard: 'Dashboard Hub',
    students: 'Student Roster',
    teachers: 'Faculty List',
    attendance: 'Attendance Track',
    fees: 'Clearance Fees',
    exams: 'Exams & GPA',
    academic: 'Timetables',
    library: 'Library Deck',
    parentPortal: 'Parent Portal',
    settings: 'Settings Config',
    searchPlaceholder: 'Search campus rosters, invoice IDs, books, grades...',
    allRoles: 'Choose Simulator Role',
    welcome: 'Welcome back',
    schoolName: 'Digital Habitat School MGM System',
    totalStudents: 'Total Registered Students',
    totalTeachers: 'Active Core Faculty',
    attendanceRate: 'Daily Attendance Rate',
    feeCollection: 'Fee Collection State',
    cashflowReport: 'Fiscal Budget Inbound',
    gpaCurve: 'Course Grade Performance',
    recentActivity: 'Core Security Activity log',
    calendar: 'Campus Scheduler',
    announcements: 'Board Announcements'
  },
  ur: {
    dashboard: 'ڈیش بورڈ مرکز',
    students: 'طلباء مینیجر',
    teachers: 'اساتذہ کی فہرست',
    attendance: 'حاضری ریکارڈ',
    fees: 'فیس اور انوائس',
    exams: 'امتحانات اور نتائج',
    academic: 'ٹائم ٹیبلز',
    library: 'لائبریری کیٹلاگ',
    parentPortal: 'سرپرست پورٹل',
    settings: 'سسٹم تبدیلیاں',
    searchPlaceholder: 'انوائس، رول نمبر، لائبریری تلاش کریں...',
    allRoles: 'رول کا انتخاب کریں',
    welcome: 'خوش آمدید',
    schoolName: 'ڈیجیٹل ہیبی ٹیٹ اسکول مینجمنٹ سسٹم',
    totalStudents: 'کل رجسٹرڈ طلباء',
    totalTeachers: 'فعال اساتذہ',
    attendanceRate: 'روزانہ حاضری کی شرح',
    feeCollection: 'فیسوں کا مجموعہ',
    cashflowReport: 'ماہانہ مالیات',
    gpaCurve: 'تعلیمی درجہ بندی',
    recentActivity: 'حالیہ سرگرمیاں لاگ',
    calendar: 'اسکول کیلنڈر',
    announcements: 'اعلانات بورڈ'
  },
  ar: {
    dashboard: 'لوحة التحكم',
    students: 'إدارة الطلاب',
    teachers: 'هيئة التدريس',
    attendance: 'سجل الحضور',
    fees: 'الرسوم والفواتير',
    exams: 'الامتحانات والنتائج',
    academic: 'الجداول الزمنية',
    library: 'مكتبة الحرم الدراسي',
    parentPortal: 'بوابة أولياء الأمور',
    settings: 'إعدادات النظام',
    searchPlaceholder: 'ابحث عن فواتير، طلاب، كتب، كشوف...',
    allRoles: 'اختر دور المحاكي',
    welcome: 'مرحباً بك',
    schoolName: 'نظام إدارة مدرسة الموئل الرقمي',
    totalStudents: 'إجمالي الطلاب المسجلين',
    totalTeachers: 'أعضاء هيئة التدريس',
    attendanceRate: 'معدل الحضور اليومي',
    feeCollection: 'معدل تحصيل الرسوم',
    cashflowReport: 'الميزانية المالية الشهرية',
    gpaCurve: 'منحنى الأداء الدراسي',
    recentActivity: 'سجل الأنشطة الأخيرة',
    calendar: 'التقويم المدرسي',
    announcements: 'لوحة الإعلانات الرسمية'
  }
};

export default function App() {
  // Base State Managers
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [language, setLanguage] = useState<'en' | 'ur' | 'ar'>('en');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [accentColor, setAccentColor] = useState<string>('#4f46e5');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  
  // Database State lists (simulating local persistence storage)
  const [studentsList, setStudentsList] = useState<Student[]>(() => {
    const saved = localStorage.getItem('gis_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [teachersList, setTeachersList] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('gis_teachers');
    return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
  });

  const [invoicesList, setInvoicesList] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('gis_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [examsList, setExamsList] = useState<Exam[]>(() => {
    const saved = localStorage.getItem('gis_exams');
    return saved ? JSON.parse(saved) : INITIAL_EXAMS;
  });

  const [marksList, setMarksList] = useState<MarksRecord[]>(() => {
    const saved = localStorage.getItem('gis_marks');
    return saved ? JSON.parse(saved) : INITIAL_MARKS;
  });

  const [timetableList, setTimetableList] = useState<TimetableEntry[]>(() => {
    const saved = localStorage.getItem('gis_timetable');
    return saved ? JSON.parse(saved) : INITIAL_TIMETABLE;
  });

  const [booksList, setBooksList] = useState<Book[]>(() => {
    const saved = localStorage.getItem('gis_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [bookIssuesList, setBookIssuesList] = useState<BookIssueRecord[]>(() => {
    const saved = localStorage.getItem('gis_book_issues');
    return saved ? JSON.parse(saved) : INITIAL_BOOK_ISSUES;
  });

  const [announcementsList, setAnnouncementsList] = useState<Announcement[]>(() => {
    return INITIAL_ANNOUNCEMENTS;
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastType[]>([]);

  // Trigger Toast helper
  const triggerToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('gis_students', JSON.stringify(studentsList));
  }, [studentsList]);

  useEffect(() => {
    localStorage.setItem('gis_teachers', JSON.stringify(teachersList));
  }, [teachersList]);

  useEffect(() => {
    localStorage.setItem('gis_invoices', JSON.stringify(invoicesList));
  }, [invoicesList]);

  useEffect(() => {
    localStorage.setItem('gis_exams', JSON.stringify(examsList));
  }, [examsList]);

  useEffect(() => {
    localStorage.setItem('gis_marks', JSON.stringify(marksList));
  }, [marksList]);

  useEffect(() => {
    localStorage.setItem('gis_timetable', JSON.stringify(timetableList));
  }, [timetableList]);

  useEffect(() => {
    localStorage.setItem('gis_books', JSON.stringify(booksList));
  }, [booksList]);

  useEffect(() => {
    localStorage.setItem('gis_book_issues', JSON.stringify(bookIssuesList));
  }, [bookIssuesList]);

  // Handle HTML document body themes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Adjust routing to respect role based tab layouts
  useEffect(() => {
    if (userRole === 'parent' && currentTab !== 'dashboard' && currentTab !== 'parentPortal' && currentTab !== 'settings' && currentTab !== 'academic' && currentTab !== 'library') {
      setCurrentTab('parentPortal');
    } else if (userRole === 'admin' && currentTab === 'parentPortal') {
      setCurrentTab('dashboard');
    } else if (userRole === 'student' && currentTab !== 'dashboard' && currentTab !== 'academic' && currentTab !== 'library' && currentTab !== 'settings') {
      setCurrentTab('academic');
    }
  }, [userRole]);

  // CRUD handlers
  const handleAddStudent = (newStd: Student) => {
    setStudentsList(prev => [...prev, newStd]);
    triggerToast(`Recorded student "${newStd.name}" admission rule successfully!`, 'success');
  };

  const handleEditStudent = (updatedStd: Student) => {
    setStudentsList(prev => prev.map(s => s.id === updatedStd.id ? updatedStd : s));
    triggerToast(`Adjusted student entry rules for "${updatedStd.name}"!`, 'info');
  };

  const handleDeleteStudent = (id: string) => {
    setStudentsList(prev => prev.filter(s => s.id !== id));
    triggerToast(`Student entry ID ${id} deleted context successfully!`, 'success');
  };

  const handleAddTeacher = (newTch: Teacher) => {
    setTeachersList(prev => [...prev, newTch]);
    triggerToast(`Registered faculty entry "${newTch.name}" successfully!`, 'success');
  };

  const handleEditTeacher = (updatedTch: Teacher) => {
    setTeachersList(prev => prev.map(t => t.id === updatedTch.id ? updatedTch : t));
    triggerToast(`Adjusted faculty entry details for "${updatedTch.name}"!`, 'info');
  };

  const handleDeleteTeacher = (id: string) => {
    setTeachersList(prev => prev.filter(t => t.id !== id));
    triggerToast(`Faculty member code ${id} removed successfully!`, 'success');
  };

  const handleAddInvoice = (newInv: Invoice) => {
    setInvoicesList(prev => [...prev, newInv]);
    triggerToast(`Recorded outstanding fee invoice ID ${newInv.id}!`, 'success');
  };

  const handlePayInvoice = (id: string, method: string) => {
    setInvoicesList(prev => prev.map(i => {
      if (i.id === id) {
        return {
          ...i,
          status: 'Paid',
          paymentDate: new Date().toISOString().split('T')[0],
          paymentMethod: method
        };
      }
      return i;
    }));
    triggerToast(`Cleared transaction fee invoice ${id} via ${method}!`, 'success');
  };

  const handleAddExam = (newEx: Exam) => {
    setExamsList(prev => [...prev, newEx]);
    triggerToast(`Curriculum Exam scheduled "${newEx.name}" on ${newEx.date}!`, 'success');
  };

  const handleAddMarks = (mrk: MarksRecord) => {
    // Upsert behavior
    setMarksList(prev => {
      const existing = prev.find(m => m.examId === mrk.examId && m.studentId === mrk.studentId);
      if (existing) {
        return prev.map(m => (m.examId === mrk.examId && m.studentId === mrk.studentId) ? { ...m, marksObtained: mrk.marksObtained, remarks: mrk.remarks } : m);
      } else {
        return [...prev, mrk];
      }
    });
    triggerToast(`Grade book scores saved!`, 'success');
  };

  const handleAddTimetableEntry = (newEntry: TimetableEntry) => {
    setTimetableList(prev => [...prev, newEntry]);
    triggerToast(`New timetable period added!`, 'success');
  };

  const handleDeleteTimetableEntry = (id: string) => {
    setTimetableList(prev => prev.filter(t => t.id !== id));
    triggerToast(`Period slot removed!`, 'info');
  };

  const handleAddBook = (newBk: Book) => {
    setBooksList(prev => [...prev, newBk]);
    triggerToast(`Recorded and cataloged book "${newBk.title}" in library deck!`, 'success');
  };

  const handleIssueBook = (newIssue: BookIssueRecord) => {
    setBookIssuesList(prev => [...prev, newIssue]);
    // decrement availability
    setBooksList(prev => prev.map(b => b.id === newIssue.bookId ? { ...b, available: Math.max(0, b.available - 1) } : b));
    triggerToast(`Material issued to Student Card!`, 'success');
  };

  const handleReturnBook = (id: string) => {
    let targetBookId = '';
    setBookIssuesList(prev => prev.map(iss => {
      if (iss.id === id) {
        targetBookId = iss.bookId;
        return {
          ...iss,
          status: 'Returned',
          returnDate: new Date().toISOString().split('T')[0]
        };
      }
      return iss;
    }));
    if (targetBookId) {
      setBooksList(prev => prev.map(b => b.id === targetBookId ? { ...b, available: Math.min(b.quantity, b.available + 1) } : b));
    }
    triggerToast(`Recorded library material return safely!`, 'success');
  };

  const handleResetData = () => {
    setStudentsList(INITIAL_STUDENTS);
    setTeachersList(INITIAL_TEACHERS);
    setInvoicesList(INITIAL_INVOICES);
    setExamsList(INITIAL_EXAMS);
    setMarksList(INITIAL_MARKS);
    setTimetableList(INITIAL_TIMETABLE);
    setBooksList(INITIAL_BOOKS);
    setBookIssuesList(INITIAL_BOOK_ISSUES);
    triggerToast('All simulation databases restored to default datasets!', 'info');
  };

  // Determine global search actions
  const handleGlobalSearch = (query: string) => {
    if (!query) return;
    triggerToast(`Scanning Campus databases for: "${query}"`, 'info');
  };

  // Select RTL setting
  const isRtl = language === 'ur' || language === 'ar';
  const translationsMap = TRANSLATIONS[language];

  return (
    <div 
      id="root-portal-view" 
      dir={isRtl ? 'rtl' : 'ltr'} 
      className={`min-h-screen flex bg-transparent transition-colors`}
    >
      {/* Toast popup overlays */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Main Sidebar (Role Filtering inside) */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
        userRole={userRole} 
        translations={translationsMap} 
        accentColor={accentColor} 
      />

      {/* Primary Gateway Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <Navbar 
          onSearch={handleGlobalSearch} 
          userRole={userRole} 
          setUserRole={setUserRole} 
          language={language} 
          setLanguage={setLanguage} 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          translations={translationsMap} 
          accentColor={accentColor} 
          triggerNotificationPanel={() => triggerToast("All announcements are active on dashboard card slots.", "info")} 
          unreadNotifications={1} 
        />

        {/* Scrollable content container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          
          {currentTab === 'dashboard' && (
            <DashboardView 
              students={studentsList} 
              teachers={teachersList} 
              invoices={invoicesList} 
              announcements={announcementsList} 
              translations={translationsMap} 
              accentColor={accentColor} 
              onNavigate={setCurrentTab} 
            />
          )}

          {currentTab === 'students' && (
            <StudentModule 
              students={studentsList} 
              onAddStudent={handleAddStudent} 
              onEditStudent={handleEditStudent} 
              onDeleteStudent={handleDeleteStudent} 
              accentColor={accentColor} 
            />
          )}

          {currentTab === 'teachers' && (
            <TeacherModule 
              teachers={teachersList} 
              onAddTeacher={handleAddTeacher} 
              onEditTeacher={handleEditTeacher} 
              onDeleteTeacher={handleDeleteTeacher} 
              accentColor={accentColor} 
            />
          )}

          {currentTab === 'attendance' && (
            <AttendanceModule 
              students={studentsList} 
              onTriggerToast={triggerToast} 
              accentColor={accentColor} 
            />
          )}

          {currentTab === 'fees' && (
            <FeeModule 
              invoices={invoicesList} 
              students={studentsList} 
              onAddInvoice={handleAddInvoice} 
              onPayInvoice={handlePayInvoice} 
              accentColor={accentColor} 
            />
          )}

          {currentTab === 'exams' && (
            <ExamModule 
              exams={examsList} 
              marks={marksList} 
              students={studentsList} 
              onAddExam={handleAddExam} 
              onAddMarks={handleAddMarks} 
              accentColor={accentColor} 
            />
          )}

          {currentTab === 'academic' && (
            <AcademicModule 
              timeline={timetableList} 
              classes={INITIAL_CLASSES} 
              onAddTimetableEntry={handleAddTimetableEntry} 
              onDeleteTimetableEntry={handleDeleteTimetableEntry} 
              accentColor={accentColor} 
            />
          )}

          {currentTab === 'library' && (
            <LibraryModule 
              books={booksList} 
              issues={bookIssuesList} 
              students={studentsList} 
              onAddBook={handleAddBook} 
              onIssueBook={handleIssueBook} 
              onReturnBook={handleReturnBook} 
              accentColor={accentColor} 
            />
          )}

          {currentTab === 'parentPortal' && (
            <ParentPortal 
              students={studentsList} 
              invoices={invoicesList} 
              marks={marksList} 
              exams={examsList} 
              accentColor={accentColor} 
              onPayInvoice={handlePayInvoice} 
              onTriggerToast={triggerToast} 
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView 
              darkMode={darkMode} 
              onToggleDarkMode={() => setDarkMode(prev => !prev)} 
              accentColor={accentColor} 
              onChangeAccentColor={setAccentColor} 
              onResetData={handleResetData} 
              onTriggerToast={triggerToast} 
            />
          )}

        </main>
      </div>

      {/* Floating AI EduBot Chatbot */}
      <ChatbotWidget />

    </div>
  );
}
