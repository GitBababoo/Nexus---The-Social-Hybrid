
import React, { useState, useEffect, useRef } from 'react';
import { Home, LayoutGrid, Plus, ShoppingBag, User } from 'lucide-react';
import { TabType } from '../types';

interface MobileNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onCompose: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onTabChange, onCompose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const threshold = 10; // Sensitivity

  // Liquid UX: Hide on scroll down, Show on scroll up immediately
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Don't trigger on tiny movements or bounce
      if (Math.abs(currentScrollY - lastScrollY.current) < threshold) return;

      // Logic: If scrolling DOWN AND not at top -> Hide
      // If scrolling UP -> Show
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false); 
      } else {
        setIsVisible(true); 
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getIconClass = (tabName: TabType) => 
    activeTab === tabName 
      ? 'text-indigo-400 scale-110 drop-shadow-[0_0_15px_rgba(99,102,241,0.8)]' 
      : 'text-gray-500 hover:text-gray-300';

  return (
    <div 
        className={`md:hidden fixed bottom-0 left-0 right-0 z-[90] bg-[#050b14]/80 backdrop-blur-2xl border-t border-white/10 pb-safe transition-transform duration-500 cubic-bezier(0.2, 0.8, 0.2, 1) ${isVisible ? 'translate-y-0' : 'translate-y-[150%]'}`}
    >
      <div className="flex items-center justify-around max-w-md mx-auto h-[64px] relative px-4">
        
        <button 
          onClick={() => onTabChange('Home')}
          className="flex-1 flex flex-col items-center justify-center h-full active:scale-90 transition-transform"
        >
          <Home size={26} className={`transition-all duration-300 ${getIconClass('Home')}`} strokeWidth={activeTab === 'Home' ? 2.5 : 2} />
        </button>

        <button 
          onClick={() => onTabChange('Explore')}
          className="flex-1 flex flex-col items-center justify-center h-full active:scale-90 transition-transform"
        >
          <LayoutGrid size={26} className={`transition-all duration-300 ${getIconClass('Explore')}`} strokeWidth={activeTab === 'Explore' ? 2.5 : 2} />
        </button>

        {/* Floating Action Button (FAB) - Pushes up slightly with a glow */}
        <div className="relative -top-6 w-16 flex justify-center pointer-events-none">
            <button 
                onClick={onCompose}
                className="pointer-events-auto w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.6)] border-[4px] border-[#050b14] active:scale-90 transition-transform hover:scale-110 group relative z-10"
            >
                <Plus size={28} className="text-white group-hover:rotate-90 transition-transform duration-300" />
            </button>
        </div>

        <button 
          onClick={() => onTabChange('Market')}
          className="flex-1 flex flex-col items-center justify-center h-full active:scale-90 transition-transform"
        >
          <ShoppingBag size={26} className={`transition-all duration-300 ${getIconClass('Market')}`} strokeWidth={activeTab === 'Market' ? 2.5 : 2} />
        </button>

        <button 
          onClick={() => onTabChange('Profile')}
          className="flex-1 flex flex-col items-center justify-center h-full active:scale-90 transition-transform"
        >
          <User size={26} className={`transition-all duration-300 ${getIconClass('Profile')}`} strokeWidth={activeTab === 'Profile' ? 2.5 : 2} />
        </button>

      </div>
    </div>
  );
};

export default MobileNav;
