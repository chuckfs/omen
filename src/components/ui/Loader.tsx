import React from 'react';
import { SparklesIcon } from './icons';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12 animate-fade-in w-full min-h-[300px]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-t-amber-500 dark:border-t-amber-400 border-stone-200 dark:border-purple-900/50 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
           <SparklesIcon className="w-6 h-6 text-amber-500 dark:text-amber-200 animate-pulse" />
        </div>
      </div>
      <p className="text-lg text-stone-600 dark:text-amber-200/80 tracking-wider animate-pulse">
        Conjuring insights from the cosmos...
      </p>
    </div>
  );
};

export default Loader;
