import { Student, Teacher, ClassSection, TimetableEntry, Exam, MarksRecord, Invoice, Book, BookIssueRecord, Announcement } from './types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'STU-2026-001',
    name: 'Alexander Wright',
    rollNo: '2601',
    className: 'Grade 10',
    section: 'A',
    parentName: 'Robert Wright',
    phone: '+1 (555) 0192-384',
    email: 'alexander.wright@school.edu',
    address: '742 Evergreen Terrace, Springfield',
    gender: 'Male',
    dob: '2011-04-12',
    status: 'Active',
    admissionDate: '2022-09-01',
    monthlyFee: 15000,
    annualFee: 25000,
    booksPayment: 8000,
    securityFee: 10000,
    admissionFee: 15000,
    examFee: 3000
  },
  {
    id: 'STU-2026-002',
    name: 'Sophia Patel',
    rollNo: '2602',
    className: 'Grade 10',
    section: 'A',
    parentName: 'Devendra Patel',
    phone: '+1 (555) 0184-291',
    email: 'sophia.patel@school.edu',
    address: '12 Bluebell Avenue, Oakridge',
    gender: 'Female',
    dob: '2011-08-22',
    status: 'Active',
    admissionDate: '2022-09-01',
    monthlyFee: 15000,
    annualFee: 25000,
    booksPayment: 8000,
    securityFee: 10000,
    admissionFee: 15000,
    examFee: 3000
  },
  {
    id: 'STU-2026-003',
    name: 'Marcus Vance',
    rollNo: '2603',
    className: 'Grade 9',
    section: 'B',
    parentName: 'Amara Vance',
    phone: '+1 (555) 0144-889',
    email: 'marcus.vance@school.edu',
    address: '89 Maple Road, Riverdale',
    gender: 'Male',
    dob: '2012-01-30',
    status: 'Active',
    admissionDate: '2023-09-01',
    monthlyFee: 12000,
    annualFee: 20000,
    booksPayment: 7500,
    securityFee: 8000,
    admissionFee: 12000,
    examFee: 2500
  },
  {
    id: 'STU-2026-004',
    name: 'Emily Zhao',
    rollNo: '2604',
    className: 'Grade 10',
    section: 'A',
    parentName: 'David Zhao',
    phone: '+1 (555) 0112-920',
    email: 'emily.zhao@school.edu',
    address: '23 Cherry Lane, Pinecrest',
    gender: 'Female',
    dob: '2011-11-05',
    status: 'Active',
    admissionDate: '2022-09-01',
    monthlyFee: 15000,
    annualFee: 25000,
    booksPayment: 8000,
    securityFee: 10000,
    admissionFee: 15000,
    examFee: 3000
  },
  {
    id: 'STU-2026-005',
    name: 'Yusuf Mansoor',
    rollNo: '2605',
    className: 'Grade 9',
    section: 'B',
    parentName: 'Fatima Mansoor',
    phone: '+1 (555) 0177-384',
    email: 'yusuf.mansoor@school.edu',
    address: '456 Al-Safa District, Jeddah',
    gender: 'Male',
    dob: '2012-05-18',
    status: 'Active',
    admissionDate: '2023-09-01',
    monthlyFee: 12000,
    annualFee: 20000,
    booksPayment: 7500,
    securityFee: 8000,
    admissionFee: 12000,
    examFee: 2500
  }
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'TCH-001',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@school.edu',
    phone: '+1 (555) 0122-835',
    subject: 'Mathematics',
    qualification: 'M.Sc. in Applied Mathematics',
    classes: ['Grade 10-A', 'Grade 9-B'],
    salary: 4500,
    status: 'Active',
    joinDate: '2019-08-15',
    attendance: {
      '2026-05-20': 'Present',
      '2026-05-21': 'Present',
      '2026-05-22': 'Present',
      '2026-05-23': 'Present',
      '2026-05-24': 'Present'
    }
  },
  {
    id: 'TCH-002',
    name: 'Dr. Arthur Sterling',
    email: 'arthur.sterling@school.edu',
    phone: '+1 (555) 0155-224',
    subject: 'Physics',
    qualification: 'Ph.D. in Physics, MIT',
    classes: ['Grade 10-A'],
    salary: 5200,
    status: 'Active',
    joinDate: '2018-01-10',
    attendance: {
      '2026-05-20': 'Present',
      '2026-05-21': 'Present',
      '2026-05-22': 'Leave',
      '2026-05-23': 'Present',
      '2026-05-24': 'Present'
    }
  },
  {
    id: 'TCH-003',
    name: 'Amelia Vance',
    email: 'amelia.vance@school.edu',
    phone: '+1 (555) 0177-392',
    subject: 'English Literature',
    qualification: 'M.A. in English Literature',
    classes: ['Grade 10-A', 'Grade 9-B'],
    salary: 3800,
    status: 'Active',
    joinDate: '2021-09-01',
    attendance: {
      '2026-05-20': 'Present',
      '2026-05-21': 'Present',
      '2026-05-22': 'Present',
      '2026-05-23': 'Absent',
      '2026-05-24': 'Present'
    }
  },
  {
    id: 'TCH-004',
    name: 'Elena Rostova',
    email: 'elena.rostova@school.edu',
    phone: '+1 (555) 0166-485',
    subject: 'Computer Science',
    qualification: 'B.Tech in Computer Science',
    classes: ['Grade 9-B'],
    salary: 4000,
    status: 'Active',
    joinDate: '2022-08-20',
    attendance: {
      '2026-05-20': 'Present',
      '2026-05-21': 'Present',
      '2026-05-22': 'Present',
      '2026-05-23': 'Present',
      '2026-05-24': 'Present'
    }
  }
];

export const INITIAL_CLASSES: ClassSection[] = [
  {
    id: 'G10-A',
    className: 'Grade 10',
    section: 'A',
    classTeacherId: 'TCH-001',
    roomNo: 'A-201',
    subjects: [
      { name: 'Mathematics', teacherId: 'TCH-001' },
      { name: 'Physics', teacherId: 'TCH-002' },
      { name: 'English Literature', teacherId: 'TCH-003' }
    ]
  },
  {
    id: 'G9-B',
    className: 'Grade 9',
    section: 'B',
    classTeacherId: 'TCH-003',
    roomNo: 'B-104',
    subjects: [
      { name: 'English Literature', teacherId: 'TCH-003' },
      { name: 'Mathematics', teacherId: 'TCH-001' },
      { name: 'Computer Science', teacherId: 'TCH-004' }
    ]
  }
];

export const INITIAL_TIMETABLE: TimetableEntry[] = [
  // Grade 10-A
  { id: 'TT-001', classId: 'G10-A', day: 'Monday', period: 1, time: '08:30 AM - 09:15 AM', subject: 'Mathematics', teacherId: 'TCH-001' },
  { id: 'TT-002', classId: 'G10-A', day: 'Monday', period: 2, time: '09:15 AM - 10:00 AM', subject: 'Physics', teacherId: 'TCH-002' },
  { id: 'TT-003', classId: 'G10-A', day: 'Monday', period: 3, time: '10:00 AM - 10:45 AM', subject: 'English Literature', teacherId: 'TCH-003' },
  { id: 'TT-004', classId: 'G10-A', day: 'Tuesday', period: 1, time: '08:30 AM - 09:15 AM', subject: 'Physics', teacherId: 'TCH-002' },
  { id: 'TT-005', classId: 'G10-A', day: 'Tuesday', period: 2, time: '09:15 AM - 10:00 AM', subject: 'Mathematics', teacherId: 'TCH-001' },
  // Grade 9-B
  { id: 'TT-006', classId: 'G9-B', day: 'Monday', period: 1, time: '08:30 AM - 09:15 AM', subject: 'English Literature', teacherId: 'TCH-003' },
  { id: 'TT-007', classId: 'G9-B', day: 'Monday', period: 2, time: '09:15 AM - 10:00 AM', subject: 'Computer Science', teacherId: 'TCH-004' },
  { id: 'TT-008', classId: 'G9-B', day: 'Monday', period: 3, time: '10:00 AM - 10:45 AM', subject: 'Mathematics', teacherId: 'TCH-001' }
];

export const INITIAL_EXAMS: Exam[] = [
  { id: 'EXM-26-001', name: 'Midterm Assessment 1', classId: 'G10-A', subject: 'Mathematics', date: '2026-03-15', maxMarks: 100 },
  { id: 'EXM-26-002', name: 'Midterm Assessment 1', classId: 'G10-A', subject: 'Physics', date: '2026-03-18', maxMarks: 100 },
  { id: 'EXM-26-003', name: 'Term End Finals', classId: 'G10-A', subject: 'English Literature', date: '2026-05-10', maxMarks: 100 }
];

export const INITIAL_MARKS: MarksRecord[] = [
  // alexander wright STU-2026-001
  { id: 'MRK-001', examId: 'EXM-26-001', studentId: 'STU-2026-001', marksObtained: 88, remarks: 'Excellent logical skills' },
  { id: 'MRK-002', examId: 'EXM-26-002', studentId: 'STU-2026-001', marksObtained: 92, remarks: 'Great practical layout understanding' },
  { id: 'MRK-003', examId: 'EXM-26-003', studentId: 'STU-2026-001', marksObtained: 85, remarks: 'Very expressive essay writing' },

  // sophia patel STU-2026-002
  { id: 'MRK-004', examId: 'EXM-26-001', studentId: 'STU-2026-002', marksObtained: 95, remarks: 'Perfect solution steps' },
  { id: 'MRK-005', examId: 'EXM-26-002', studentId: 'STU-2026-002', marksObtained: 89, remarks: 'Excellent mechanics reasoning' },
  { id: 'MRK-006', examId: 'EXM-26-003', studentId: 'STU-2026-002', marksObtained: 96, remarks: 'Top scores in analytical writing' },

  // emily zhao STU-2026-004
  { id: 'MRK-007', examId: 'EXM-26-001', studentId: 'STU-2026-004', marksObtained: 74, remarks: 'Requires practice in algebra' },
  { id: 'MRK-008', examId: 'EXM-26-002', studentId: 'STU-2026-004', marksObtained: 81, remarks: 'Steady progress shown' },
  { id: 'MRK-009', examId: 'EXM-26-003', studentId: 'STU-2026-004', marksObtained: 90, remarks: 'Very creative approach' }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-2026-1001',
    studentId: 'STU-2026-001',
    month: 'May 2026',
    baseAmount: 350,
    libraryFee: 15,
    sportsFee: 25,
    examFee: 40,
    discount: 30, // scholarship discount
    totalAmount: 400,
    status: 'Paid',
    dueDate: '2026-05-10',
    paymentDate: '2026-05-08',
    paymentMethod: 'Online'
  },
  {
    id: 'INV-2026-1002',
    studentId: 'STU-2026-002',
    month: 'May 2026',
    baseAmount: 350,
    libraryFee: 15,
    sportsFee: 25,
    examFee: 40,
    discount: 0,
    totalAmount: 430,
    status: 'Paid',
    dueDate: '2026-05-10',
    paymentDate: '2026-05-05',
    paymentMethod: 'Card'
  },
  {
    id: 'INV-2026-1003',
    studentId: 'STU-2026-003',
    month: 'May 2026',
    baseAmount: 320,
    libraryFee: 15,
    sportsFee: 20,
    examFee: 0,
    discount: 0,
    totalAmount: 355,
    status: 'Unpaid',
    dueDate: '2026-05-10'
  },
  {
    id: 'INV-2026-1004',
    studentId: 'STU-2026-004',
    month: 'May 2026',
    baseAmount: 350,
    libraryFee: 15,
    sportsFee: 25,
    examFee: 40,
    discount: 50,
    totalAmount: 380,
    status: 'Paid',
    dueDate: '2026-05-10',
    paymentDate: '2026-05-09',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'INV-2026-1005',
    studentId: 'STU-2026-005',
    month: 'May 2026',
    baseAmount: 320,
    libraryFee: 15,
    sportsFee: 20,
    examFee: 0,
    discount: 0,
    totalAmount: 355,
    status: 'Unpaid',
    dueDate: '2026-05-10'
  }
];

export const INITIAL_BOOKS: Book[] = [
  { id: 'BOK-001', title: 'The Elegant Universe', author: 'Brian Greene', isbn: '978-0375708114', category: 'Physics / Cosmology', quantity: 5, available: 4 },
  { id: 'BOK-002', title: 'Calculus Made Easy', author: 'Silvanus P. Thompson', isbn: '978-0312185480', category: 'Mathematics', quantity: 8, available: 8 },
  { id: 'BOK-003', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', category: 'Computer Science', quantity: 3, available: 2 },
  { id: 'BOK-004', title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0446310789', category: 'Literature', quantity: 12, available: 11 }
];

export const INITIAL_BOOK_ISSUES: BookIssueRecord[] = [
  { id: 'ISS-001', bookId: 'BOK-001', studentId: 'STU-2026-001', issueDate: '2026-05-12', dueDate: '2026-05-26', status: 'Issued' },
  { id: 'ISS-002', bookId: 'BOK-003', studentId: 'STU-2026-002', issueDate: '2026-05-01', dueDate: '2026-05-15', returnDate: '2026-05-14', status: 'Returned' },
  { id: 'ISS-003', bookId: 'BOK-004', studentId: 'STU-2026-004', issueDate: '2026-05-22', dueDate: '2026-06-05', status: 'Issued' }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ANC-001',
    title: 'Summer Vacation Dates Announced',
    content: 'The school will remain closed for summer vacations starting from June 15th, 2026 to August 15th, 2026. Online homework packets will be posted on student portals next week.',
    date: '2026-05-24',
    type: 'general',
    targetAudience: 'All'
  },
  {
    id: 'ANC-002',
    title: 'Emergency: Severe Weather Advisory Alert',
    content: 'A high-velocity wind alert is active for tomorrow morning. School operations will shift online via Zoom classes. Students should check email for link credentials.',
    date: '2026-05-23',
    type: 'emergency',
    targetAudience: 'All'
  },
  {
    id: 'ANC-003',
    title: 'Annual Science Fair 2026',
    content: 'Calling all physics and computer science science applicants! Registrations for our Annual Science Exhibition are now open. Showcase your innovations on June 5th.',
    date: '2026-05-20',
    type: 'event',
    targetAudience: 'Students'
  }
];
