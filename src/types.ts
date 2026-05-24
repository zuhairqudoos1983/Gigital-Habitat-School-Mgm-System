export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  email: string;
  associatedId?: string; // e.g., studentId, teacherId, or parent's child studentId
}

export interface Student {
  id: string; // Auto-generated ID, e.g., STU-2026-001
  name: string;
  rollNo: string;
  className: string;
  section: string;
  parentName: string;
  phone: string;
  email: string;
  address: string;
  gender: string;
  dob: string;
  photoUrl?: string;
  status: 'Active' | 'Inactive';
  admissionDate: string;
  monthlyFee?: number;
  annualFee?: number;
  booksPayment?: number;
  securityFee?: number;
  admissionFee?: number;
  examFee?: number;
}

export interface Teacher {
  id: string; // e.g., TCH-001
  name: string;
  email: string;
  phone: string;
  subject: string;
  qualification: string;
  classes: string[]; // Class rooms taught e.g., ["Grade 10-A", "Grade 9-B"]
  salary: number;
  status: 'Active' | 'Inactive';
  joinDate: string;
  attendance: { [date: string]: 'Present' | 'Absent' | 'Leave' };
}

export interface AttendanceRecord {
  date: string;
  studentId: string;
  status: 'Present' | 'Absent' | 'Leave';
  markedBy: string;
}

export interface ClassSection {
  id: string; // e.g., G10-A
  className: string; // e.g., Grade 10
  section: string; // e.g., A
  classTeacherId: string; // teacherId
  roomNo: string;
  subjects: { name: string; teacherId: string }[];
}

export interface TimetableEntry {
  id: string;
  classId: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  period: number; // 1 to 6
  time: string; // e.g. "08:30 AM - 09:15 AM"
  subject: string;
  teacherId: string;
}

export interface Exam {
  id: string;
  name: string; // e.g. "Final Exam 2026", "Midterm Term 1"
  classId: string;
  subject: string;
  date: string;
  maxMarks: number;
}

export interface MarksRecord {
  id: string;
  examId: string;
  studentId: string;
  marksObtained: number;
  remarks: string;
}

export interface Invoice {
  id: string; // e.g., INV-026-1001
  studentId: string;
  month: string; // e.g., "May 2026"
  baseAmount: number;
  libraryFee: number;
  sportsFee: number;
  examFee: number;
  discount: number;
  totalAmount: number;
  status: 'Paid' | 'Unpaid';
  dueDate: string;
  paymentDate?: string;
  paymentMethod?: 'Cash' | 'Card' | 'Online' | 'Bank Transfer';
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  quantity: number;
  available: number;
}

export interface BookIssueRecord {
  id: string;
  bookId: string;
  studentId: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'Issued' | 'Returned';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'general' | 'emergency' | 'event';
  targetAudience: 'All' | 'Teachers' | 'Students' | 'Parents';
}

export interface SchoolSettings {
  schoolName: string;
  schoolLogo: string;
  accentColor: string; // Hex color or Tailwind color class prefix
  language: 'en' | 'ur' | 'ar';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}
