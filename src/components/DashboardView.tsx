import React, { useState } from 'react';
import { 
  Users, GraduationCap, DollarSign, 
  Calendar, Check, AlertTriangle, ArrowRight, Clock, Award
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  Tooltip, AreaChart, Area, CartesianGrid 
} from 'recharts';
import { Student, Teacher, Invoice, Announcement } from '../types';

interface DashboardProps {
  students: Student[];
  teachers: Teacher[];
  invoices: Invoice[];
  announcements: Announcement[];
  translations: Record<string, string>;
  accentColor: string;
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardProps> = ({
  students,
  teachers,
  invoices,
  announcements,
  translations,
  accentColor,
  onNavigate
}) => {
  // Statistics computations
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  
  // Custom mock attendance rate
  const attendanceRate = 94.6;

  // Invoice calculations
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalCollected = invoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);
  const collectionRate = totalInvoiced > 0 ? ((totalCollected / totalInvoiced) * 100).toFixed(1) : '0';

  // Weekly Collection Inflow chart data (Recharts)
  const cashflowData = [
    { name: 'Week 1', Collected: 1200, Overdue: 200 },
    { name: 'Week 2', Collected: 2400, Overdue: 400 },
    { name: 'Week 3', Collected: 1800, Overdue: 150 },
    { name: 'Week 4', Collected: totalCollected, Overdue: totalInvoiced - totalCollected },
  ];

  // GPA breakdown / performance distribution data
  const gpaData = [
    { grade: 'A+ (4.0)', students: 12 },
    { grade: 'A (3.7)', students: 18 },
    { grade: 'B (3.3)', students: 25 },
    { grade: 'C (2.7)', students: 8 },
    { grade: 'D (2.0)', students: 3 },
  ];

  // Custom mini Calendar state
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Events dictionary for the calendar widget
  const academicEvents: Record<string, { title: string; type: 'exam' | 'holiday' | 'meeting' }> = {
    '2026-05-24': { title: 'AI Assistant Release', type: 'meeting' },
    '2026-05-26': { title: 'Grade 10 Physics Assessment', type: 'exam' },
    '2026-05-30': { title: 'Teacher Training Seminar', type: 'meeting' },
    '2026-06-05': { title: 'Annual Exhibit Fair', type: 'meeting' },
    '2026-06-15': { title: 'Summer Vacations Start', type: 'holiday' },
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayIndex = getFirstDayOfMonth(currentMonth, currentYear);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Activity logs
  const activityLogs = [
    { time: '10 mins ago', desc: 'Attendance marked for Grade 10-A', user: 'Sarah Jenkins', action: 'check' },
    { time: '1 hr ago', desc: 'Invoice INV-2026-1002 cleared via Card', user: 'Sophia Patel', action: 'cash' },
    { time: '4 hrs ago', desc: 'New book "Calculus Made Easy" added', user: 'Librarian', action: 'book' },
    { time: '1 day ago', desc: 'New exam added for Class G10-A', user: 'Dr. Arthur Sterling', action: 'exam' }
  ];

  return (
    <div id="dashboard-view-panel" className="space-y-6 pb-20 animate-fade-in text-gray-800 dark:text-gray-150 font-sans">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            {translations.welcome}, Principal Admin 🌟
          </h1>
          <p className="text-xs text-gray-350 font-medium">
            You are currently managing **{translations.schoolName}** system. Everything is operating smoothly.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate('students')}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-xl text-xs font-semibold select-none transition-all cursor-pointer whitespace-nowrap border border-white/10"
          >
            + Add New Student
          </button>
          <button
            onClick={() => onNavigate('settings')}
            className="px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold shadow-lg select-none hover:bg-slate-100 transition-all cursor-pointer whitespace-nowrap"
          >
            System Tuning
          </button>
        </div>
        {/* Visual accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Animated Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Students */}
        <div id="stat-students" className="p-5 rounded-2xl flex items-center justify-between group glass-card-interactive">
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-300 uppercase tracking-widest">{translations.totalStudents}</p>
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">
              {totalStudents}
            </h3>
            <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full">
              +4 this semester
            </span>
          </div>
          <div className="p-3.5 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-2xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Teachers */}
        <div id="stat-teachers" className="p-5 rounded-2xl flex items-center justify-between group glass-card-interactive">
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-300 uppercase tracking-widest">{translations.totalTeachers}</p>
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">
              {totalTeachers}
            </h3>
            <span className="text-[10px] text-indigo-500 font-bold bg-indigo-500/10 dark:bg-indigo-950/20 px-2 py-0.5 rounded-full">
              100% Core staff active
            </span>
          </div>
          <div className="p-3.5 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-2xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Attendance */}
        <div id="stat-attendance" className="p-5 rounded-2xl flex items-center justify-between group glass-card-interactive">
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-300 uppercase tracking-widest">{translations.attendanceRate}</p>
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">
              {attendanceRate}%
            </h3>
            <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full">
              Excelent target range
            </span>
          </div>
          <div className="p-3.5 bg-amber-500/10 dark:bg-amber-500/20 rounded-2xl text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Finance Collection */}
        <div id="stat-fees" className="p-5 rounded-2xl flex items-center justify-between group glass-card-interactive">
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-300 uppercase tracking-widest">{translations.feeCollection}</p>
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">
              {collectionRate}%
            </h3>
            <span className="text-[10px] text-gray-500 dark:text-gray-300 font-bold bg-gray-500/10 dark:bg-slate-850 px-2 py-0.5 rounded-full">
              Inflow: PKR {totalCollected}
            </span>
          </div>
          <div className="p-3.5 bg-rose-500/10 dark:bg-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Graphs Grid using Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: collection trends */}
        <div id="chart-cashflow" className="p-5 rounded-2xl space-y-4 glass-card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-tight text-gray-900 dark:text-white uppercase">
              {translations.cashflowReport}
            </h3>
            <div className="flex items-center gap-3 text-xs text-gray-440 font-semibold select-none">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Collected
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Unpaid/Overdue
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashflowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOverdue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="Collected" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCollected)" />
                <Area type="monotone" dataKey="Overdue" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOverdue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Grade distribution curves */}
        <div id="chart-grades" className="p-5 rounded-2xl space-y-4 glass-card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-tight text-gray-900 dark:text-white uppercase">
              {translations.gpaCurve}
            </h3>
            <Award className="w-4 h-4 text-amber-500 shrink-0" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gpaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="grade" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="students" fill={accentColor} radius={[8, 8, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Split layout: Recent Activities & Calendar Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* System Log / Recent activity */}
        <div className="lg:col-span-2 p-5 rounded-2xl space-y-4 flex flex-col justify-between glass-card">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold tracking-tight text-gray-900 dark:text-white uppercase flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                {translations.recentActivity}
              </h3>
              <span className="text-[10px] font-bold text-gray-400 bg-gray-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                Live Auditing
              </span>
            </div>
            
            <div className="space-y-3.5 mt-4">
              {activityLogs.map((log, index) => (
                <div key={index} className="flex items-start justify-between p-2.5 hover:bg-gray-50 dark:hover:bg-slate-850 rounded-xl transition-colors">
                  <div className="flex gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-slate-800 rounded-lg text-indigo-600 dark:text-indigo-400 self-center">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{log.desc}</p>
                      <p className="text-[10px] text-gray-400">By {log.user}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1 shrink-0 mt-0.5 font-mono">
                    {log.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('settings')}
            className="flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-550 dark:text-indigo-400 hover:text-indigo-700 hover:underline pt-3"
          >
            Review system details <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Calendar Widget panel */}
        <div className="p-5 rounded-2xl space-y-4 glass-card">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold tracking-tight text-gray-900 dark:text-white uppercase flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: accentColor }} />
              {translations.calendar}
            </h3>
            <div className="flex items-center gap-1">
              <button onClick={prevMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded text-gray-500">←</button>
              <button onClick={nextMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded text-gray-500">→</button>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-800 dark:text-gray-250 mb-3 text-center bg-gray-50 dark:bg-slate-800 py-1.5 rounded-lg select-none">
              {monthNames[currentMonth]} {currentYear}
            </p>
            
            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400 select-none">
              <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs mt-1.5">
              {/* Empty padding day offsets */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="p-1 text-gray-300 dark:text-slate-800">-</div>
              ))}

              {/* Days display */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateKey = `2026-05-${dayNum.toString().padStart(2, '0')}`;
                const eventInfo = academicEvents[dateKey];
                
                return (
                  <div 
                    key={`day-${dayNum}`}
                    className={`p-1.5 rounded-lg relative cursor-pointer select-none class-event-wrapper group ${
                      dayNum === currentDate.getDate() && currentMonth === currentDate.getMonth() ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{dayNum}</span>
                    {eventInfo && (
                      <span 
                        className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                          eventInfo.type === 'holiday' ? 'bg-amber-500' : eventInfo.type === 'exam' ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                      ></span>
                    )}

                    {eventInfo && (
                      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-medium p-1.5 rounded border border-slate-700 shadow-md whitespace-nowrap hidden group-hover:block z-50">
                        {eventInfo.title}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Board Notifications panel */}
      <div id="board-notifs" className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-gray-150 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold tracking-tight text-gray-900 dark:text-white uppercase flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          {translations.announcements}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {announcements.map((anc) => (
            <div 
              key={anc.id}
              className={`p-4 rounded-xl border flex flex-col justify-between hover:scale-[1.01] transition-all ${
                anc.type === 'emergency' 
                  ? 'border-rose-550/20 bg-rose-50/100 dark:bg-rose-950/10' 
                  : anc.type === 'event' 
                    ? 'border-emerald-550/20 bg-emerald-50/100 dark:bg-emerald-950/10'
                    : 'border-slate-200 bg-slate-50/100 dark:bg-slate-850'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[8px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                    anc.type === 'emergency' ? 'bg-rose-100 text-rose-600' : anc.type === 'event' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {anc.type}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono font-bold">{anc.date}</span>
                </div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-tight mb-1">{anc.title}</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-300 leading-normal">{anc.content}</p>
              </div>

              <div className="pt-3.5 border-t border-black/5 dark:border-white/5 mt-3 text-[10px] text-gray-400 font-semibold self-start uppercase max-w-full truncate">
                Target: {anc.targetAudience}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
