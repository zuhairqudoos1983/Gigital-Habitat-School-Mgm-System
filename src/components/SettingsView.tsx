import React from 'react';
import { 
  Settings, Palette, Moon, Sun, Globe, RotateCcw, 
  HelpCircle, ShieldCheck, Check 
} from 'lucide-react';

interface SettingsViewProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  accentColor: string;
  onChangeAccentColor: (color: string) => void;
  onResetData: () => void;
  onTriggerToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  darkMode,
  onToggleDarkMode,
  accentColor,
  onChangeAccentColor,
  onResetData,
  onTriggerToast
}) => {
  const brandColors = [
    { name: 'Indigo Premium', code: '#4f46e5' },
    { name: 'Emerald Classic', code: '#10b981' },
    { name: 'Sky High', code: '#0284c7' },
    { name: 'Crimson Bold', code: '#e11d48' },
    { name: 'Amber Glow', code: '#d97706' },
  ];

  return (
    <div id="settings-environment" className="space-y-6 animate-fade-in font-sans pb-20 text-gray-800 dark:text-gray-150">
      
      {/* Settings Banner */}
      <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 p-6 rounded-2xl shadow-sm">
        <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white uppercase">ERP SETTINGS & PERSONALIZATION</h1>
        <p className="text-xs text-gray-400">Configure visual themes, swap accent layouts, adjust default languages, or reset simulation states.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Accent pallet & theme modes */}
        <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 shadow-sm p-6 rounded-2xl space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wide border-b pb-3 flex items-center gap-1.5 text-gray-950 dark:text-white">
            <Palette className="w-5 h-5 text-indigo-505" /> Visual appearance branding
          </h3>

          {/* Color picking */}
          <div className="space-y-2 text-xs">
            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Accent System Color</span>
            <div className="flex gap-2.5 flex-wrap">
              {brandColors.map((col) => (
                <button
                  key={col.code}
                  onClick={() => {
                    onChangeAccentColor(col.code);
                    onTriggerToast(`ERP accent color updated to ${col.name}!`, 'info');
                  }}
                  id={`color-btn-${col.code.replace('#', '')}`}
                  className="w-8 h-8 rounded-full border border-gray-200 dark:border-slate-755 relative flex items-center justify-center transition-all scale-100 hover:scale-105"
                  style={{ backgroundColor: col.code }}
                  title={col.name}
                >
                  {accentColor === col.code && (
                    <Check className="w-4 h-4 text-white font-extrabold" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Dark theme toggle switcher row */}
          <div className="pt-2.5 border-t border-gray-50 dark:border-slate-805 space-y-3.5">
            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Canvas Theme Mode</span>
            
            <button
              onClick={() => {
                onToggleDarkMode();
                onTriggerToast(`Switched canvas theme!`, 'info');
              }}
              id="theme-toggle-btn"
              className="w-full flex items-center justify-between p-3.5 bg-gray-50 dark:bg-slate-855 rounded-xl border border-gray-150 dark:border-slate-805 text-xs text-left"
            >
              <div className="flex items-center gap-2">
                {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-500" /> : <Moon className="w-4.5 h-4.5 text-indigo-600" />}
                <div>
                  <p className="font-bold">{darkMode ? 'Activate Light Day Mode' : 'Activate Dark Cosmic Night'}</p>
                  <p className="text-[10px] text-gray-450 mt-0.5">Adjust canvas readability settings instantly.</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold text-indigo-600 select-none">Swap</span>
            </button>
          </div>
        </div>

        {/* Global actions & system maintenance resets */}
        <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 shadow-sm p-6 rounded-2xl space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wide border-b pb-3 flex items-center gap-1.5 text-gray-950 dark:text-white">
            <Globe className="w-5 h-5 text-emerald-505" /> Location & System details
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Primary language</span>
              <select className="w-full text-xs p-3 bg-gray-50 dark:bg-slate-850 rounded-xl border cursor-pointer">
                <option value="EN">English (US Global)</option>
                <option value="FR">French (Francais Academic)</option>
                <option value="AR">Arabic (العربية)</option>
              </select>
            </div>

            <div className="pt-4 border-t border-gray-50 dark:border-slate-805 space-y-3">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest text-rose-500 mb-0.5">Danger operations</span>
              
              <button
                onClick={() => {
                  if (confirm('Are you absolutely sure you want to restore Greenfield database structures back to factory demo defaults? This resets student lists, invoices, grades, and schedules.')) {
                    onResetData();
                  }
                }}
                id="btn-reset-data"
                className="w-full flex items-center justify-between p-3.5 bg-rose-50 dark:bg-rose-955/20 hover:bg-rose-100/50 border border-rose-100 rounded-xl text-rose-600 dark:text-rose-400 transition-colors text-xs text-left cursor-pointer"
              >
                <div className="flex items-center gap-2 leading-none">
                  <RotateCcw className="w-4.5 h-4.5" />
                  <div>
                    <p className="font-bold">Reset Simulation Databases</p>
                    <p className="text-[10.5px] text-rose-500 mt-1 leading-none">Purge and restore all state indicators back to default values.</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
