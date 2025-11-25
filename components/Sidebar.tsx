
import React, { memo } from 'react';
import { Home, LayoutGrid, Bell, Mail, Bookmark, User, Settings, Zap, LogOut, Video, ShoppingBag, Radio, Wallet, Calendar, Vote, Briefcase, Cloud, Clock, Users, Gavel, Landmark, Shield, Gamepad2, Palette, Share2, Music, Map, Terminal, PenTool, TrendingUp, Newspaper, Heart, Rocket, Briefcase as BriefcaseIcon } from 'lucide-react';
import { TabType, SupportedLanguage } from '../types';
import { soundEngine } from '../services/soundService';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  className?: string;
  isDarkMode: boolean;
  toggleTheme: () => void;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isZenMode?: boolean;
  userLevel?: number;
  userXp?: number;
  maxXp?: number;
  notificationCount?: number;
  language?: SupportedLanguage; 
}

const Sidebar: React.FC<SidebarProps> = memo(({ 
  className, 
  activeTab, 
  onTabChange, 
  isZenMode,
  userLevel = 1,
  userXp = 0,
  maxXp = 1000,
  notificationCount = 0,
  language
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const navCategories = [
      {
          title: t('nav.social'),
          items: [
            { icon: Home, label: "Home", key: 'nav.home', id: 'nav-home' },
            { icon: LayoutGrid, label: "Explore", key: 'nav.explore', id: 'nav-explore' },
            { icon: Mail, label: "Messages", key: 'nav.messages', id: 'nav-messages' },
            { icon: Bell, label: "Notifications", key: 'nav.notifications', badge: notificationCount > 0 ? notificationCount : undefined, id: 'nav-notifs' },
            { icon: User, label: "Profile", key: 'nav.profile', id: 'nav-profile' },
            { icon: Heart, label: "Match", key: 'nav.match' }, 
          ]
      },
      {
          title: t('nav.community'),
          items: [
             { icon: Users, label: "Clubs", key: 'nav.clubs' }, 
             { icon: Calendar, label: "Events", key: 'nav.events' },
             { icon: Map, label: "Map", key: 'nav.map' },
             { icon: TrendingUp, label: "Leaderboard", key: 'nav.leaderboard' }, 
             { icon: Newspaper, label: "News", key: 'nav.news' }, 
          ]
      },
      {
          title: t('nav.economy'),
          items: [
            { icon: Wallet, label: "Wallet", key: 'nav.wallet', id: 'nav-wallet' },
            { icon: ShoppingBag, label: "Market", key: 'nav.market', id: 'nav-market' },
            { icon: Gavel, label: "Auction", key: 'nav.auction' },
            { icon: Landmark, label: "Vault", key: 'nav.vault' },
            { icon: Vote, label: "DAO", key: 'nav.dao' },
            { icon: Rocket, label: "Launchpad", key: 'nav.launchpad' }, 
            { icon: Briefcase, label: "Bounties", key: 'nav.bounties' },
            { icon: BriefcaseIcon, label: "Jobs", key: 'nav.jobs' }, 
          ]
      },
      {
          title: t('nav.growth'),
          items: [
             { icon: Cloud, label: "Drive", key: 'nav.drive' }, 
          ]
      },
      {
          title: t('nav.media'),
          items: [
            { icon: Video, label: "Shorts", key: 'nav.shorts' },
            { icon: Radio, label: "Live", key: 'nav.live', special: true },
          ]
      }
  ];

  // Admin & Power User
  const systemItems = [];
  if (user?.roles.includes('admin')) {
      systemItems.push({ icon: Shield, label: "Admin", key: 'nav.admin' });
  }
  // Everyone gets terminal in cyberpunk app
  systemItems.push({ icon: Terminal, label: "Terminal", key: 'nav.terminal' });

  if (systemItems.length > 0) {
      navCategories.push({
          title: t('nav.system'),
          items: systemItems
      });
  }

  const xpPercentage = Math.min(100, Math.max(0, (userXp / maxXp) * 100));

  const handleTabClick = (label: TabType) => {
      if (label !== activeTab) {
          soundEngine.playClick();
          onTabChange(label);
      }
  };

  if (isZenMode) return null;

  return (
    <div className={`hidden md:flex flex-col h-full py-6 ${className}`}>
      {/* Logo */}
      <div className="px-3 xl:px-6 mb-6 flex items-center justify-center xl:justify-start gap-3 cursor-pointer group" onClick={() => handleTabClick('Home')}>
        <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-[var(--nexus-accent)] to-purple-600 flex items-center justify-center shadow-[0_0_20px_var(--nexus-accent-glow)] group-hover:scale-105 transition-transform duration-500">
          <Zap size={18} className="text-white fill-white" />
        </div>
        <div className="hidden xl:block animate-enter">
          <h1 className="text-lg font-bold tracking-tight text-white font-display">Nexus</h1>
        </div>
      </div>

      {/* Gamification Widget */}
      <div className="hidden xl:block px-6 mb-4 animate-enter" id="xp-widget">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors group" onClick={() => handleTabClick('Profile')}>
              <div className="flex justify-between items-end mb-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-white transition-colors">{t('common.lvl')} {userLevel}</span>
                  <span className="text-[10px] font-bold" style={{ color: 'var(--nexus-accent)' }}>{Math.floor(userXp)} XP</span>
              </div>
              <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full shadow-[0_0_10px_var(--nexus-accent-glow)] transition-all duration-700 ease-out"
                    style={{ width: `${xpPercentage}%`, background: 'var(--nexus-accent)' }}
                  ></div>
              </div>
          </div>
      </div>

      {/* Categorized Navigation */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-6">
        {navCategories.map((category, idx) => (
            <div key={idx} className="animate-enter" style={{ animationDelay: `${idx * 50}ms` }}>
                <h3 className="hidden xl:block text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">{category.title}</h3>
                <div className="space-y-0.5">
                    {category.items.map((item) => {
                        const isActive = activeTab === item.label;
                        return (
                            <button
                            key={item.label}
                            id={(item as any).id}
                            onMouseEnter={() => soundEngine.playHover()}
                            onClick={() => handleTabClick(item.label as TabType)}
                            className={`relative flex items-center w-full p-2.5 rounded-xl transition-all duration-300 group overflow-hidden ${
                                isActive 
                                ? 'text-white bg-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] border border-white/5' 
                                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'
                            }`}
                            >
                            {isActive && (
                                <div 
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full shadow-[0_0_8px_var(--nexus-accent)]" 
                                    style={{ backgroundColor: 'var(--nexus-accent)' }}
                                />
                            )}

                            <div className="relative flex items-center justify-center xl:justify-start w-full xl:w-auto z-10">
                                <item.icon 
                                size={18} 
                                className={`transition-all duration-500 ${isActive ? "drop-shadow-[0_0_8px_var(--nexus-accent-glow)]" : "group-hover:text-white"}`}
                                style={isActive ? { color: 'var(--nexus-accent)' } : {}}
                                strokeWidth={isActive ? 2.5 : 2}
                                />
                                {item.label === 'Live' && (
                                    <span className="absolute top-0 right-0 xl:left-3 xl:-top-1 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_#ef4444]"></span>
                                )}
                                {(item as any).badge && (
                                <span className="absolute -top-1 -right-1 xl:left-3 xl:-top-2 bg-rose-500 text-white text-[9px] font-bold rounded-full h-3.5 w-3.5 flex items-center justify-center border border-[#050b14] shadow-lg animate-bounce">
                                    {(item as any).badge}
                                </span>
                                )}
                            </div>
                            <span className={`ml-3 text-[13px] hidden xl:block z-10 transition-all ${isActive ? 'font-semibold text-white' : 'font-medium'}`}>
                                {t(item.key)}
                            </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        ))}

        {/* Settings & System */}
        <div className="pt-4 border-t border-white/5">
             <button onClick={() => handleTabClick('Saved')} className="relative flex items-center w-full p-2.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                <div className="w-full xl:w-auto flex justify-center"><Bookmark size={18} /></div>
                <span className="ml-3 text-[13px] hidden xl:block font-medium">{t('nav.saved')}</span>
            </button>
            <button onClick={() => handleTabClick('Settings')} className="relative flex items-center w-full p-2.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                <div className="w-full xl:w-auto flex justify-center"><Settings size={18} /></div>
                <span className="ml-3 text-[13px] hidden xl:block font-medium">{t('nav.settings')}</span>
            </button>
        </div>

        {/* User Mini Profile */}
        <div className="mt-auto px-2 xl:px-4 pt-4">
        <div className="flex items-center justify-center xl:justify-start gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-all border border-transparent hover:border-white/5 group" onClick={() => handleTabClick('Profile')}>
          <img src={user?.avatar || "https://picsum.photos/seed/me/100"} alt="User" className="w-8 h-8 rounded-lg bg-gray-800 ring-1 ring-transparent group-hover:ring-white/10 transition-all" />
          <div className="hidden xl:block overflow-hidden">
            <p className="text-sm font-bold text-white truncate group-hover:text-indigo-300 transition-colors">{user?.name || 'Guest'}</p>
            <p className="text-[10px] text-gray-500 truncate">@{user?.handle || 'guest'}</p>
          </div>
          <LogOut size={16} className="ml-auto text-gray-600 hover:text-red-400 hidden xl:block opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" />
        </div>
      </div>
    </div>
  );
});

export default Sidebar;
