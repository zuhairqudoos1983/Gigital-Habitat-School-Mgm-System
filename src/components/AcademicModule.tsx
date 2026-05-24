import React, { useState } from 'react';
import { 
  Calendar, Clock, User, Plus, Trash2, 
  MapPin, Check, BookOpen 
} from 'lucide-react';
import { TimetableEntry, ClassSection } from '../types';

interface AcademicModuleProps {
  timeline: TimetableEntry[];
  classes: ClassSection[];
  onAddTimetableEntry: (entry: TimetableEntry) => void;
  onDeleteTimetableEntry: (id: string) => void;
  accentColor: string;
}

export const AcademicModule: React.FC<AcademicModuleProps> = ({
  timeline,
  classes,
  onAddTimetableEntry,
  onDeleteTimetableEntry,
  accentColor
}) => {
  const [selectedClassId, setSelectedClassId] = useState('G10-A');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [form, setForm] = useState({
    day: 'Monday' as any,
    period: 1,
    time: '08:30 AM - 09:15 AM',
    subject: 'Mathematics',
    teacherId: 'TCH-001'
  });

  const classSelections = classes.find(c => c.id === selectedClassId);

  const handleTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `TT-${Date.now()}`;
    const created: TimetableEntry = {
      id,
      classId: selectedClassId,
      ...form
    };
    onAddTimetableEntry(created);
    setIsModalOpen(false);
  };

  const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
  ];

  const classTimeline = timeline.filter(t => t.classId === selectedClassId);

  return (
    <div id="academic-module" className="space-y-6 animate-fade-in font-sans pb-20 text-gray-800 dark:text-gray-150">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-150 dark:border-slate-850 shadow-sm">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white uppercase">CLASS SCHEDULERS & TIMETABLES</h1>
          <p className="text-xs text-gray-400">Manage school section allocations, adjust course durations, and plot timetables.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          id="btn-timetable-add"
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-white font-semibold text-xs hover:opacity-90 select-none transition-all cursor-pointer"
          style={{ backgroundColor: accentColor }}
        >
          <Plus className="w-4 h-4" /> Add Period Slot
        </button>
      </div>

      {/* Class picker selection rows */}
      <div className="flex flex-col sm:flex-row gap-4">
        {classes.map((cls) => (
          <button
            key={cls.id}
            onClick={() => setSelectedClassId(cls.id)}
            id={`cls-sel-btn-${cls.id}`}
            className={`px-5 py-3 rounded-2xl font-bold border leading-none transition-all select-none text-xs text-left ${
              selectedClassId === cls.id 
                ? 'bg-slate-900 text-white border-slate-900' 
                : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-200 border-gray-150 dark:border-slate-805 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            Grade Room: {cls.className} ({cls.section})
            <span className="block text-[10px] font-bold text-gray-400 uppercase mt-1">Room No: {cls.roomNo}</span>
          </button>
        ))}
      </div>

      {/* Interactive horizontal timetable layout */}
      <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 rounded-2xl shadow-sm overflow-hidden p-5">
        <h3 className="text-sm font-bold border-b pb-3 mb-5 uppercase tracking-wide flex items-center gap-2">
          <BookOpen className="w-4.5 h-4.5 text-indigo-500" />
          Weekly Session plots ({classSelections?.className} - Section {classSelections?.section})
        </h3>

        <div className="space-y-4">
          {days.map((day) => {
            const dayEntries = classTimeline.filter(t => t.day === day).sort((a,b) => a.period - b.period);

            return (
              <div key={day} className="flex flex-col md:flex-row gap-3 border-b border-gray-50 dark:border-slate-850 pb-3 last:border-none">
                <div className="w-24 text-xs font-black uppercase text-gray-400 shrink-0 self-center">
                  {day}
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {dayEntries.length > 0 ? (
                    dayEntries.map((ent) => (
                      <div 
                        key={ent.id}
                        className="bg-gray-50 dark:bg-slate-850/50 p-3 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm relative group hover:border-indigo-505 transition-all text-xs"
                      >
                        <div className="flex items-center justify-between mb-15">
                          <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 p-0.5 px-2 rounded">
                            Period {ent.period}
                          </span>
                          <button
                            onClick={() => onDeleteTimetableEntry(ent.id)}
                            id={`tt-del-${ent.id}`}
                            className="text-rose-500 opacity-0 group-hover:opacity-100 p-0.5 hover:bg-red-50 dark:hover:bg-red-950/15 rounded transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <h4 className="font-bold text-gray-900 dark:text-white leading-tight">{ent.subject}</h4>
                        <p className="text-[10px] text-gray-400 mt-1 italic flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-450 shrink-0" /> {ent.time}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 py-3 text-center text-[10px] uppercase text-gray-400 font-bold tracking-widest leading-none bg-gray-50/50 dark:bg-slate-855 rounded-xl border">
                      No schedule entries logged for {day} 🚀
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* NEW PERIOD SLOT MODAL */}
      {isModalOpen && (
        <div id="timetable-modal-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden animate-scale-up text-xs">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 dark:text-white">Add Curriculum Period Slot</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleTimeSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase">Day of timetable</label>
                <select
                  value={form.day}
                  onChange={(e) => setForm({ ...form, day: e.target.value as any })}
                  className="w-full p-2.5 bg-gray-50 rounded"
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase">Period Index (1 - 5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={form.period}
                  onChange={(e) => setForm({ ...form, period: Number(e.target.value) })}
                  className="w-full p-2.5 bg-gray-50 rounded"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase">Session hours span</label>
                <input
                  type="text"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 rounded"
                  placeholder="e.g. 10:45 AM - 11:30 AM"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase">Subject Type</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 rounded"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="English Literature">English Literature</option>
                  <option value="Computer Science">Computer Science</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-105">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 bg-gray-100 rounded font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-white rounded font-bold"
                  style={{ backgroundColor: accentColor }}
                >
                  Add Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
