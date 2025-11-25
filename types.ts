



export type Role = 'admin' | 'moderator' | 'creator' | 'user' | 'vip' | 'developer';

export interface User {
  id: string;
  name: string;
  handle: string;
  email?: string;
  phoneNumber?: string;
  avatar: string;
  cover?: string;
  bio?: string;
  location?: string;
  website?: string; 
  occupation?: string; 
  joinedDate?: string;
  isVerified?: boolean;
  roles: Role[]; 
  hasCompletedOnboarding: boolean; 
  status?: 'online' | 'idle' | 'dnd' | 'offline';
  stats?: {
    followers: string;
    following: string;
    posts: number;
    level: number;
    xp: number;
    maxXp: number;
  };
  securityQuestion?: string;
  securityAnswerHash?: string;
  backupCodeHash?: string;
  deviceId?: string;
  isBanned?: boolean; 
}

export interface AuthResponse {
  user: User;
  token: string;
  backupCode?: string;
}

export interface Comment {
  id: string;
  user: User;
  content: string;
  timestamp: string;
}

export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  endsAt: string;
  totalVotes: number;
  userVotedOptionId?: string | null;
}

export interface MediaAttachment {
  type: 'image' | 'video';
  url: string;
  aspectRatio?: number;
  filters?: string; // Added for editor
}

export interface Post {
  id: string;
  user: User;
  content: string;
  media?: MediaAttachment[]; 
  image?: string; 
  images?: string[]; 
  video?: string; 
  audio?: string; 
  likes: number;
  commentsCount: number;
  shares: number;
  timestamp: string;
  tags: string[];
  platformOrigin?: 'twitter' | 'instagram' | 'facebook' | 'discord' | 'tiktok';
  status?: {
    isPinned?: boolean;
    isSponsored?: boolean;
    isTranslated?: boolean;
    isMinted?: boolean; 
  };
  userReaction?: ReactionType;
  poll?: Poll; 
  linkPreview?: any;
  scheduledAt?: string;
}

export interface StoryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  duration: number; 
  timestamp: string;
}

export interface Story {
  id: string;
  user: User;
  hasUnseen: boolean;
  items: StoryItem[];
}

export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'stage';
  unreadCount?: number;
  activeUsers?: User[]; 
}

export interface Server {
  id: string;
  name: string;
  icon: string;
  hasNotification?: boolean;
  channels?: Channel[];
  banner?: string;
}

// ... (Keeping other interfaces standard)

export interface TrendingTopic {
  id: string;
  category: string;
  topic: string;
  postsCount: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  type?: 'text' | 'image';
  mediaUrl?: string;
  read?: boolean;
}

export interface ChatContact {
  id: string;
  user: User;
  lastMessage: string;
  unread: number;
  userStatus?: 'online' | 'offline' | 'dnd';
}

export interface Product {
  id: string;
  name: string;
  price: number;
  displayPrice: string;
  category: string;
  image: string;
  seller: User;
  isHot?: boolean;
}

export interface AuctionItem {
    id: string;
    name: string;
    image: string;
    currentBid: number;
    minBidIncrement: number;
    endTime: number; // Timestamp
    bidders: number;
    highestBidder?: string; // User Handle
}

export interface LiveStream {
  id: string;
  streamer: User;
  title: string;
  thumbnail: string;
  viewers: string;
  category: string;
  isLive: boolean;
}

export interface Transaction {
  id: string;
  type: 'incoming' | 'outgoing';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending';
}

export interface Wallet {
  balance: number;
  staked: number;
  currency: string;
  address: string;
  transactions: Transaction[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  attendees: number;
  category: 'Tech' | 'Music' | 'Social' | 'Gaming' | 'Education';
  isInterested?: boolean;
  host: User;
}

export type SupportedLanguage = 'en' | 'th' | 'jp' | 'cn' | 'es' | 'fr';

export interface AppSettings {
  uiScale: number;
  themeColor: 'indigo' | 'cyan' | 'pink' | 'emerald' | 'amber';
  darkMode: boolean; 
  zenMode: boolean;
  grayscaleMode: boolean;
  backgroundStyle: 'mesh' | 'plain' | 'stars';
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  privateAccount: boolean;
  activityStatus: boolean;
  readReceipts: boolean;
  allowTagging: 'everyone' | 'friends' | 'none';
  allowMessages: 'everyone' | 'friends' | 'none';
  blurSensitiveContent: boolean;
  blockedUsers: string[];
  mutedWords: string[];
  pushNotifications: boolean;
  pushTypes: {
    likes: boolean;
    comments: boolean;
    mentions: boolean; // Added
    follows: boolean;
    messages: boolean;
    events: boolean;
    system: boolean; // Added
  };
  emailNotifications: boolean;
  marketingEmails: boolean;
  autoPlayVideo: boolean;
  dataSaver: boolean;
  highQualityUploads: boolean;
  soundEnabled: boolean;
  volumeMaster: number;
  volumeEffects: number;
  volumeAmbient: number;
  language: SupportedLanguage;
  streamerMode: boolean;
  twoFactorEnabled: boolean;
  activeSessions: number;
  forYouPersonalization: boolean;
  contentLanguage: string[];
  currency?: string;
}

export interface Quest {
    id: string;
    title: string;
    description: string;
    current: number;
    target: number;
    rewardXp: number;
    rewardCoin: number;
    isClaimed: boolean;
}

export interface Proposal {
    id: string;
    title: string;
    description: string;
    votesFor: number;
    votesAgainst: number;
    status: 'Active' | 'Passed' | 'Rejected';
    endTime: string;
    userVoted?: 'for' | 'against';
}

export interface Bounty {
    id: string;
    title: string;
    description: string;
    reward: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: 'Dev' | 'Design' | 'Content';
    status: 'Open' | 'In Progress' | 'Completed';
    employer: string;
}

export interface Course {
    id: string;
    title: string;
    instructor: string;
    progress: number;
    totalLessons: number;
    image: string;
    category: string;
    isEnrolled: boolean;
}

export interface DriveFile {
    id: string;
    name: string;
    type: 'folder' | 'image' | 'doc' | 'audio';
    size: string;
    modified: string;
}

export interface Club {
    id: string;
    name: string;
    members: string;
    description: string;
    image: string;
    isJoined: boolean;
}

export interface Notification {
    id: string;
    type: 'like' | 'follow' | 'mention' | 'star' | 'system' | 'reply' | 'event';
    user: string;
    text: string;
    time: string;
    read: boolean;
    category: 'all' | 'mentions' | 'system';
}

export interface ShortVideo {
    id: string;
    user: string;
    desc: string;
    likes: number;
    comments: number;
    music: string;
    color: string;
    isLiked: boolean;
}

// Admin Specific Types
export interface Report {
    id: string;
    targetId: string;
    targetType: 'post' | 'user' | 'comment';
    reporterId: string;
    reason: string;
    timestamp: string;
    status: 'pending' | 'resolved' | 'dismissed';
}

export interface SystemLog {
    id: number;
    action: string;
    details: string;
    timestamp: string;
    severity?: 'info' | 'warning' | 'error' | 'critical';
}

export interface RoomParticipant {
    id: string;
    name: string;
    avatar: string;
    role: 'speaker' | 'listener' | 'host';
    isMuted: boolean;
    isSpeaking: boolean;
    raisedHand?: boolean;
}

export interface VoiceRoomState {
    id: string;
    name: string;
    participants: RoomParticipant[];
}

export interface SyntheticPet {
    id: string;
    name: string;
    level: number;
    hunger: number;
    happiness: number;
}

export type TabType = 
    | '