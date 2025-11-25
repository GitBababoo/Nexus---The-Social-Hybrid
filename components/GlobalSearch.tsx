
import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, User, Settings, Moon, Sun, Volume2, ArrowRight, Zap, Wallet, LayoutGrid } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from 'react-i18next';
import { soundEngine } from '../services/soundService';
import { db } from '../services/db';

// Logic God: Weighted Fuzzy Search Simulation
const GlobalSearch: React.FC = () => {
  const { t } = useTranslation();
  const { isSearchOpen, toggleSearch, updateSettings, settings, activeTab } = useAppStore();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Results storage
  const [results, setResults] = useState<any[]>([]);

  // Handle Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearch();
      }
      if (isSearchOpen && e.key === 'Escape') {
        toggleSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, toggleSearch]);

  // Focus Input on Open
  useEffect(() => {
    if (isSearchOpen) {
        setTimeout(() => inputRef.current?.focus(), 50);
        soundEngine.playHover();
    } else {
        setQuery('');
    }
  }, [isSearchOpen]);

  // The Search Logic (Simulated Indexing)
  useEffect(() => {
    if (!query) {
        // Default Suggestions
        setResults([
            { id: 'nav-feed', type: 'nav', label: 'Go to Feed', icon: LayoutGrid, action: () => window.location.href = '/' }, 
            { id: 'nav-wallet', type: 'nav', label: 'Open Wallet', icon: Wallet, action: () => {} },
            { id: 'theme-toggle', type: 'action', label: 'Toggle Theme', icon: settings.darkMode ? Sun : Moon, action: () => updateSettings('darkMode', !settings.darkMode) },
            { id: 'sys-sound', type: 'action', label: 'Toggle Sound', icon: Volume2, action: () => updateSettings('soundEnabled', !settings.soundEnabled) },
        ]);
        return;
    }

    const lowerQ = query.toLowerCase();
    const allUsers = db.getAllUsers();
    
    // 1. Search Users
    const matchedUsers = allUsers
        .filter(u => u.name.toLowerCase().includes(lowerQ) || u.handle.toLowerCase().includes(lowerQ))
        .slice(0, 3)
        .map(u => ({ id: u.id, type: 'user', label: u.name, sub: `@${u.handle}`, icon: User, action: () => console.log('Nav to user') }));

    // 2. Search Actions/Settings
    const actions = [
        { id: 'set-dark', label: 'Appearance: Dark Mode', type: 'setting' },
        { id: 'set-lang', label: 'Language: English', type: 'setting' },
        { id: 'page-market', label: 'Open Market', type: 'nav' },
        { id: 'page-settings', label: 'Open Settings', type: 'nav' },
    ].filter(a => a.label.toLowerCase().includes(lowerQ))
     .map(a => ({ ...a, icon: Settings, action: () => {} }));

    setResults([...matchedUsers, ...actions]);
    setActiveIndex(0);
  }, [query, settings]);

  const handleExecute = (item: any) => {
      soundEngine.playClick();
      if (item.action) item.action();
      toggleSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
          setActiveIndex(prev => (prev + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
          setActiveIndex(prev => (prev - 1 + results.length) % results.length);
      } else if (e.key === 'Enter') {
          if (results[activeIndex]) handleExecute(results[activeIndex]);
      }
  };

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] px-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={toggleSearch}></div>
        
        <div className="relative w-full max-w-2xl bg-[#0f172a] rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            {/* Input */}
            <div className="flex items-center px-4 py-4 border-b border-white/5 gap-3">
                <Search className="text-gray-400" size={20} />
                <input 
                    ref={inputRef}
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a command or search..." 
                    className="flex-1 bg-transparent text-lg text-white placeholder-gray-500 focus:outline-none"
                />
                <div className="hidden md:flex items-center gap-1 bg-white/10 px-2 py-1 rounded text-[10px] text-gray-400 font-mono border border-white/5">
                    <span className="text-xs">ESC</span>
                </div>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                {results.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No results found.</div>
                ) : (
                    <div className="space-y-1">
                        {results.map((item, idx) => (
                            <div 
                                key={item.id}
                                onClick={() => handleExecute(item)}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all group ${idx === activeIndex ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-white/5'}`}
                                onMouseEnter={() => setActiveIndex(idx)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${idx === activeIndex ? 'bg-white/20' : 'bg-white/5 text-gray-400'}`}>
                                        <item.icon size={18} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">{item.label}</div>
                                        {item.sub && <div className={`text-xs ${idx === activeIndex ? 'text-indigo-200' : 'text-gray-500'}`}>{item.sub}</div>}
                                    </div>
                                </div>
                                {idx === activeIndex && <ArrowRight size={16} className="animate-pulse" />}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Footer */}
            <div className="bg-[#0a0f1c] px-4 py-2 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500 font-mono">
                <div className="flex gap-4">
                    <span><b className="text-gray-300">↑↓</b> navigate</span>
                    <span><b className="text-gray-300">↵</b> select</span>
                </div>
                <div className="flex items-center gap-1 text-indigo-400">
                    <Zap size={10} /> Nexus Search
                </div>
            </div>
        </div>
    </div>
  );
};

export default GlobalSearch;
