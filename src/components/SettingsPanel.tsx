import React from 'react';
import { useTheme } from '../App';
import { SunIcon, MoonIcon, ComputerDesktopIcon, TrashIcon, XIcon } from './ui/icons';
import type { AppSettings, Theme } from '../types';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onClearPastOmens: () => void;
  onClearFavorites: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onClearPastOmens,
  onClearFavorites,
}) => {
  const { theme, setTheme } = useTheme();

  const handleToggle = (key: keyof AppSettings) => {
    onUpdateSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Glass Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-2xl border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 transform transition-transform duration-500 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-light tracking-wide text-slate-800 dark:text-slate-100">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
            aria-label="Close Settings"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-10">
          
          {/* Appearance Section */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
              Appearance
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {(['light', 'dark', 'system'] as Theme[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300 ${
                    theme === t
                      ? 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-700/50 text-violet-600 dark:text-violet-300'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {t === 'light' && <SunIcon className="w-5 h-5" />}
                  {t === 'dark' && <MoonIcon className="w-5 h-5" />}
                  {t === 'system' && <ComputerDesktopIcon className="w-5 h-5" />}
                  <span className="text-xs font-medium capitalize">{t}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Content Preferences Section */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
              Interpretations
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Cultural Meaning</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={settings.showCultural}
                    onChange={() => handleToggle('showCultural')}
                  />
                  <div
                    className={`w-12 h-7 rounded-full transition-colors duration-300 ${
                      settings.showCultural ? 'bg-cyan-500' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full shadow-sm transition-transform duration-300 ${
                      settings.showCultural ? 'transform translate-x-5' : ''
                    }`}
                  ></div>
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Psychological Meaning</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={settings.showPsychological}
                    onChange={() => handleToggle('showPsychological')}
                  />
                  <div
                    className={`w-12 h-7 rounded-full transition-colors duration-300 ${
                      settings.showPsychological ? 'bg-violet-500' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full shadow-sm transition-transform duration-300 ${
                      settings.showPsychological ? 'transform translate-x-5' : ''
                    }`}
                  ></div>
                </div>
              </label>
            </div>
          </section>

          {/* Data Management Section */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
              Data Management
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to clear your interpreted omens?')) {
                    onClearPastOmens();
                  }
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 border border-transparent hover:border-red-200 dark:hover:border-red-900/30 transition-colors"
              >
                <span className="font-medium text-sm">Clear History</span>
                <TrashIcon className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (confirm('Are you sure you want to remove all favorites?')) {
                    onClearFavorites();
                  }
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 border border-transparent hover:border-red-200 dark:hover:border-red-900/30 transition-colors"
              >
                <span className="font-medium text-sm">Clear Favorites</span>
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 text-center">
           <p className="text-xs text-slate-400 dark:text-slate-600 font-mono">OMEN v2.0 &bull; Mystic Edition</p>
        </div>
      </div>
    </>
  );
};

export default SettingsPanel;