import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, Users, GraduationCap, CalendarCheck, 
  CreditCard, Award, Calendar, BookOpen, ShieldAlert, 
  Settings, LogOut, ChevronLeft, ChevronRight, UserCheck
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  userRole: UserRole;
  translations: Record<string, string>;
  accentColor: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  collapsed,
  setCollapsed,
  userRole,
  translations,
  accentColor
}) => {
  const menuItems = [
    { id: 'dashboard', label: translations.dashboard, icon: LayoutDashboard, roles: ['admin', 'teacher', 'student', 'parent'] },
    { id: 'students', label: translations.students, icon: Users, roles: ['admin', 'teacher'] },
    { id: 'teachers', label: translations.teachers, icon: GraduationCap, roles: ['admin'] },
    { id: 'attendance', label: translations.attendance, icon: CalendarCheck, roles: ['admin', 'teacher'] },
    { id: 'fees', label: translations.fees, icon: CreditCard, roles: ['admin'] },
    { id: 'exams', label: translations.exams, icon: Award, roles: ['admin', 'teacher'] },
    { id: 'academic', label: translations.academic, icon: Calendar, roles: ['admin', 'teacher', 'student', 'parent'] },
    { id: 'library', label: translations.library, icon: BookOpen, roles: ['admin', 'teacher', 'student', 'parent'] },
    { id: 'parentPortal', label: translations.parentPortal, icon: UserCheck, roles: ['parent'] },
    { id: 'settings', label: translations.settings, icon: Settings, roles: ['admin', 'teacher', 'student', 'parent'] },
  ];

  // Filter items based on user role
  const allowedItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <motion.aside
      id="portal-sidebar"
      animate={{ width: collapsed ? '4.5rem' : '16rem' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen sticky top-0 bg-slate-900/40 dark:bg-[#070b13]/40 text-gray-100 flex flex-col justify-between border-r border-white/10 dark:border-white/5 z-30 select-none overflow-x-hidden shrink-0 flex-nowrap glass-panel"
    >
      <div>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 h-16 border-b border-white/10 dark:border-white/5">
          {!collapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: accentColor }}
              >
                G
              </div>
              <span className="font-bold text-sm tracking-wide bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent truncate w-36">
                GIS Campus
              </span>
            </motion.div>
          ) : (
            <div
              className="w-8 h-8 mx-auto rounded-lg flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: accentColor }}
            >
              G
            </div>
          )}

          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              id="sidebar-collapse-btn"
              className="p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Menu Items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-10rem)]">
          {allowedItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                id={`sidebar-item-${item.id}`}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all group overflow-hidden ${
                  isActive
                    ? 'text-white shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-white/10 dark:hover:bg-white/5'
                }`}
                style={isActive ? { backgroundColor: `${accentColor}`, boxShadow: `0 4px 12px ${accentColor}40` } : {}}
              >
                <IconComponent className="w-5 h-5 shrink-0" />
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="truncate text-left block"
                  >
                    {item.label}
                  </motion.span>
                )}
                {collapsed && (
                  <div className="absolute left-20 hidden group-hover:block bg-slate-800 text-xs px-2.5 py-1.5 rounded-md shadow-lg font-sans border border-slate-700 whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-white/10 dark:border-white/5">
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            id="sidebar-expand-btn"
            className="w-full flex justify-center p-3 rounded-xl bg-white/5 dark:bg-white/5 hover:bg-white/10 text-gray-350 hover:text-white transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {!collapsed && (
          <div className="bg-white/10 dark:bg-slate-900/30 p-3 rounded-xl border border-white/15 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 max-w-[9.5rem]">
              <div className="w-8 h-8 rounded-full bg-slate-600 dark:bg-slate-700 flex items-center justify-center font-bold text-xs shrink-0 select-none text-white">
                {userRole.slice(0, 2).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-gray-200 truncate capitalize">{userRole}</p>
                <p className="text-[10px] text-gray-450 truncate">GIS Admin Portal</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
};
