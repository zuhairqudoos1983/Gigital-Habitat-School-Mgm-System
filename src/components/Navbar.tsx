import React, { useState } from 'react';
import { 
  Search, Bell, Moon, Sun, Globe, User, 
  ChevronDown, MessageSquare, Shield, HelpCircle 
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  onSearch: (query: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  language: 'en' | 'ur' | 'ar';
  setLanguage: (lang: 'en' | 'ur' | 'ar') => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  translations: Record<string, string>;
  accentColor: string;
  triggerNotificationPanel: () => void;
  unreadNotifications: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearch,
  userRole,
  setUserRole,
  language,
  setLanguage,
  darkMode,
  setDarkMode,
  translations,
  accentColor,
  triggerNotificationPanel,
  unreadNotifications
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);

  const roles: { val: UserRole; label: string }[] = [
    { val: 'admin', label: 'Administrator' },
    { val: 'teacher', label: 'Faculty Staff' },
    { val: 'student', label: 'Student Portal' },
    { val: 'parent', label: 'Parent Portal' },
  ];

  return (
    <header id="top-navbar" className="h-16 border-b border-white/10 dark:border-white/5 bg-white/15 dark:bg-slate-950/20 backdrop-blur-xl sticky top-0 z-20 flex items-center justify-between px-6 select-none font-sans glass-panel">
      {/* Smart search bar */}
      <div className="flex items-center gap-2 max-w-sm w-full bg-white/10 dark:bg-slate-900/30 px-3.5 py-1.5 rounded-xl border border-white/20 dark:border-white/10 focus-within:border-white/30 transition-all">
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          type="text"
          id="navbar-search-input"
          placeholder={translations.searchPlaceholder}
          onChange={(e) => onSearch(e.target.value)}
          className="bg-transparent border-none text-xs text-gray-700 dark:text-gray-200 focus:outline-none w-full placeholder:text-gray-400"
        />
      </div>

      {/* Control Actions Bar */}
      <div className="flex items-center gap-3">
        {/* Role Quick Switcher (Role-Based Access Testing UI) */}
        <div className="relative">
          <button
            onClick={() => {
              setRoleOpen(!roleOpen);
              setLanguageOpen(false);
              setProfileOpen(false);
            }}
            id="role-switcher-btn"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 transition-colors"
          >
            <Shield className="w-3.5 h-3.5" style={{ color: accentColor }} />
            <span className="capitalize">{userRole} view</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {roleOpen && (
            <div id="role-switcher-dropdown" className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 p-1.5 z-40 animate-fade-in text-gray-700 dark:text-gray-200">
              <p className="text-[10px] font-bold text-gray-400 px-2.5 py-1.5 uppercase select-none">
                {translations.allRoles}
              </p>
              {roles.map((r) => (
                <button
                  key={r.val}
                  onClick={() => {
                    setUserRole(r.val);
                    setRoleOpen(false);
                  }}
                  id={`role-opt-${r.val}`}
                  className={`w-full text-left text-xs px-2.5 py-2 rounded-lg transition-colors flex items-center justify-between font-medium ${
                    userRole === r.val
                      ? 'bg-gray-100 dark:bg-slate-700 font-bold'
                      : 'hover:bg-gray-50 dark:hover:bg-slate-750'
                  }`}
                >
                  <span>{r.label}</span>
                  {userRole === r.val && (
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }}></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dual language Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setLanguageOpen(!languageOpen);
              setProfileOpen(false);
              setRoleOpen(false);
            }}
            id="lang-sw-btn"
            className="p-2 bg-gray-100 dark:bg-slate-800 rounded-xl hover:bg-gray-250 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-200 transition-colors flex items-center justify-center"
          >
            <Globe className="w-4 h-4" />
          </button>

          {languageOpen && (
            <div id="lang-dropdown" className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-250 dark:border-slate-700 p-1.5 z-40 text-gray-700 dark:text-gray-200">
              <button
                onClick={() => {
                  setLanguage('en');
                  setLanguageOpen(false);
                }}
                id="lang-opt-en"
                className={`w-full text-left text-xs px-2.5 py-2 rounded-lg transition-colors flex items-center justify-between font-medium ${
                  language === 'en' ? 'bg-gray-100 dark:bg-slate-755 font-bold' : 'hover:bg-gray-50 dark:hover:bg-slate-750'
                }`}
              >
                <span>English</span>
                {language === 'en' && <span className="text-[10px]" style={{ color: accentColor }}>✓</span>}
              </button>
              <button
                onClick={() => {
                  setLanguage('ur');
                  setLanguageOpen(false);
                }}
                id="lang-opt-ur"
                className={`w-full text-left text-xs px-2.5 py-2 rounded-lg transition-colors flex items-center justify-between font-medium ${
                  language === 'ur' ? 'bg-gray-100 dark:bg-slate-755 font-bold' : 'hover:bg-gray-50 dark:hover:bg-slate-750'
                }`}
              >
                <span>اردو (RTL)</span>
                {language === 'ur' && <span className="text-[10px]" style={{ color: accentColor }}>✓</span>}
              </button>
              <button
                onClick={() => {
                  setLanguage('ar');
                  setLanguageOpen(false);
                }}
                id="lang-opt-ar"
                className={`w-full text-left text-xs px-2.5 py-2 rounded-lg transition-colors flex items-center justify-between font-medium ${
                  language === 'ar' ? 'bg-gray-100 dark:bg-slate-755 font-bold' : 'hover:bg-gray-50 dark:hover:bg-slate-750'
                }`}
              >
                <span>العربية (RTL)</span>
                {language === 'ar' && <span className="text-[10px]" style={{ color: accentColor }}>✓</span>}
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Theme dark/light mode button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          id="theme-toggler"
          className="p-2 bg-gray-100 dark:bg-slate-800 rounded-xl hover:bg-gray-250 dark:hover:bg-slate-700 text-gray-650 dark:text-gray-200 transition-colors"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications and Announcements alerts widget */}
        <button
          onClick={triggerNotificationPanel}
          id="notif-dropdown-btn"
          className="p-2 bg-gray-100 dark:bg-slate-800 rounded-xl hover:bg-gray-250 dark:hover:bg-slate-700 text-gray-650 dark:text-gray-200 transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifications > 0 && (
            <span id="notif-unread-tag" className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }}></span>
          )}
        </button>

        {/* Dynamic profile section with show action options */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setLanguageOpen(false);
              setRoleOpen(false);
            }}
            id="profile-dropdown-btn"
            className="flex items-center gap-2 p-1 pl-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center font-bold text-xs">
              {userRole.slice(0, 2).toUpperCase()}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {profileOpen && (
            <div id="profile-dropdown-panel" className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 p-2 z-40 text-gray-700 dark:text-gray-200">
              <div className="p-2.5 border-b border-gray-100 dark:border-slate-700 mb-1">
                <p className="text-xs font-semibold">Greenfield User</p>
                <p className="text-[10px] text-gray-400">user@school.edu</p>
              </div>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  setUserRole('admin');
                }}
                className="w-full text-left text-xs px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-slate-750 rounded-lg transition-colors"
              >
                Setting Role: Admin
              </button>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  setUserRole('parent');
                }}
                className="w-full text-left text-xs px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-slate-750 rounded-lg transition-colors"
              >
                Setting Role: Parent
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
