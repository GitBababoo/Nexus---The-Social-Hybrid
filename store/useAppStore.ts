import { create } from 'zustand';
import { db } from '../services/db';
import { Post, User, AppSettings, Notification, Wallet } from '../types';
import { soundEngine } from '../services/soundService';

interface AppState {
  currentUser: User | null;
  posts: Post[];
  feed: Post[];
  notifications: Notification[];
  wallet: Wallet;
  settings: AppSettings;
  isLoading: boolean;
  isFeedRefreshing: boolean;
  activeTab: string;
  isSearchOpen: boolean;
  hasNewPosts: boolean;
  
  // Call State
  incomingCall: User | null;
  
  initApp: () => Promise<void>;
  refreshData: () => void;
  refreshFeed: () => void;
  toggleLikePost: (postId: string) => void;
  addPost: (post: Post) => void;
  updateSettings: (key: keyof AppSettings, value: any) => void;
  setCurrentUser: (user: User) => void;
  toggleSearch: () => void;
  setIncomingCall: (user: User | null) => void;
  startPhantomEngine: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  posts: [], feed: [], notifications: [],
  wallet: { balance: 0, staked: 0, currency: 'NEX', address: '', transactions: [] },
  settings: {} as AppSettings,
  isLoading: true,
  isFeedRefreshing: false,
  activeTab: 'Home',
  isSearchOpen: false,
  hasNewPosts: false,
  incomingCall: null,

  initApp: async () => {
    const user = db.getUser();
    set({
      currentUser: user,
      settings: db.getSettings(),
      posts: db.getPosts(),
      feed: db.getPosts(), // Basic sort logic here if needed
      wallet: db.getWallet(),
      notifications: db.getNotifications(),
      isLoading: false
    });
    get().startPhantomEngine();
  },

  refreshData: () => {
    set({ currentUser: db.getUser(), wallet: db.getWallet(), notifications: db.getNotifications() });
  },

  refreshFeed: () => {
    set({ isFeedRefreshing: true });
    // The Gemini call that was here is now removed.
    // The feed will now "refresh" by re-fetching from the local DB.
    // This satisfies the removal request and will reflect any other changes.
    const freshPosts = db.getPosts();
    // Simulate a network delay for better UX
    setTimeout(() => {
        set({ posts: freshPosts, feed: freshPosts, isFeedRefreshing: false, hasNewPosts: false });
        soundEngine.playSuccess();
    }, 700);
  },

  toggleLikePost: (postId: string) => {
    db.likePost(postId);
    const update = (list: Post[]) => list.map(p => p.id === postId ? { ...p, likes: p.userReaction==='like' ? p.likes-1 : p.likes+1, userReaction: p.userReaction==='like' ? undefined : 'like' } : p);
    set({ posts: update(get().posts), feed: update(get().feed) });
  },

  addPost: (post: Post) => {
    db.createPost(post);
    set(s => ({ posts: [post, ...s.posts], feed: [post, ...s.feed] }));
  },

  updateSettings: (k, v) => {
    const ns = { ...get().settings, [k]: v };
    db.saveSettings(ns);
    set({ settings: ns });
  },

  setCurrentUser: (u) => set({ currentUser: u }),
  toggleSearch: () => set(s => ({ isSearchOpen: !s.isSearchOpen })),
  setIncomingCall: (u) => set({ incomingCall: u }),

  startPhantomEngine: () => {
    setInterval(() => {
      const state = get();
      // Random Incoming Call (Rare: 1/500 chance per tick)
      if (!state.incomingCall && Math.random() > 0.998) {
          const users = db.getAllUsers().filter(u => u.id !== state.currentUser?.id);
          if (users.length > 0) set({ incomingCall: users[Math.floor(Math.random() * users.length)] });
      }
      // New Posts Pill
      if (!state.hasNewPosts && Math.random() > 0.8) set({ hasNewPosts: true });
    }, 5000);
  }
}));