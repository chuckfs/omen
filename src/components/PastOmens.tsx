import React from 'react';
import type { PastOmen } from '../types';
import { HistoryIcon } from './ui/icons';

interface PastOmensProps {
  omens: PastOmen[];
  onSelect: (omen: PastOmen) => void;
}

const PastOmens: React.FC<PastOmensProps> = ({ omens, onSelect }) => {
  return (
    <div className="animate-fade-in w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <HistoryIcon className="w-7 h-7 text-amber-500 dark:text-amber-400" />
        <h2 className="text-2xl font-semibold text-stone-700 dark:text-stone-200 tracking-wide">Past Omens</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {omens.map((omen) => (
          <button
            key={omen.name}
            onClick={() => onSelect(omen)}
            className="group flex flex-col items-center gap-2 p-3 bg-white dark:bg-purple-950/50 rounded-lg shadow-md dark:shadow-lg border border-stone-200 dark:border-purple-800 hover:bg-stone-50 dark:hover:bg-purple-900 hover:border-amber-400 dark:hover:border-amber-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
            aria-label={`View details for ${omen.name}`}
          >
            <img
              src={omen.imageUrl}
              alt={omen.name}
              className="w-20 h-20 object-contain rounded-md bg-stone-100 dark:bg-indigo-950/70 p-1 group-hover:scale-105 transition-transform duration-300"
            />
            <p className="text-stone-600 dark:text-stone-300 text-sm text-center font-medium truncate w-full group-hover:text-amber-600 dark:group-hover:text-amber-300">
              {omen.name}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PastOmens;
