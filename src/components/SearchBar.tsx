import React from 'react';
import { SearchIcon } from './ui/icons';

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery, onSearch, isLoading }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="relative w-full group">
      {/* Glow effect on focus */}
      <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full blur opacity-0 group-focus-within:opacity-30 transition duration-500"></div>
      
      <div className="relative flex items-center w-full rounded-full bg-white dark:bg-[#0f172a]/90 backdrop-blur-xl shadow-lg border border-slate-200 dark:border-slate-700/50 transition-all duration-300 group-focus-within:border-violet-400/50 dark:group-focus-within:border-cyan-500/50 group-focus-within:shadow-xl">
        <div className="pl-6 text-slate-400 dark:text-slate-500">
           <SearchIcon className="w-5 h-5 group-focus-within:text-violet-500 dark:group-focus-within:text-cyan-400 transition-colors duration-300" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What omen have you seen? (e.g., 'Owl', 'Eclipse')..."
          className="w-full bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 py-4 px-4 focus:outline-none text-lg font-light tracking-wide"
          disabled={isLoading}
          aria-label="Search for a symbol"
        />
        
        <div className="pr-2">
          <button
            onClick={onSearch}
            disabled={isLoading}
            className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium px-6 py-2.5 rounded-full hover:bg-violet-600 dark:hover:bg-cyan-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm"
            aria-label={isLoading ? "Searching..." : "Search"}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-t-transparent border-current rounded-full animate-spin"></div>
            ) : (
              <span className="text-sm tracking-wide">Interpret</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;