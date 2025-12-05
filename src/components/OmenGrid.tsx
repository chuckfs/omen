import React from 'react';
import type { Omen } from '../types';

interface OmenGridProps {
  title: string;
  icon: React.ReactNode;
  omens: Omen[];
  onSelect: (omen: Omen) => void;
  emptyMessage?: string;
}

const OmenGrid: React.FC<OmenGridProps> = ({ title, icon, omens, onSelect, emptyMessage }) => {
  if (omens.length === 0 && !emptyMessage) return null;

  return (
    <div className="animate-fade-in w-full">
      <div className="flex items-center gap-3 mb-6 px-2">
        {icon}
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 tracking-wide uppercase text-xs">
          {title}
        </h2>
        <div className="h-px flex-grow bg-slate-200 dark:bg-slate-800"></div>
      </div>

      {omens.length === 0 ? (
        <p className="text-slate-400 dark:text-slate-600 text-center italic py-4 font-light">
          {emptyMessage}
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {omens.map((omen, index) => (
            <button
              key={`${omen.name}-${index}`}
              onClick={() => onSelect(omen)}
              className="group relative flex flex-col items-center p-4 bg-white dark:bg-[#0f172a]/60 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-cyan-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              aria-label={`View details for ${omen.name}`}
            >
              <div className="relative w-full aspect-square mb-3 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/50">
                <img
                  src={omen.imageUrl}
                  alt={omen.name}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  loading="lazy"
                />
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm font-medium truncate w-full group-hover:text-violet-600 dark:group-hover:text-cyan-400 transition-colors">
                {omen.name}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OmenGrid;