import React from 'react';
import { SparklesIcon } from './icons';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12 animate-fade-in w-full min-h-[300px]">
      <div className="relative">
        {/* Main Spinner */}
        <div className="w-20 h-20 border-2 border-slate-200 dark:border-slate-800 rounded-full"></div>
        <div className="absolute inset-0 w-20 h-20 border-2 border-t-violet-500 border-r-cyan-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        
        {/* Center Sparkle */}
        <div className="absolute inset-0 flex items-center justify-center">
           <SparklesIcon className="w-8 h-8 text-violet-400 animate-pulse" />
        </div>
      </div>
      <p className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 uppercase tracking-widest animate-pulse">
        Consulting the Ether...
      </p>
    </div>
  );
};

export default Loader;