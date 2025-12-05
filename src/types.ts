export type Theme = 'light' | 'dark' | 'system';

export type SpiritualPractice = 
  | 'None' 
  | 'Agnosticism' 
  | 'Asatru' 
  | 'Atheism' 
  | 'Buddhism' 
  | 'Christianity' 
  | 'Hinduism' 
  | 'Islam' 
  | 'Judaism' 
  | 'Shinto' 
  | 'Sikhism' 
  | 'Taoism' 
  | 'Wicca' 
  | 'General Spirituality';

export interface Interpretations {
  indigenous: string;
  cultural: string;
  psychological: string;
}

export interface SymbolInfo {
  name: string;
  meaning?: string; // Legacy support for older saved items
  interpretations?: Interpretations;
  history: string;
}

export interface Omen extends SymbolInfo {
  imageUrl: string;
  query: string;
  timestamp: number;
}

export type PastOmen = Omen;

export interface Geolocation {
  latitude: number;
  longitude: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  spiritualPractice?: SpiritualPractice;
}

export interface AppSettings {
  showCultural: boolean;
  showPsychological: boolean;
}

export interface GeminiError extends Error {
  status?: number;
  code?: string;
}