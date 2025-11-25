
import React, { memo, useState, useEffect } from 'react';
import { TrendingTopic } from '../types';
import { Search, MoreHorizontal, TrendingUp, Command, Clock, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { db } from '../services/db';

interface RightPanelProps {
  trends: TrendingTopic[];
  className?: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isZenMode?: boolean;
  language?: string; 
}

const RightPanel: React.FC<RightPanelProps> = memo(({ trends, className, searchTerm, setSearchTerm, isZenMode, language }) => {
  const { t } = useTranslation();
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
      setSearchHistory(db.getSearchHistory());
  }, [searchTerm]); // Refresh when searching updates history

  const handleSearchFocus = () => {
      setSearchHistory(db.getSearchHistory());
      setShowHistory(true);
  };

  const handleHistoryClick = (term: string) => {
      setSearchTerm(term);
      setShowHistory(false);
  };

  const handleClearHistory = (e: React.MouseEvent) => {
      e.stopPropagation();
      db.clearSearchHistory();
      setSearchHistory([]);
  };

  if (isZenMode) return null;

  return (
    <div className={`hidden lg:flex flex-col gap-6 ${className} pt-8 h-full transition-opacity duration-500`}>
      {/* Search with Command Key hint */}
      <div className="relative group">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleSearchFocus}
          onBlur={() => setTimeout(() => setShowHistory(false), 200)} // Delay to allow click
          className="w-full bg-white/5 border border-white/5 hover:border-white/10 focus:border-indigo-500/50 focus:bg-[#0f172a]/50 rounded-2xl py-3.5 pl-11 pr-12 text-sm text-white placeholder-gray-500 outline-none transition-all shadow-inner backdrop-blur-sm"
          placeholder={t('right.search')}
        />
        {!searchTerm && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none opacity-50 group-focus-within:opacity-100 transition-opacity">
            <Command size={12} className="text-gray-400" />
            <span className="text-[10px] font-bold text-gray-400">K</span>
            </div>
        )}

        {/* Search History Dropdown */}
        {showHistory && searchHistory.length > 0 && !searchTerm && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2">
                <div className="flex justify-between items-center px-4 py-2 border-b border-white/5">
                    <span className="text-xs font-bold text-gray-500 uppercase">Recent</span>
                    <button onClick={handleClearHistory} className="text-xs text-rose-400 hover:underline">Clear</button>
                </div>
                {searchHistory.map((term, i) => (
                    <button key={i} onClick={() => handleHistoryClick(term)} className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center gap-3 text-sm text-gray-300 transition-colors">
                        <Clock size={14} className="text-gray-500" />
                        {term}
                    </button>
                ))}
            </div>
        )}
      </div>

      {/* Trending Section */}
      <div className="glass-panel rounded-3xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>
        
        <div className="flex items-center justify-between mb-6 relative z-10">
           <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
             <TrendingUp size={18} className="text-indigo-400" /> {t('right.trending')}
           </h2>
        </div>
        <div className="space-y-5 relative z-10">
          {trends.slice(0, 4).map((trend, i) => (
            <div key={trend.id} className="cursor-pointer group/item">
              <div className="flex justify-between items-start">
                <p className="text-[11px] text-gray-500 font-medium mb-0.5 flex items-center gap-1">
                  {i === 0 && <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>}
                  {/* Translate Category dynamically */}
                  {t(`category.${trend.category.toLowerCase()}` as any)}
                </p>
                <MoreHorizontal size={14} className="text-gray-600 opacity-0 group-hover/item:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm font-bold text-gray-200 group-hover/item:text-indigo-400 transition-colors duration-300">{trend.topic}</p>
              <p className="text-[10px] text-gray-600 mt-0.5">{trend.postsCount} {t('right.posts')}</p>
            </div>
          ))}
        </div>
        <button className="w-full mt-6 py-3 text-xs font-bold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-xl transition-all border border-indigo-500/20">
          {t('right.viewAll')}
        </button>
      </div>
    </div>
  );
});

export default RightPanel;
