import React, { useState, useCallback, useEffect, createContext, useContext } from 'react';
import type { SymbolInfo, Geolocation, Omen, User, Theme, SpiritualPractice } from './types';
import { fetchSymbolInfoAndImage } from './services/geminiService';
import SearchBar from './components/SearchBar';
import SymbolDisplay from './components/SymbolDisplay';
import Loader from './components/ui/Loader';
import ErrorDisplay from './components/ui/ErrorDisplay';
import { SparklesIcon, LocationMarkerIcon, StarIcon, HistoryIcon } from './components/ui/icons';
import SettingsPanel from './components/SettingsPanel';
import Header from './components/Header';
import ProfilePage from './components/ProfilePage';
import OmenGrid from './components/OmenGrid';
import { useLocalOmenStorage } from './hooks/useLocalOmenStorage';

// --- THEME CONTEXT ---
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem('omenTheme');
      return (stored === 'light' || stored === 'dark' || stored === 'system') ? stored : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    localStorage.setItem('omenTheme', theme);
    const root = window.document.documentElement;
    const applyTheme = (t: 'light' | 'dark') => {
       if (t === 'dark') root.classList.add('dark');
       else root.classList.remove('dark');
    };

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches ? 'dark' : 'light');
      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches ? 'dark' : 'light');
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};


// --- AUTHENTICATION CONTEXT ---
interface AuthContextType {
  user: User | null;
  signIn: () => void;
  signOut: () => void;
  updateSpiritualPractice: (practice: SpiritualPractice) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('omenUser');
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  });

  const signIn = () => {
    const mockUser: User = {
      id: '12345-mock',
      name: 'Alex Riverstone',
      email: 'alex.riverstone@example.com',
      photoUrl: `https://api.dicebear.com/8.x/lorelei/svg?seed=alex&backgroundColor=f0e7ff,c0a7e2`,
      spiritualPractice: 'None',
    };
    localStorage.setItem('omenUser', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const signOut = () => {
    localStorage.removeItem('omenUser');
    setUser(null);
  };

  const updateSpiritualPractice = (practice: SpiritualPractice) => {
    if (user) {
      const updatedUser: User = { ...user, spiritualPractice: practice };
      setUser(updatedUser);
      localStorage.setItem('omenUser', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, updateSpiritualPractice }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// --- MAIN APP COMPONENT ---
const MainApp: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [searchResult, setSearchResult] = useState<SymbolInfo | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'profile'>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const { user, signIn, signOut, updateSpiritualPractice } = useAuth();
  
  const { 
    pastOmens, 
    favorites, 
    recentSearches, 
    settings, 
    setSettings, 
    addPastOmen, 
    toggleFavorite, 
    addRecentSearch, 
    clearPastOmens, 
    clearFavorites 
  } = useLocalOmenStorage(user);

  const [location, setLocation] = useState<Geolocation | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'pending' | 'granted' | 'denied'>('idle');

  // Handle Location
  const handleGetLocation = useCallback(() => {
    setLocationStatus('pending');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        setLocationStatus('granted');
      },
      () => {
        setLocation(null);
        setLocationStatus('denied');
      },
      { timeout: 10000 }
    );
  }, []);

  const handleSkipLocation = useCallback(() => {
    setLocation(null);
    setLocationStatus('denied'); 
  }, []);

  // Handle Search
  const handleSearch = useCallback(async (manualQuery?: string) => {
    const queryToUse = typeof manualQuery === 'string' ? manualQuery : query;

    if (!queryToUse.trim()) {
      setError('Please enter a symbol or omen to search for.');
      return;
    }

    if (typeof manualQuery === 'string') setQuery(manualQuery);

    setIsLoading(true);
    setError(null);
    setSearchResult(null);
    setImageUrl('');

    try {
      const practice = user?.spiritualPractice === 'None' ? null : user?.spiritualPractice;
      const result = await fetchSymbolInfoAndImage(queryToUse, location, practice);
      
      setSearchResult(result.info);
      setImageUrl(result.imageUrl);
      addRecentSearch(queryToUse);

      const newOmen: Omen = { 
        ...result.info, 
        imageUrl: result.imageUrl, 
        query: queryToUse,
        timestamp: Date.now() 
      };
      addPastOmen(newOmen);

    } catch (err: unknown) {
      console.error('Search error:', err);
      let errorMessage = 'The spirits are quiet regarding this request.';
      if (err instanceof Error) errorMessage = err.message;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [query, location, user, addRecentSearch, addPastOmen]);

  const handleOmenSelect = useCallback((omen: Omen) => {
    setSearchResult(omen);
    setImageUrl(omen.imageUrl);
    setQuery(omen.query);
    setError(null);
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleToggleFavorite = useCallback(() => {
    if (!searchResult || !imageUrl) return;
    const omenToToggle: Omen = { 
      ...searchResult, 
      imageUrl, 
      query: query || searchResult.name,
      timestamp: Date.now()
    };
    toggleFavorite(omenToToggle);
  }, [searchResult, imageUrl, query, toggleFavorite]);

  // Loading/Location Gate
  if (locationStatus === 'idle' || locationStatus === 'pending') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#050816] text-slate-900 dark:text-slate-200 font-sans p-6 flex flex-col items-center justify-center transition-colors duration-500">
        {locationStatus === 'pending' ? <Loader /> : (
          <div className="text-center max-w-lg animate-fade-in space-y-10 relative z-10">
             {/* Decorative background glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-500/20 rounded-full blur-[100px] -z-10"></div>
             
             <div className="flex flex-col items-center justify-center gap-4">
               <div className="flex items-center gap-3">
                 <SparklesIcon className="w-8 h-8 text-cyan-500" />
                 <h1 className="text-7xl font-thin tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">OMEN</h1>
                 <SparklesIcon className="w-8 h-8 text-violet-500" />
               </div>
               <p className="text-lg text-slate-500 dark:text-slate-400 font-light tracking-wide max-w-md mx-auto">
                 Unlock the hidden meanings of the signs around you.
               </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <button 
                onClick={handleGetLocation} 
                className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-slate-800/80 text-white border border-slate-700/50 px-8 py-3 rounded-full hover:bg-slate-800 dark:hover:bg-slate-700/80 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300 backdrop-blur-sm"
              >
                <LocationMarkerIcon className="w-5 h-5 text-cyan-400" /> 
                <span className="tracking-wide">Use Location</span>
              </button>
              <button 
                onClick={handleSkipLocation} 
                className="text-slate-500 dark:text-slate-400 font-medium px-8 py-3 rounded-full hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-300"
              >
                Continue Without
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const isCurrentOmenFavorite = searchResult ? favorites.some(f => f.name === searchResult.name) : false;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050816] text-slate-900 dark:text-slate-200 font-sans transition-colors duration-500 overflow-x-hidden selection:bg-violet-500/30">
      
      {/* Ambient background noise/gradient */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] mix-blend-screen opacity-50 dark:opacity-30"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] mix-blend-screen opacity-50 dark:opacity-30"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center p-4 sm:p-8 min-h-screen">
        <Header 
          user={user} 
          onSignIn={signIn}
          onProfileClick={() => setCurrentPage('profile')} 
          onSettingsClick={() => setIsSettingsOpen(true)} 
        />
        
        <SettingsPanel
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onUpdateSettings={setSettings}
          onClearPastOmens={clearPastOmens}
          onClearFavorites={clearFavorites}
        />

        <main className="w-full max-w-5xl flex flex-col items-center gap-8 mt-4 sm:mt-8">
          {currentPage === 'profile' && user ? (
            <ProfilePage 
              user={user}
              onSignOut={() => { signOut(); setCurrentPage('home'); }}
              onBack={() => setCurrentPage('home')}
              onUpdatePractice={updateSpiritualPractice}
              pastOmens={pastOmens}
              favorites={favorites}
              onSelectOmen={handleOmenSelect}
            />
          ) : (
            <>
              <div className="w-full max-w-xl z-20">
                <SearchBar 
                  query={query} 
                  setQuery={setQuery} 
                  onSearch={() => handleSearch()} 
                  isLoading={isLoading} 
                />
                
                {/* Recent Searches */}
                {!isLoading && !searchResult && recentSearches.length > 0 && (
                  <div className="w-full flex flex-wrap gap-2 mt-4 px-4 justify-center animate-fade-in">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSearch(term)}
                        className="px-4 py-1.5 bg-white/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-full text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-violet-600 dark:hover:text-cyan-400 hover:border-violet-200 dark:hover:border-cyan-800/50 transition-all duration-300 backdrop-blur-sm"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-full">
                {isLoading && <Loader />}
                
                {!isLoading && error && (
                  <ErrorDisplay message={error} onRetry={() => handleSearch()} />
                )}
                
                {!isLoading && !error && searchResult && imageUrl && (
                  <SymbolDisplay 
                    info={searchResult} 
                    imageUrl={imageUrl} 
                    isFavorite={isCurrentOmenFavorite}
                    onToggleFavorite={handleToggleFavorite}
                    settings={settings}
                  />
                )}
                
                {!isLoading && !error && !searchResult && (
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                    <div className="md:col-span-2">
                       {favorites.length > 0 && (
                        <OmenGrid 
                          title="Favorites" 
                          icon={<StarIcon className="w-5 h-5 text-amber-400 fill-amber-400/20" />}
                          omens={favorites} 
                          onSelect={handleOmenSelect} 
                        />
                      )}
                    </div>
                    <div className="md:col-span-2">
                      {pastOmens.length > 0 && (
                        <OmenGrid 
                          title="Past Omens" 
                          icon={<HistoryIcon className="w-5 h-5 text-violet-400" />}
                          omens={pastOmens} 
                          onSelect={handleOmenSelect}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;