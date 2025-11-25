import { Post, User, AppSettings, Wallet, ChatMessage, Product, AuctionItem, Bounty, Proposal, Course, Club, DriveFile, Quest, Event, LiveStream, Notification, ShortVideo, ChatContact, Role, Report, SystemLog, Story } from '../types';

// --- CONSTANTS ---
const KEYS = {
  USERS: 'nexus_users_db_v3', 
  SESSION: 'nexus_active_session_v3', 
  POSTS: 'nexus_posts_v3',
  SETTINGS: 'nexus_settings_v3',
  WALLET: 'nexus_wallet_v3', 
  CHATS: 'nexus_chats_v3',
  NOTIFS: 'nexus_notifs_v3',
  STORIES: 'nexus_stories_v3',
  LOGS: 'nexus_logs_v3',
  LAST_LOGIN: 'nexus_last_login_v3',
  // Fix: Added missing keys for various app features
  SEARCH_HISTORY: 'nexus_search_history_v3',
  SAVED_POSTS: 'nexus_saved_posts_v3',
  OWNED_ITEMS: 'nexus_owned_items_v3',
  REPORTS: 'nexus_reports_v3'
};

// Default Settings
const DEFAULT_SETTINGS: AppSettings = {
  uiScale: 1,
  themeColor: 'indigo',
  darkMode: true,
  zenMode: false,
  grayscaleMode: false,
  backgroundStyle: 'mesh',
  reducedMotion: false,
  highContrast: false,
  fontSize: 'medium',
  colorBlindMode: 'none',
  privateAccount: false,
  activityStatus: true,
  readReceipts: true,
  allowTagging: 'everyone',
  allowMessages: 'everyone',
  blurSensitiveContent: true,
  blockedUsers: [],
  mutedWords: [],
  pushNotifications: true,
  pushTypes: { likes: true, comments: true, mentions: true, follows: true, messages: true, events: true, system: true },
  emailNotifications: false,
  marketingEmails: false,
  autoPlayVideo: true,
  dataSaver: false,
  highQualityUploads: true,
  soundEnabled: true,
  volumeMaster: 80,
  volumeEffects: 100,
  volumeAmbient: 50,
  language: 'en',
  streamerMode: false,
  twoFactorEnabled: false,
  activeSessions: 1,
  forYouPersonalization: true,
  contentLanguage: ['en'],
  currency: 'NEX'
};

// --- SEED DATA ---
const generateGenesisUsers = (): User[] => [
    { id: 'u1', name: 'Alice Chen', handle: 'alice_c', avatar: 'https://picsum.photos/seed/u1/200', bio: 'Digital Nomad | UI Designer', roles: ['user'], hasCompletedOnboarding: true, joinedDate: '2023-01-15', isVerified: true, stats: { followers: '1.2k', following: '450', posts: 120, level: 15, xp: 3200, maxXp: 5000 } },
    { id: 'u2', name: 'Bob Smith', handle: 'builder_bob', avatar: 'https://picsum.photos/seed/u2/200', bio: 'Building the open web.', roles: ['creator'], hasCompletedOnboarding: true, joinedDate: '2023-02-20', stats: { followers: '8.5k', following: '20', posts: 450, level: 42, xp: 8900, maxXp: 10000 } },
    { id: 'nexus_ai', name: 'Nexus AI', handle: 'gemini', avatar: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg', roles: ['admin'], hasCompletedOnboarding: true, bio: 'System Intelligence', status: 'online' }
];

const generateGenesisPosts = (users: User[]): Post[] => [
    { id: 'p1', user: users[1], content: "Just deployed the new smart contract! 🚀 #web3 #crypto", likes: 120, commentsCount: 15, shares: 5, timestamp: '2h ago', tags: ['web3', 'crypto'] },
    { id: 'p2', user: users[0], content: "Loving the neon vibes in Tokyo tonight. 🌃", image: 'https://picsum.photos/seed/tokyo/600/400', likes: 340, commentsCount: 42, shares: 12, timestamp: '5h ago', tags: ['travel', 'vibes'] },
];

// Fix: Added mock data generators for missing data types
const generateGenesisLogs = (): SystemLog[] => Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    action: ['LOGIN', 'POST', 'UPDATE', 'WARN'][i % 4],
    details: `User u${i % 2 + 1} performed action.`,
    timestamp: new Date(Date.now() - i * 1000 * 60 * 5).toLocaleString(),
    severity: i % 4 === 3 ? 'warning' : 'info'
}));

const generateGenesisReports = (users: User[], posts: Post[]): Report[] => posts.length > 0 && users.length > 0 ? [
    { id: 'r1', targetId: posts[0].id, targetType: 'post', reporterId: users[0].id, reason: 'Spam content', timestamp: '1d ago', status: 'pending' },
    { id: 'r2', targetId: users[1].id, targetType: 'user', reporterId: users[0].id, reason: 'Impersonation', timestamp: '2d ago', status: 'resolved' },
] : [];

const generateGenesisShorts = (): ShortVideo[] => [
    { id: 'short1', user: 'alice_c', desc: 'My new dev setup! #devlife', likes: 4500, comments: 120, music: 'LoFi Beats', color: 'indigo', isLiked: false },
    { id: 'short2', user: 'builder_bob', desc: 'VR painting is insane', likes: 12300, comments: 450, music: 'Synthwave Dreams', color: 'purple', isLiked: true },
];

const generateGenesisEvents = (users: User[]): Event[] => users.length > 0 ? [
    { id: 'evt1', title: 'VR Meetup', description: 'Explore the metaverse with us.', date: 'Dec 25, 2024', location: 'VR Chat', image: 'https://picsum.photos/seed/event1/600/300', attendees: 120, category: 'Tech', host: users[0], isInterested: true },
] : [];

const generateGenesisAuctions = (): AuctionItem[] => [
    { id: 'auc1', name: 'Rare Cyberpunk Jacket', image: 'https://picsum.photos/seed/auc1/400', currentBid: 500, minBidIncrement: 20, endTime: Date.now() + 3600000, bidders: 5, highestBidder: 'alice_c' },
];

const generateGenesisProposals = (): Proposal[] => [
    { id: 'prop1', title: 'Increase Staking Rewards', description: 'Proposal to increase APY from 12.5% to 15%.', votesFor: 1200, votesAgainst: 300, status: 'Active', endTime: '3 days' },
];

const generateGenesisBounties = (): Bounty[] => [
    { id: 'boun1', title: 'Fix UI Bug', description: 'The main feed is not rendering properly on mobile.', reward: 100, difficulty: 'Easy', category: 'Dev', status: 'Open', employer: 'Nexus Corp' },
];

const generateGenesisCourses = (): Course[] => [
    { id: 'cour1', title: 'Intro to Web3', instructor: 'Bob Smith', progress: 0, totalLessons: 12, image: 'https://picsum.photos/seed/course1/400', category: 'Web3', isEnrolled: false },
];

const generateGenesisDriveFiles = (): DriveFile[] => [
    { id: 'file1', name: 'Project Brief.doc', type: 'doc', size: '1.2 MB', modified: '2 days ago' },
];

const generateGenesisClubs = (): Club[] => [
    { id: 'club1', name: 'Crypto Traders', members: '1.2k', description: 'Discussing market trends.', image: 'https://picsum.photos/seed/club1/600', isJoined: false },
];

const generateGenesisQuests = (): Quest[] => [
    { id: 'q1', title: 'First Post', description: 'Share your first thought.', current: 1, target: 1, rewardXp: 100, rewardCoin: 10, isClaimed: true },
    { id: 'q2', title: 'Engage!', description: 'Like 5 posts.', current: 2, target: 5, rewardXp: 50, rewardCoin: 5, isClaimed: false },
];

class DatabaseService {
  private users: User[] = [];
  private posts: Post[] = [];
  private stories: Story[] = [];
  private notifications: Notification[] = [];
  // Fix: Added missing properties for stateful data
  private logs: SystemLog[] = [];
  private reports: Report[] = [];
  private shorts: ShortVideo[] = [];
  private events: Event[] = [];
  private auctions: AuctionItem[] = [];
  private proposals: Proposal[] = [];
  private bounties: Bounty[] = [];
  private courses: Course[] = [];
  private driveFiles: DriveFile[] = [];
  private clubs: Club[] = [];
  private quests: Quest[] = [];


  constructor() {
    this.loadData();
  }

  private loadData() {
    try {
      // Load or Seed Users
      const usersRaw = localStorage.getItem(KEYS.USERS);
      if (usersRaw) {
        this.users = JSON.parse(usersRaw);
      } else {
        this.users = generateGenesisUsers();
        this.save(KEYS.USERS, this.users);
      }
      
      // Load or Seed Posts
      const postsRaw = localStorage.getItem(KEYS.POSTS);
      if (postsRaw) {
        this.posts = JSON.parse(postsRaw);
      } else {
        this.posts = generateGenesisPosts(this.users);
        this.save(KEYS.POSTS, this.posts);
      }

      // Load Notifications
      const notifsRaw = localStorage.getItem(KEYS.NOTIFS);
      this.notifications = notifsRaw ? JSON.parse(notifsRaw) : [];

      // Load Stories
      const storiesRaw = localStorage.getItem(KEYS.STORIES);
      this.stories = storiesRaw ? JSON.parse(storiesRaw) : [];

      // Fix: Load or seed other data types
      const logsRaw = localStorage.getItem(KEYS.LOGS);
      this.logs = logsRaw ? JSON.parse(logsRaw) : generateGenesisLogs();

      const reportsRaw = localStorage.getItem(KEYS.REPORTS);
      this.reports = reportsRaw ? JSON.parse(reportsRaw) : generateGenesisReports(this.users, this.posts);

      this.shorts = generateGenesisShorts();
      this.events = generateGenesisEvents(this.users);
      this.auctions = generateGenesisAuctions();
      this.proposals = generateGenesisProposals();
      this.bounties = generateGenesisBounties();
      this.courses = generateGenesisCourses();
      this.driveFiles = generateGenesisDriveFiles();
      this.clubs = generateGenesisClubs();
      this.quests = generateGenesisQuests();

    } catch (e) {
      console.error("DB Load Error", e);
    }
  }

  private save(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error("Storage Limit Reached", e);
    }
  }

  // --- User Methods ---
  public getAllUsers() { return this.users; }
  public getUser(id?: string): User {
      const targetId = id || this.getCurrentUserId();
      return this.users.find(u => u.id === targetId) || this.users[0];
  }
  public getCurrentUserId() { return localStorage.getItem(KEYS.SESSION); }
  public setSession(id: string) { localStorage.setItem(KEYS.SESSION, id); }
  public clearSession() { localStorage.removeItem(KEYS.SESSION); }
  
  public updateUser(updates: Partial<User>) {
      const id = this.getCurrentUserId();
      if (!id) return;
      this.users = this.users.map(u => u.id === id ? { ...u, ...updates } : u);
      this.save(KEYS.USERS, this.users);
  }

  // --- Post Methods ---
  public getPosts() { return this.posts; }
  public createPost(post: Post) {
      this.posts.unshift(post);
      this.save(KEYS.POSTS, this.posts);
      // Update user post count
      this.users = this.users.map(u => u.id === post.user.id ? { 
          ...u, stats: { ...u.stats!, posts: (u.stats?.posts || 0) + 1 } 
      } : u);
      this.save(KEYS.USERS, this.users);
  }
  public likePost(postId: string) {
      this.posts = this.posts.map(p => p.id === postId ? { 
          ...p, 
          likes: p.userReaction === 'like' ? p.likes - 1 : p.likes + 1,
          userReaction: p.userReaction === 'like' ? undefined : 'like'
      } : p);
      this.save(KEYS.POSTS, this.posts);
  }

  // --- Chat Methods ---
  public getContacts(): ChatContact[] {
      const myId = this.getCurrentUserId();
      // Filter out myself, map rest to contacts
      return this.users.filter(u => u.id !== myId && u.id !== 'nexus_ai').map(u => {
          const history = this.getChatHistory(u.id);
          const lastMsg = history.length > 0 ? history[history.length - 1].text : 'Start a conversation';
          return {
              id: u.id,
              user: u,
              lastMessage: lastMsg.substring(0, 30),
              unread: 0 // In a real app, calculate based on read status
          };
      });
  }

  public getChatHistory(contactId: string): ChatMessage[] {
      const key = `${KEYS.CHATS}_${contactId}`;
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
  }

  public saveMessage(contactId: string, msg: ChatMessage) {
      const history = this.getChatHistory(contactId);
      history.push(msg);
      localStorage.setItem(`${KEYS.CHATS}_${contactId}`, JSON.stringify(history));
  }

  public resetUnread(contactId: string) { /* reset logic */ }

  // --- Settings ---
  public getSettings(): AppSettings {
      const raw = localStorage.getItem(KEYS.SETTINGS);
      return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  }
  public saveSettings(s: AppSettings) { this.save(KEYS.SETTINGS, s); }

  // --- Wallet ---
  public getWallet(): Wallet {
      const raw = localStorage.getItem(KEYS.WALLET);
      return raw ? JSON.parse(raw) : { balance: 500, staked: 0, currency: 'NEX', address: '0x' + Math.random().toString(16).substr(2, 8), transactions: [] };
  }
  public transaction(amount: number, type: 'incoming' | 'outgoing', description: string): boolean {
      const w = this.getWallet();
      if (type === 'outgoing' && w.balance < amount) return false;
      w.balance += type === 'incoming' ? amount : -amount;
      w.transactions.unshift({ id: Date.now().toString(), type, amount, description, date: new Date().toLocaleDateString(), status: 'completed' });
      this.save(KEYS.WALLET, w);
      return true;
  }

  // --- Misc ---
  public getNotifications() { return this.notifications; }
  public getStories() { return this.stories; }
  
  // --- Auth ---
  public findUserByEmail(email: string) { return this.users.find(u => u.email === email || u.handle === email); }
  public createUser(email: string, passwordHash: string, name: string, phone: string, securityQuestion: string, securityAnswerHash: string, backupCodeHash: string): User {
      const newUser: User = {
          id: `u-${Date.now()}`,
          name, handle: name.toLowerCase().replace(/\s+/g, '_') + Math.floor(Math.random()*100),
          email, phoneNumber: phone, avatar: `https://ui-avatars.com/api/?name=${name}&background=random`,
          roles: ['user'], hasCompletedOnboarding: true, joinedDate: new Date().toISOString(),
          stats: { followers: '0', following: '0', posts: 0, level: 1, xp: 0, maxXp: 1000 },
          securityQuestion, securityAnswerHash, backupCodeHash, isBanned: false
      };
      (newUser as any).passwordHash = passwordHash;
      this.users.push(newUser);
      this.save(KEYS.USERS, this.users);
      return newUser;
  }
  public resetPassword(id: string, hash: string) {
      this.users = this.users.map(u => u.id === id ? { ...u, passwordHash: hash } as any : u);
      this.save(KEYS.USERS, this.users);
  }
  // Fix: Implemented all missing methods
  public getSearchHistory(): string[] { const raw = localStorage.getItem(KEYS.SEARCH_HISTORY); return raw ? JSON.parse(raw) : ['#NexusV3', 'AI', 'Cyberpunk']; }
  public clearSearchHistory() { localStorage.removeItem(KEYS.SEARCH_HISTORY); }
  public getSavedPosts(): Post[] { const raw = localStorage.getItem(KEYS.SAVED_POSTS); const ids = raw ? JSON.parse(raw) : []; return this.posts.filter(p => ids.includes(p.id)); }
  public getOwnedItems(): string[] { const raw = localStorage.getItem(KEYS.OWNED_ITEMS); return raw ? JSON.parse(raw) : []; }
  public exportUserData(): string { return JSON.stringify({ users: this.users, posts: this.posts, settings: this.getSettings() }, null, 2); }
  public getSystemLogs(): SystemLog[] { return this.logs; }
  public markAllRead(): Notification[] { this.notifications.forEach(n => n.read = true); return this.notifications; }
  public markRead(id: string): Notification[] { const notif = this.notifications.find(n => n.id === id); if (notif) notif.read = true; return this.notifications; }
  public getShorts(): ShortVideo[] { return this.shorts; }
  public likeShort(id: string): ShortVideo[] { this.shorts = this.shorts.map(s => s.id === id ? { ...s, isLiked: !s.isLiked, likes: s.isLiked ? s.likes - 1 : s.likes + 1 } : s); return this.shorts; }
  public getEvents(): Event[] { return this.events; }
  public toggleEventInterest(id: string): Event[] { this.events = this.events.map(e => e.id === id ? { ...e, isInterested: !e.isInterested } : e); return this.events; }
  public getAuctions(): AuctionItem[] { return this.auctions; }
  public getProposals(): Proposal[] { return this.proposals; }
  public voteProposal(id: string, vote: 'for' | 'against'): Proposal[] { this.proposals = this.proposals.map(p => p.id === id ? { ...p, userVoted: vote, votesFor: vote === 'for' ? p.votesFor + 1 : p.votesFor, votesAgainst: vote === 'against' ? p.votesAgainst + 1 : p.votesAgainst } : p); return this.proposals; }
  public getBounties(): Bounty[] { return this.bounties; }
  public acceptBounty(id: string): Bounty[] { this.bounties = this.bounties.map(b => b.id === id ? { ...b, status: 'In Progress' } : b); return this.bounties; }
  public getCourses(): Course[] { return this.courses; }
  public enrollCourse(id: string): Course[] { this.courses = this.courses.map(c => c.id === id ? { ...c, isEnrolled: true, progress: 5 } : c); return this.courses; }
  public getDriveFiles(): DriveFile[] { return this.driveFiles; }
  public uploadFile(file: DriveFile): DriveFile[] { this.driveFiles.unshift(file); return this.driveFiles; }
  public getClubs(): Club[] { return this.clubs; }
  public joinClub(id: string): Club[] { this.clubs = this.clubs.map(c => c.id === id ? { ...c, isJoined: !c.isJoined } : c); return this.clubs; }
  public promoteUser(id: string) { this.users = this.users.map(u => u.id === id ? { ...u, roles: ['admin', ...u.roles.filter(r => r !== 'admin')] } : u); this.save(KEYS.USERS, this.users); }
  public toggleVerifyUser(id: string) { this.users = this.users.map(u => u.id === id ? { ...u, isVerified: !u.isVerified } : u); this.save(KEYS.USERS, this.users); }
  public getReports(): Report[] { return this.reports; }
  public toggleBanUser(id: string) { this.users = this.users.map(u => u.id === id ? { ...u, isBanned: !u.isBanned } : u); this.save(KEYS.USERS, this.users); }
  public resolveReport(id: string, status: 'resolved' | 'dismissed') { this.reports = this.reports.map(r => r.id === id ? { ...r, status } : r); this.save(KEYS.REPORTS, this.reports); }
  public nuke() { Object.values(KEYS).forEach(k => localStorage.removeItem(k)); window.location.reload(); }
  public deletePost(id: string) { this.posts = this.posts.filter(p => p.id !== id); this.save(KEYS.POSTS, this.posts); }
  public getQuests(): Quest[] { return this.quests; }
}

export const db = new DatabaseService();
