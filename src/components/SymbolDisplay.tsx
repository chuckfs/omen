import React, { useState, useEffect } from 'react';
import type { SymbolInfo, AppSettings } from '../types';
import { ShareIcon, StarIcon } from './ui/icons';
import { getShareText } from '../utils/textUtils';

interface SymbolDisplayProps {
  info: SymbolInfo;
  imageUrl: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  settings: AppSettings;
}

type Tab = 'indigenous' | 'cultural' | 'psychological';

const SymbolDisplay: React.FC<SymbolDisplayProps> = ({ info, imageUrl, isFavorite, onToggleFavorite, settings }) => {
  const [isSharing, setIsSharing] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('indigenous');
  const [imageError, setImageError] = useState(false);

  // Determine available tabs based on settings
  const availableTabs: Tab[] = ['indigenous'];
  if (settings.showCultural) availableTabs.push('cultural');
  if (settings.showPsychological) availableTabs.push('psychological');

  // Reset active tab if the current one becomes unavailable
  useEffect(() => {
    if (!availableTabs.includes(activeTab)) {
      setActiveTab('indigenous');
    }
  }, [settings.showCultural, settings.showPsychological, activeTab]);

  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  const handleShare = async () => {
    if (!navigator.share) {
      alert('Sharing is not supported on this browser.');
      return;
    }
    setIsSharing(true);
    try {
      const shareText = getShareText(info);
      const shareData: ShareData = { title: info.name, text: shareText };
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const fileName = `${info.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
        const file = new File([blob], fileName, { type: 'image/jpeg' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          shareData.files = [file];
        }
      } catch (e) {
        console.warn('Fallback to text-only share.', e);
      }
      await navigator.share(shareData);
    } catch (error) {
      const err = error as Error;
      if (err.name !== 'AbortError') console.error('Error sharing:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="relative w-full animate-fade-in transition-all duration-500">
      {/* Main Glass Card */}
      <div className="bg-white dark:bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700/30 overflow-hidden">
        
        {/* Header Section with Image and Actions */}
        <div className="relative p-6 sm:p-10 flex flex-col md:flex-row gap-8 items-start md:items-center border-b border-slate-100 dark:border-slate-800/50">
          
          {/* Actions (Absolute Top Right) */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex gap-3 z-10">
            <button
              onClick={onToggleFavorite}
              className={`p-2.5 rounded-full transition-all duration-300 backdrop-blur-sm border ${
                isFavorite 
                  ? 'bg-amber-100/50 dark:bg-amber-900/20 text-amber-500 border-amber-200 dark:border-amber-700/30 shadow-inner' 
                  : 'bg-white/50 dark:bg-slate-800/50 text-slate-400 hover:text-amber-500 border-slate-200 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-700'
              }`}
              aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
            >
              <StarIcon className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              disabled={isSharing}
              className="p-2.5 rounded-full bg-white/50 dark:bg-slate-800/50 text-slate-400 hover:text-cyan-500 border border-slate-200 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-700 transition-all duration-300 backdrop-blur-sm"
              aria-label="Share omen"
            >
              {isSharing ? (
                <div className="w-5 h-5 border-2 border-t-transparent border-current rounded-full animate-spin"></div>
              ) : (
                <ShareIcon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Symbol Image */}
          <div className="flex-shrink-0 mx-auto md:mx-0 relative group">
            <div className="absolute -inset-2 bg-gradient-to-tr from-violet-600 to-cyan-400 rounded-2xl opacity-20 blur-lg group-hover:opacity-40 transition duration-700"></div>
            {!imageError ? (
              <img
                src={imageUrl}
                alt={info.name}
                className="relative w-40 h-40 sm:w-48 sm:h-48 object-cover rounded-2xl shadow-xl bg-slate-100 dark:bg-slate-900 ring-1 ring-white/20 dark:ring-slate-700/50"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-slate-400 text-xs text-center p-4">
                 Visual manifestation unavailable
              </div>
            )}
          </div>

          {/* Title and Tagline */}
          <div className="flex-grow text-center md:text-left space-y-2">
            <h2 className="text-4xl sm:text-5xl font-light text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
              {info.name}
            </h2>
            <div className="inline-block h-1 w-12 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full my-2"></div>
            <p className="text-slate-500 dark:text-slate-400 text-lg sm:text-xl font-light italic">
              "A sign from the ether."
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-10 space-y-8">
          
          {/* Meanings Tabs */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Interpretation</h3>
            </div>
            
            {info.interpretations ? (
              <div className="flex flex-col gap-6">
                {availableTabs.length > 1 && (
                  <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-900/50 rounded-full self-center md:self-start border border-slate-200 dark:border-slate-800" role="tablist">
                    {availableTabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        role="tab"
                        aria-selected={activeTab === tab}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 capitalize ${
                          activeTab === tab
                            ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-cyan-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                )}

                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-500 to-transparent rounded-full opacity-50"></div>
                  <p className="pl-6 text-slate-700 dark:text-slate-300 leading-8 text-lg font-light tracking-wide animate-fade-in">
                    {info.interpretations[activeTab]}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-slate-700 dark:text-slate-300 leading-8 text-lg font-light">{info.meaning}</p>
            )}
          </div>
          
          {/* History Section */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800/50">
             <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Origins & History</h3>
             <p className="text-slate-600 dark:text-slate-400 leading-7 font-light">
                {info.history}
             </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SymbolDisplay;