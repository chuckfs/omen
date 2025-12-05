import { useState, useEffect, useCallback } from 'react';
import type { Omen, User, AppSettings } from '../types';

const MAX_RECENT_SEARCHES = 10;
const MAX_PAST_OMENS = 20;

export const useLocalOmenStorage = (user: User | null) => {
  const [pastOmens, setPastOmens] = useState<Omen[]>([]);
  const [favorites, setFavorites] = useState<Omen[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
        const stored = localStorage.getItem('omenSettings');
        if (!stored) return { showCultural: true, showPsychological: true };
        const parsed = JSON.parse(stored) as Partial<AppSettings>;
        return {
            showCultural: parsed.showCultural ?? true,
            showPsychological: parsed.showPsychological ?? true
        };
    } catch {
        return { showCultural: true, showPsychological: true };
    }
  });

  // Persist Settings
  useEffect(() => {
    localStorage.setItem('omenSettings', JSON.stringify(settings));
  }, [settings]);

  // Load User Data based on ID or Guest
  useEffect(() => {
    const userIdSuffix = user ? `_${user.id}` : '_guest';
    
    const loadJSON = <T>(key: string, fallback: T): T => {
        try {
            const item = localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : fallback;
        } catch (e) {
            console.warn(`Failed to parse ${key}`, e);
            return fallback;
        }
    };

    setPastOmens(loadJSON<Omen[]>(`pastOmens${userIdSuffix}`, []));
    setFavorites(loadJSON<Omen[]>(`favorites${userIdSuffix}`, []));
    setRecentSearches(loadJSON<string[]>(`recentSearches${userIdSuffix}`, []));

  }, [user]);

  const addPastOmen = useCallback((omen: Omen) => {
    setPastOmens(prev => {
        // Remove duplicates based on name (case-insensitive)
        const filtered = prev.filter(o => o.name.toLowerCase() !== omen.name.toLowerCase());
        const updated = [omen, ...filtered].slice(0, MAX_PAST_OMENS);
        const userIdSuffix = user ? `_${user.id}` : '_guest';
        localStorage.setItem(`pastOmens${userIdSuffix}`, JSON.stringify(updated));
        return updated;
    });
  }, [user]);

  const toggleFavorite = useCallback((omen: Omen) => {
     setFavorites(prev => {
      const isFav = prev.some(f => f.name === omen.name);
      let newFavorites: Omen[];
      if (isFav) {
        newFavorites = prev.filter(f => f.name !== omen.name);
      } else {
        newFavorites = [omen, ...prev];
      }
      const userIdSuffix = user ? `_${user.id}` : '_guest';
      localStorage.setItem(`favorites${userIdSuffix}`, JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, [user]);

  const addRecentSearch = useCallback((query: string) => {
    if (!query.trim()) return;
    setRecentSearches(prev => {
        const normalized = query.trim();
        const filtered = prev.filter(q => q.toLowerCase() !== normalized.toLowerCase());
        const updated = [normalized, ...filtered].slice(0, MAX_RECENT_SEARCHES);
        const userIdSuffix = user ? `_${user.id}` : '_guest';
        localStorage.setItem(`recentSearches${userIdSuffix}`, JSON.stringify(updated));
        return updated;
    });
  }, [user]);

  const clearPastOmens = useCallback(() => {
      setPastOmens([]);
      const userIdSuffix = user ? `_${user.id}` : '_guest';
      localStorage.removeItem(`pastOmens${userIdSuffix}`);
  }, [user]);

  const clearFavorites = useCallback(() => {
      setFavorites([]);
      const userIdSuffix = user ? `_${user.id}` : '_guest';
      localStorage.removeItem(`favorites${userIdSuffix}`);
  }, [user]);

  return {
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
  };
};