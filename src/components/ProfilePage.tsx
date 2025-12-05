import React from 'react';
import type { User, Omen, SpiritualPractice } from '../types';
import { SignOutIcon, StarIcon, HistoryIcon } from './ui/icons';
import OmenGrid from './OmenGrid';

interface ProfilePageProps {
  user: User;
  onSignOut: () => void;
  onBack: () => void;
  onUpdatePractice: (practice: SpiritualPractice) => void;
  pastOmens: Omen[];
  favorites: Omen[];
  onSelectOmen: (omen: Omen) => void;
}

const spiritualPractices: SpiritualPractice[] = [
  'None', 'Agnosticism', 'Asatru', 'Atheism', 'Buddhism', 'Christianity', 
  'Hinduism', 'Islam', 'Judaism', 'Shinto', 'Sikhism', 'Taoism', 'Wicca', 
  'General Spirituality'
];

const ProfilePage: React.FC<ProfilePageProps> = ({ 
  user, 
  onSignOut, 
  onBack, 
  onUpdatePractice,
  pastOmens, 
  favorites, 
  onSelectOmen 
}) => {
  return (
    <div className="w-full animate-fade-in pb-12 space-y-8">
        {/* Profile Card */}
        <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-white dark:bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700/30 shadow-xl">
            <div className="relative">
               <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-cyan-400 rounded-full blur-lg opacity-40"></div>
               <img 
                 src={user.photoUrl} 
                 alt="Profile" 
                 className="relative w-28 h-28 rounded-full border-4 border-white dark:border-slate-800 shadow-lg object-cover" 
               />
            </div>
            
            <div className="flex-grow text-center md:text-left space-y-2">
                <h2 className="text-3xl font-light text-slate-800 dark:text-white tracking-tight">{user.name}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-mono">{user.email}</p>
                
                 <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700/50">
                    <label htmlFor="spiritualPractice" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                      Spiritual Focus
                    </label>
                    <div className="relative inline-block w-full sm:w-64">
                      <select
                          id="spiritualPractice"
                          value={user.spiritualPractice || 'None'}
                          onChange={(e) => onUpdatePractice(e.target.value as SpiritualPractice)}
                          className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl px-4 py-3 pr-8 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                      >
                          {spiritualPractices.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                      </div>
                    </div>
                </div>
            </div>
             
             <div className="flex flex-col gap-3 min-w-[160px]">
                <button 
                  onClick={onBack} 
                  className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium px-6 py-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-300"
                >
                    Back to Search
                </button>
                <button 
                  onClick={onSignOut} 
                  className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 font-medium px-6 py-2.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors duration-300"
                >
                    <SignOutIcon className="w-4 h-4" /> Sign Out
                </button>
            </div>
        </div>

        {/* User Data Grids */}
        <div className="space-y-10">
          {favorites.length > 0 && (
             <OmenGrid 
               title="Your Favorites" 
               icon={<StarIcon className="w-5 h-5 text-amber-400" />}
               omens={favorites}
               onSelect={onSelectOmen}
             />
          )}

          {pastOmens.length > 0 && (
             <OmenGrid 
               title="History" 
               icon={<HistoryIcon className="w-5 h-5 text-violet-400" />}
               omens={pastOmens}
               onSelect={onSelectOmen}
             />
          )}
        </div>
    </div>
  );
};

export default ProfilePage;