import React, { useEffect, Suspense, useReducer } from 'react';
import { Zap, Loader2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './services/i18n';

// Critical Components
import ServerRail from './components/ServerRail';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import RightPanel from './components/RightPanel';
import CreatePost from './components/CreatePost';
import Stories from './components/Stories';
import AuthView from './components/AuthView';
import MusicPlayer from './components/MusicPlayer';
import Toast, { ToastMessage, ToastType } from './components/Toast';
import Feed from './components/Feed'; 
import GlobalSearch from './components/GlobalSearch'; 

// Lazy Components
const UserProfile = React.lazy(() => import('./components/UserProfile'));
const EditProfileModal = React.lazy(() => import('./components/EditProfileModal'));
const SettingsView = React.lazy(() => import('./components/SettingsView'));
const ChatInterface = React.lazy(() => import('./components/ChatInterface'));
const ExploreGrid = React.lazy(() => import('./components/ExploreGrid'));
const NotificationsView = React.lazy(() => import('./components/NotificationsView'));
const SavedView = React.lazy(() => import('./components/SavedView'));
const ServerView = React.lazy(() => import('./components/ServerView'));
const ShortsViewer = React.lazy(() => import('./components/ShortsViewer'));
const StoryViewer = React.lazy(() => import('./components/StoryViewer')); 
const MarketplaceView = React.lazy(() => import('./components/MarketplaceView')); 
const LiveCenter = React.lazy(() => import('./components/LiveCenter')); 
const WalletView = React.lazy(() => import('./components/WalletView')); 
const EventsView = React.lazy(() => import('./components/EventsView')); 
const NexusID = React.lazy(() => import('./components/NexusID')); 
const AuctionView = React.lazy(() => import('./components/AuctionView')); 
const VaultView = React.lazy(() => import('./components/VaultView')); 
const DaoView = React.lazy(() => import('./components/DaoView')); 
const BountyBoard = React.lazy(() => import('./components/BountyBoard'));
const DriveView = React.lazy(() => import('./components/DriveView')); 
const ClubsView = React.lazy(() => import('./components/ClubsView')); 
const QuestBoard = React.lazy(() => import('./components/QuestBoard'));
const TutorialOverlay = React.lazy(() => import('./components/TutorialOverlay'));
const AdminDashboard = React.lazy(() => import('./components/AdminDashboard'));
const VideoCallModal = React.lazy(() => import('./components/VideoCallModal'));
const AnalyticsView = React.lazy(() => import('./components/AnalyticsView'));
const HoloMap = React.lazy(() => import('./components/HoloMap')); 
const TerminalView = React.lazy(() => import('./components/TerminalView')); 
const LeaderboardView = React.lazy(() => import('./components/LeaderboardView')); 
const NewsView = React.lazy(() => import('./components/NewsView')); 
const MatchView = React.lazy(() => import('./components/MatchView')); 
const LaunchpadView = React.lazy(() => import('./components/LaunchpadView')); 
const JobsView = React.lazy(() => import('./components/JobsView')); 
const VoiceRoom = React.lazy(() => import('./components/VoiceRoom'));
const MediaEditor = React.lazy(() => import('./components/MediaEditor'));
const CreateStory = React.lazy(() => import('./components/CreateStory'));

// Context & Store
import { AuthProvider, useAuth } from './context/AuthContext';
import { useAppStore } from './store/useAppStore'; 
import { soundEngine } from './services/soundService'; 
import { db } from './services/db';
import { NavigationState, TabType } from './types';

const INITIAL_NAV_STATE: NavigationState = {
  mode: 'social', activeTab: 'Home', activeServerId: null, activeOverlay: 'none',
};

type NavAction = 
  | { type: 'SWITCH_TAB'; payload: TabType }
  | { type: 'OPEN_SERVER'; payload: string }
  | { type: 'CLOSE_SERVER' }
  | { type: 'OPEN_OVERLAY'; overlay: NavigationState['activeOverlay']; data?: any }
  | { type: 'CLOSE_OVERLAY' };

function navReducer(state: NavigationState, action: NavAction): NavigationState {
  switch (action.type) {
    case 'SWITCH_TAB': return { ...state, mode: 'social', activeTab: action.payload, activeServerId: null, activeOverlay: 'none' };
    case 'OPEN_SERVER': return { ...state, mode: 'server', activeServerId: action.payload, activeOverlay: 'none' };
    case 'CLOSE_SERVER': return { ...state, mode: 'social', activeServerId: null, activeTab: 'Home' };
    case 'OPEN_OVERLAY': return { ...state, activeOverlay: action.overlay, overlayData: action.data };
    case 'CLOSE_OVERLAY': return { ...state, activeOverlay: 'none', overlayData: undefined };
    default: return state;
  }
}

const SuspenseFallback = () => (
    <div className="flex items-center justify-center w-full h-full min-h-[300px]">
        <Loader2 size={32} className="text-[var(--nexus-accent)] animate-spin" />
    </div>
);

const AuthenticatedApp: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [navState, dispatch] = useReducer(navReducer, INITIAL_NAV_STATE);
  
  const { 
    settings, currentUser, wallet, notifications,
    initApp, updateSettings, addPost, refreshData
  } = useAppStore();

  const [trends, setTrends] = React.useState<any[]>([]);
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showQuestBoard, setShowQuestBoard] = React.useState(false);
  const [showTutorial, setShowTutorial] = React.useState(false);
  const [quotingPost, setQuotingPost] = React.useState<any>(null);
  
  useEffect(() => {
    initApp();
    const loadTrends = () => {
        const mockTrends = [
            { id: 't1', category: 'System', topic: '#NexusV3', postsCount: '1.2M' },
            { id: 't2', category: 'Economy', topic: 'NEX Token', postsCount: '890K' },
            { id: 't3', category: 'Community', topic: 'Holo-Meetup', postsCount: '540K' }
        ];
        setTrends(mockTrends);
    };
    loadTrends();
  }, []);

  useEffect(() => {
      const root = document.documentElement;
      let primary = '#6366f1'; let glow = 'rgba(99, 102, 241, 0.15)'; let dim = 'rgba(99, 102, 241, 0.05)';
      switch (settings.themeColor) {
          case 'cyan': primary = '#06b6d4'; glow = 'rgba(6, 182, 212, 0.15)'; dim = 'rgba(6, 182, 212, 0.05)'; break;
          case 'pink': primary = '#ec4899'; glow = 'rgba(236, 72, 153, 0.15)'; dim = 'rgba(236, 72, 153, 0.05)'; break;
          case 'emerald': primary = '#10b981'; glow = 'rgba(16, 185, 129, 0.15)'; dim = 'rgba(16, 185, 129, 0.05)'; break;
          case 'amber': primary = '#f59e0b'; glow = 'rgba(245, 158, 11, 0.15)'; dim = 'rgba(245, 158, 11, 0.05)'; break;
      }
      root.style.setProperty('--nexus-accent', primary);
      root.style.setProperty('--nexus-accent-glow', glow);
      root.style.setProperty('--nexus-accent-dim', dim);
      
      if (settings.language && i18n.language !== settings.language) {
          i18n.changeLanguage(settings.language);
      }
      soundEngine.setEnabled(settings.soundEnabled);
  }, [settings]);

  const addToast = React.useCallback((type: ToastType, message: string) => {
    setToasts(prev => [...prev, { id: Math.random().toString(), type, message, timestamp: Date.now() }]);
    if(type==='success') soundEngine.playSuccess(); else if(type==='error') soundEngine.playError();
  }, []);
  const removeToast = (id: string) => setToasts(p => p.filter(t => t.id !== id));

  const handleCreatePost = (data: any) => {
    if (data.isMinted && !db.transaction(50, 'outgoing', 'Mint NFT Post')) {
         addToast('error', t('market.funds')); return;
    }
    const newPost = {
      id: Date.now().toString(), user: currentUser || user!, content: data.content, 
      media: data.media, likes: 0, commentsCount: 0, shares: 0, timestamp: 'Just now', tags: [], platformOrigin: 'twitter',
      poll: data.poll, linkPreview: data.linkPreview, status: { isMinted: data.isMinted }
    };
    addPost(newPost as any);
    dispatch({ type: 'CLOSE_OVERLAY' });
    setQuotingPost(null);
    addToast('success', data.isMinted ? t('post.minted') : t('common.success'));
  };

  const handlePostStory = (file: string, type: 'image' | 'video') => {
      // In a real app, upload to DB. Here we simulate success.
      addToast('success', t('story.posted') || 'Story added successfully!');
      dispatch({ type: 'CLOSE_OVERLAY' });
      soundEngine.playSuccess();
  };

  const rootStyle: React.CSSProperties = React.useMemo(() => ({
      ...(settings.uiScale !== 1 ? { transform: `scale(${settings.uiScale})`, transformOrigin: 'top center', width: `${100 / settings.uiScale}%`, height: `${100 / settings.uiScale}dvh`, left: `${(100 - (100 / settings.uiScale) * 100) / 2}%`, top: `${(100 - (100 / settings.uiScale) * 100) / 2}%`, position: 'fixed', } : { width: '100%', height: '100dvh', position: 'fixed', top: 0, left: 0 }),
      overflow: 'hidden', filter: settings.grayscaleMode ? 'grayscale(100%)' : 'none'
  }), [settings.uiScale, settings.grayscaleMode]);

  const isFullPageApp = ['Messages', 'Shorts', 'Admin', 'Terminal', 'Match'].includes(navState.activeTab) || navState.mode === 'server';
  const unreadNotifs = notifications.filter(n => !n.read).length;

  if (!currentUser) return <div className="flex items-center justify-center h-screen bg-[#050b14]"><Loader2 className="animate-spin text-indigo-500" size={40}/></div>;

  return (
    <div className={`fixed inset-0 overflow-hidden text-gray-100 font-sans bg-[#050b14] ${settings.reducedMotion ? 'motion-reduce' : ''}`} style={rootStyle}>
      <Suspense fallback={null}>{showTutorial && <TutorialOverlay onComplete={() => setShowTutorial(false)} />}</Suspense>
      
      <GlobalSearch /> 
      
      <div className="flex w-full h-full relative z-10">
        <ServerRail activeServerId={navState.activeServerId} onServerSelect={(id) => id ? dispatch({ type: 'OPEN_SERVER', payload: id }) : dispatch({ type: 'CLOSE_SERVER' })} />
        
        {navState.mode === 'server' && navState.activeServerId ? (
            <div className="flex-1 min-w-0 flex animate-in fade-in duration-300">
                <Suspense fallback={<SuspenseFallback />}><ServerView server={{ id: navState.activeServerId, name: 'Server', icon: '' }} /></Suspense>
            </div>
        ) : (
            <div className="flex-1 flex w-full max-w-full overflow-hidden relative">
                {!isFullPageApp && <div className={`hidden md:flex w-[80px] xl:w-[280px] shrink-0 border-r border-white/5 bg-[#050b14]/60 backdrop-blur-2xl z-30 ${settings.zenMode ? '-ml-[280px]' : ''}`}><Sidebar activeTab={navState.activeTab} onTabChange={(t) => dispatch({ type: 'SWITCH_TAB', payload: t })} isDarkMode toggleTheme={()=>{}} isZenMode={settings.zenMode} userLevel={currentUser.stats?.level} userXp={currentUser.stats?.xp} maxXp={currentUser.stats?.maxXp} notificationCount={unreadNotifs} language={settings.language} /></div>}
                
                <main className="flex-1 flex flex-col min-w-0 relative bg-transparent h-full">
                    {isFullPageApp ? <div className="absolute inset-0 bg-[#050b14] z-50">
                      <Suspense fallback={<SuspenseFallback />}>
                        {navState.activeTab === 'Messages' && <ChatInterface onBack={() => dispatch({ type: 'SWITCH_TAB', payload: 'Home' })} onVideoCall={(u) => dispatch({ type: 'OPEN_OVERLAY', overlay: 'video-call', data: u })} />}
                        {navState.activeTab === 'Shorts' && <ShortsViewer onClose={() => dispatch({ type: 'SWITCH_TAB', payload: 'Home' })} />}
                        {navState.activeTab === 'Admin' && <AdminDashboard onExit={() => dispatch({ type: 'SWITCH_TAB', payload: 'Home' })} />}
                        {navState.activeTab === 'Terminal' && <TerminalView />}
                        {navState.activeTab === 'Match' && <MatchView />}
                      </Suspense>
                    </div> : <div id="main-content-scroll" className="flex-1 w-full overflow-y-auto custom-scrollbar scroll-smooth"><div className="mx-auto w-full max-w-2xl xl:max-w-3xl px-4 pt-2 pb-safe">
                      <Suspense fallback={<SuspenseFallback />}>
                        {(() => {
                          switch (navState.activeTab) {
                            case 'Explore': return <ExploreGrid />;
                            case 'Profile': return <UserProfile user={currentUser} isOwnProfile onOpenID={() => dispatch({type: 'OPEN_OVERLAY', overlay: 'nexus-id'})} onEditProfile={() => dispatch({type: 'OPEN_OVERLAY', overlay: 'edit-profile'})} />;
                            case 'Settings': return <SettingsView settings={settings} updateSettings={updateSettings} />;
                            case 'Notifications': return <NotificationsView />;
                            case 'Saved': return <SavedView savedPosts={db.getSavedPosts()} onRemove={() => {}} />;
                            case 'Market': return <MarketplaceView walletBalance={wallet.balance} onBuyItem={() => {}} ownedItems={db.getOwnedItems()} searchTerm={searchTerm} />;
                            case 'Live': return <LiveCenter />;
                            case 'Wallet': return <WalletView wallet={wallet} />;
                            case 'Events': return <EventsView searchTerm={searchTerm} />;
                            case 'Auction': return <AuctionView wallet={wallet} onPlaceBid={()=>{}} />; 
                            case 'Vault': return <VaultView wallet={wallet} onStake={()=>{}} onUnstake={()=>{}} />;
                            case 'DAO': return <DaoView />; 
                            case 'Bounties': return <BountyBoard searchTerm={searchTerm} />;
                            case 'Drive': return <DriveView searchTerm={searchTerm} />; 
                            case 'Clubs': return <ClubsView searchTerm={searchTerm} />; 
                            case 'Map': return <HoloMap />; 
                            case 'Leaderboard': return <LeaderboardView />; 
                            case 'News': return <NewsView />; 
                            case 'Launchpad': return <LaunchpadView />; 
                            case 'Jobs': return <JobsView />; 
                            default:
                              return (
                                <>
                                  <div className="mb-6 md:mb-8">
                                    <Stories 
                                        onStoryClick={(id) => dispatch({ type: 'OPEN_OVERLAY', overlay: 'story-viewer', data: id })} 
                                        onCreateStory={() => dispatch({ type: 'OPEN_OVERLAY', overlay: 'create-story' })}
                                    />
                                  </div>
                                  {showQuestBoard && <div className="mb-8 animate-enter"><div className="flex justify-between mb-2"><h3 className="font-bold">{t('common.quests')}</h3><button onClick={() => setShowQuestBoard(false)}><X size={16} className="text-gray-500"/></button></div><QuestBoard quests={db.getQuests()} onClaim={(id) => { /* claim */ }} userLevel={currentUser.stats?.level || 1} /></div>}
                                  <Feed onUserClick={(u) => { /* nav */ }} onQuote={(p) => setQuotingPost(p)} onTagClick={(tag) => setSearchTerm(tag)} />
                                </>
                              );
                        }
                      })()}
                      </Suspense>
                    </div></div>}
                </main>
                <RightPanel searchTerm={searchTerm} setSearchTerm={setSearchTerm} trends={trends} isZenMode={settings.zenMode} language={settings.language} className="w-[350px] pr-6" />
            </div>
        )}
      </div>

      {/* Overlays */}
      <Suspense fallback={null}>
        {navState.activeOverlay === 'create-post' && <CreatePost onPost={handleCreatePost} onClearQuote={() => setQuotingPost(null)} quotingPost={quotingPost} notify={(t, m) => addToast(t, m)} walletBalance={wallet.balance} />}
        {navState.activeOverlay === 'create-story' && <CreateStory onPost={handlePostStory} onClose={() => dispatch({ type: 'CLOSE_OVERLAY' })} />}
        {navState.activeOverlay === 'edit-profile' && <EditProfileModal user={currentUser} onSave={(data) => { db.updateUser(data); refreshData(); dispatch({ type: 'CLOSE_OVERLAY' }); addToast('success', t('profile.saveSuccess')); }} onClose={() => dispatch({ type: 'CLOSE_OVERLAY' })} />}
        {navState.activeOverlay === 'nexus-id' && <NexusID user={currentUser} onClose={() => dispatch({ type: 'CLOSE_OVERLAY' })} />}
        {navState.activeOverlay === 'story-viewer' && <StoryViewer initialUserId={navState.overlayData} onClose={() => dispatch({ type: 'CLOSE_OVERLAY' })} />}
        {navState.activeOverlay === 'video-call' && <VideoCallModal user={navState.overlayData} onEndCall={() => dispatch({ type: 'CLOSE_OVERLAY' })} />}
        {navState.activeOverlay === 'media-editor' && <MediaEditor imageUrl={navState.overlayData} onSave={() => {}} onCancel={() => dispatch({ type: 'CLOSE_OVERLAY' })} />}
      </Suspense>

      <MobileNav activeTab={navState.activeTab} onTabChange={(t) => dispatch({ type: 'SWITCH_TAB', payload: t })} onCompose={() => dispatch({ type: 'OPEN_OVERLAY', overlay: 'create-post' })} />
      <MusicPlayer />
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <AuthenticatedApp />
  </AuthProvider>
);

export default App;