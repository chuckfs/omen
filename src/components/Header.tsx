import React from 'react';
import { SparklesIcon, CogIcon, GoogleIcon } from './ui/icons';
import type { User } from '../types';

interface HeaderProps {
  user: User | null;
  onSignIn: () => void;
  onProfileClick: () => void;
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onSignIn, onProfileClick, onSettingsClick }) => {
  return (
    <header className="w-full max-w-5xl flex items-center justify-between py-2 sm:py-4 mb-4 sm:mb-8 animate-fade-in relative z-20">
      
      {/* Brand */}
      <div className="flex items-center gap-3 group cursor-default">
        <div className="relative">
           <SparklesIcon className="w-6 h-6 text-violet-500 group-hover:text-cyan-400 transition-colors duration-500" />
           <div className="absolute inset-0 bg-violet-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-[0.2em] text-slate-800 dark:text-slate-100 uppercase">
            Omen
          </h1>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {user ? (
           <>
            <button 
              onClick={onProfileClick} 
              className="flex items-center gap-2 group focus:outline-none"
              title="Profile"
              aria-label="Go to Profile"
            >
              <span className="hidden sm:block text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-violet-500 dark:group-hover:text-cyan-400 transition-colors">
                {user.name.split(' ')[0]}
              </span>
              <img 
                src={user.photoUrl} 
                alt="Profile" 
                className="w-9 h-9 rounded-full ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-violet-400 dark:group-hover:ring-cyan-500 transition-all shadow-lg" 
              />
            </button>
           </>
        ) : (
          <button 
            onClick={onSignIn} 
            className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-sm font-semibold px-5 py-2 rounded-full hover:bg-white dark:hover:bg-slate-700 hover:text-violet-600 dark:hover:text-white transition-all duration-300 border border-slate-200 dark:border-slate-700/50 hover:border-violet-200 dark:hover:border-slate-600"
            aria-label="Sign In"
          >
            <GoogleIcon className="w-4 h-4 opacity-80" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}

        <div className="w-px h-6 bg-slate-300 dark:bg-slate-700/50 mx-1"></div>

        <button
          onClick={onSettingsClick}
          className="p-2 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          title="Settings"
          aria-label="Open Settings"
        >
          <CogIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;