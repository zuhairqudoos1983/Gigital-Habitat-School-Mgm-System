import React, { useState } from 'react';
import { 
  Check, X, FileSpreadsheet, Calendar, 
  User, CheckCircle, AlertCircle, RefreshCw 
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { Student } from '../types';

interface AttendanceModuleProps {
  students: Student[];
  onTriggerToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  accentColor: string;
}

export const AttendanceModule: React.FC<AttendanceModuleProps> = ({
  students,
  onTriggerToast,
  accentColor
}) => {
  const [selectedClass, setSelectedClass] = useState('Grade 10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Dynamic local attendance logging state
  // key: "studentId_date", value: 'Present' | 'Absent' | 'Leave'
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, 'Present' | 'Absent' | 'Leave'>>({
    'STU-2026-001_2026-05-24': 'Present',
    'STU-2026-002_2026-05-24': 'Present',
    'STU-2026-003_2026-05-24': 'Absent',
    'STU-2026-004_2026-05-24': 'Present',
    'STU-2026-005_2026-05-24': 'Leave',
  });

  const getRecordKey = (studentId: string) => `${studentId}_${selectedDate}`;

  const markSingle = (studentId: string, status: 'Present' | 'Absent' | 'Leave') => {
    const key = getRecordKey(studentId);
    setAttendanceRecords(prev => ({
      ...prev,
      [key]: status
    }));
  };

  const markAll = (status: 'Present' | 'Absent' | 'Leave') => {
    const classStudents = students.filter(s => s.className === selectedClass && s.section === selectedSection);
    const updates: Record<string, 'Present' | 'Absent' | 'Leave'> = {};
    classStudents.forEach(s => {
      updates[getRecordKey(s.id)] = status;
    });

    setAttendanceRecords(prev => ({
      ...prev,
      ...updates
    }));

    onTriggerToast(`All students in ${selectedClass}-${selectedSection} marked as ${status} for ${selectedDate}`, 'success');
  };

  // Filter students based on classroom selections
  const filteredStudents = students.filter(s => s.className === selectedClass && s.section === selectedSection);

  // Compute rates
  const classStudentsCount = filteredStudents.length;
  let presentCount = 0;
  let absentCount = 0;
  let leaveCount = 0;

  filteredStudents.forEach(s => {
    const status = attendanceRecords[getRecordKey(s.id)];
    if (status === 'Present') presentCount++;
    else if (status === 'Absent') absentCount++;
    else if (status === 'Leave') leaveCount++;
  });

  const loggedCount = presentCount + absentCount + leaveCount;
  const attendanceRate = loggedCount > 0 ? ((presentCount / loggedCount) * 100).toFixed(1) : '100';

  // Monthly historical tracker data (Recharts)
  const historicalAttendance = [
    { name: '05/18', rate: 94 },
    { name: '05/19', rate: 92 },
    { name: '05/20', rate: 96 },
    { name: '05/21', rate: 95 },
    { name: '05/22', rate: 94 },
    { name: '05/23', rate: 91 },
    { name: '05/24', rate: Number(attendanceRate) || 94 },
  ];

  return (
    <div id="attendance-system" className="space-y-6 animate-fade-in font-sans pb-20 text-gray-800 dark:text-gray-150">
      
      {/* Header operations */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-150 dark:border-slate-850 shadow-sm animate-fade-in">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white uppercase">ATTENDANCE SYSTEM</h1>
          <p className="text-xs text-gray-400">Mark daily present/absent logs, review classroom quotas, and inspect monthly curves.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => markAll('Present')}
            className="px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 border border-emerald-500/10 text-emerald-600 dark:text-emerald-450 rounded-xl text-xs font-bold transition-colors select-none"
          >
            Mark All Present
          </button>
          <button
            onClick={() => markAll('Absent')}
            className="px-3.5 py-2 bg-rose-50 dark:bg-rose-955/20 hover:bg-rose-100 border border-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold transition-colors select-none"
          >
            Mark All Absent
          </button>
        </div>
      </div>

      {/* Classroom filter row with date picker */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Date choice */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-gray-150 dark:border-slate-850 shadow-sm flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent border-none text-xs text-gray-750 dark:text-white focus:outline-none w-full font-bold cursor-pointer"
          />
        </div>

        {/* Class Choice */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-gray-150 dark:border-slate-850 shadow-sm flex items-center gap-2">
          <span className="text-xs text-gray-400 font-bold uppercase shrink-0">Grade List</span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-transparent border-none text-xs text-gray-800 dark:text-white focus:outline-none w-full font-bold cursor-pointer"
          >
            <option value="Grade 10">Grade 10 (Physics)</option>
            <option value="Grade 9">Grade 9 (CS)</option>
            <option value="Grade 8">Grade 8 (Junior)</option>
          </select>
        </div>

        {/* Section choice */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-gray-150 dark:border-slate-850 shadow-sm flex items-center gap-2">
          <span className="text-xs text-gray-400 font-bold uppercase shrink-0">Section</span>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="bg-transparent border-none text-xs text-gray-800 dark:text-white focus:outline-none w-full font-bold cursor-pointer"
          >
            <option value="A">Class section A</option>
            <option value="B">Class section B</option>
            <option value="C">Class section C</option>
          </select>
        </div>

        {/* Quick Rate display */}
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-md border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Today's Rate</span>
            <p className="text-sm font-bold">{attendanceRate}% Attendance</p>
          </div>
          <FileSpreadsheet className="w-5 h-5 text-indigo-400 shrink-0" />
        </div>
      </div>

      {/* Grid: student list AND stats tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dynamic List Table to mark */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-gray-100 dark:border-slate-855 bg-gray-50/50 dark:bg-slate-850 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Classroom Roster ({classStudentsCount} Registered)</span>
              <span className="text-[10px] text-gray-400 font-mono font-bold">Date: {selectedDate}</span>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-slate-800">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((std) => {
                  const status = attendanceRecords[getRecordKey(std.id)];
                  return (
                    <div key={std.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-slate-850 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-xs flex items-center justify-center">
                          {std.name.substring(0, 1)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white leading-none">{std.name}</p>
                          <p className="text-[9px] text-gray-400 font-mono font-bold mt-1.5 leading-none">ID: {std.id}</p>
                        </div>
                      </div>

                      {/* Marking Toggles */}
                      <div className="flex items-center gap-1.5 select-none">
                        {/* Present Toggle */}
                        <button
                          onClick={() => markSingle(std.id, 'Present')}
                          id={`attn-pres-${std.id}`}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                            status === 'Present' 
                              ? 'bg-emerald-500 text-white' 
                              : 'bg-gray-50 dark:bg-slate-800 text-gray-450 hover:bg-gray-100 dark:hover:bg-slate-750'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" /> Present
                        </button>
                        {/* Absent Toggle */}
                        <button
                          onClick={() => markSingle(std.id, 'Absent')}
                          id={`attn-abs-${std.id}`}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                            status === 'Absent' 
                              ? 'bg-rose-500 text-white' 
                              : 'bg-gray-50 dark:bg-slate-800 text-gray-455 hover:bg-gray-100 dark:hover:bg-slate-750'
                          }`}
                        >
                          <X className="w-3.5 h-3.5" /> Absent
                        </button>
                        {/* Leave Toggle */}
                        <button
                          onClick={() => markSingle(std.id, 'Leave')}
                          id={`attn-lve-${std.id}`}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                            status === 'Leave' 
                              ? 'bg-amber-500 text-white' 
                              : 'bg-gray-50 dark:bg-slate-800 text-gray-455 hover:bg-gray-100 dark:hover:bg-slate-750'
                          }`}
                        >
                          Leave
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-16 text-center text-gray-400 font-bold uppercase select-none">
                  No students in this grade section selection.
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-gray-100 dark:border-slate-855 text-right bg-gray-50/50 dark:bg-slate-855">
            <button
              onClick={() => onTriggerToast(`Day registers saved successfully for ${selectedDate}!`, 'success')}
              id="attendance-save-btn"
              className="px-4 py-2 text-white font-semibold text-xs rounded-xl select-none hover:opacity-90"
              style={{ backgroundColor: accentColor }}
            >
              Commit class marks
            </button>
          </div>
        </div>

        {/* Charts & reports panel */}
        <div className="space-y-6">
          
          {/* Quick stats distribution summary */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-gray-155 dark:border-slate-850 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">Today's Class metrics</h3>
            
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500/10 border rounded-xl">
                <p className="text-base font-bold text-emerald-600 dark:text-emerald-450">{presentCount}</p>
                <p className="text-[10px] text-gray-500 font-medium">Present</p>
              </div>
              <div className="p-3 bg-rose-50 dark:bg-rose-955/20 border-rose-500/10 border rounded-xl">
                <p className="text-base font-bold text-rose-600 dark:text-rose-400">{absentCount}</p>
                <p className="text-[10px] text-gray-500 font-medium">Absent</p>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-955/20 border-amber-500/10 border rounded-xl">
                <p className="text-base font-bold text-amber-600 dark:text-amber-400">{leaveCount}</p>
                <p className="text-[10px] text-gray-500 font-medium">On Leave</p>
              </div>
            </div>
          </div>

          {/* Historical attendance Area graph */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-gray-155 dark:border-slate-850 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Attendance Performance Tracker</h3>
              <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
            </div>
            
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historicalAttendance} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAttn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis domain={[80, 100]} stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAttn)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
