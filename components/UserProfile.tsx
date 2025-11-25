
import React, { useState } from 'react';
import { User, Post, Role } from '../types';
import { X, MapPin, Check, UserPlus, Mail, Grid, Image as ImageIcon, Heart, Edit2, QrCode, ShieldCheck, Star, Crown, Globe, Briefcase, Cpu, Loader2 } from 'lucide-react';
import PostCard from './PostCard';
import { useTranslation } from 'react-i18next';

interface UserProfileProps {
  user: User;
  onClose?: () => void; 
  isOwnProfile?: boolean;
  onOpenID?: () => void;
  onEditProfile?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onClose, isOwnProfile, onOpenID, onEditProfile }) => {
  const { t } = useTranslation();
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'likes'>('posts');
  
  // Mock posts
  const mockPosts: Post[] = user.stats?.posts === 0 ? [] : Array.from({ length: 3 }).map((_, i) => ({
    id: `p-${i}`,
    user: user,
    content: isOwnProfile ? "Reflecting on the new update. ```console.log('Hello Nexus');``` #Nexus" : "Just another day in the digital void.",
    likes: 42 + i,
    commentsCount: 5,
    shares: 2,
    timestamp: '2d ago',
    tags: ['vibes'],
    platformOrigin: 'instagram',
    image: i === 0 ? `https://picsum.photos/seed/${user.id}-post/600/400` : undefined
  }));

  const highlights = [
      { id: '1', title: 'Travel', img: `https://picsum.photos/seed/${user.id}-h1/100` },
      { id: '2', title: 'Tech', img: `https://picsum.photos/seed/${user.id}-h2/100` },
      { id: '3', title: 'Events', img: `https://picsum.photos/seed/${user.id}-h3/100` },
      { id: '4', title: 'Art', img: `https://picsum.photos/seed/${user.id}-h4/100` },
  ];

  const getRoleBadge = (role: Role) => {
      switch(role) {
          case 'admin': return <span className="bg-red-500/20 text-red-400 border border-red-500/50 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1"><ShieldCheck size={10}/> ADMIN</span>;
          case 'moderator': return <span className="bg-green-500/20 text-green-400 border border-green-500/50 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1"><ShieldCheck size={10}/> MOD</span>;
          case 'creator': return <span className="bg-purple-500/20 text-purple-400 border border-purple-500/50 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1"><Star size={10}/> CREATOR</span>;
          case 'vip': return <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1"><Crown size={10}/> VIP</span>;
          default: return null;
      }
  }

  const wrapperClass = onClose 
    ? "fixed inset-0 z-[100] flex items-center justify-center p-4" 
    : "animate-enter pb-20";
  
  const innerClass = onClose
    ? "relative w-full max-w-2xl glass-panel rounded-[32px] overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.15)] max-h-[90vh] overflow-y-auto custom-scrollbar border border-white/10"
    : "w-full";

  const content = (
    <div className={innerClass} onClick={(e) => e.stopPropagation()}>
       <div className="h-56 relative overflow-hidden group bg-[#0f172a]">
           {user.cover ? (
               <img src={user.cover} className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" alt="cover" />
           ) : (
               <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900 opacity-50"></div>
           )}
           {onClose && <button onClick={onClose} className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2.5 rounded-full backdrop-blur-xl transition-all hover:rotate-90 border border-white/10 z-20"><X size={20} /></button>}
        </div>

        <div className="px-8 pb-8 relative -mt-24">
            <div className="flex justify-between items-end mb-6">
                <div className="relative p-1.5 bg-[#0f172a] rounded-[28px] shadow-2xl group/avatar">
                     <div className="w-36 h-36 rounded-[24px] overflow-hidden relative bg-black">
                       <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                     </div>
                     {user.isVerified && <div className="absolute -bottom-2 -right-2 bg-indigo-500 text-white p-1.5 rounded-full border-4 border-[#0f172a]"><Check size={16} strokeWidth={4} /></div>}
                </div>
                <div className="flex gap-3 mb-4">
                    {onOpenID && <button onClick={onOpenID} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all hover:scale-105" title={t('profile.nexusId')}><QrCode size={20} /></button>}
                    {isOwnProfile ? (
                        <button onClick={onEditProfile} className="px-6 py-2.5 rounded-xl font-bold transition-all duration-300 border flex items-center gap-2 bg-white/5 border-white/10 hover:bg-white/10 text-white hover:border-white/30">
                           <Edit2 size={18}/> {t('profile.edit')}
                        </button>
                    ) : (
                      <>
                        <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all" title={t('profile.message')}><Mail size={20} /></button>
                        <button onClick={() => setIsFollowing(!isFollowing)} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${isFollowing ? 'bg-transparent border border-green-500/50 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.1)]' : 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]'}`}>{isFollowing ? <Check size={18} /> : <UserPlus size={18} />}{isFollowing ? t('profile.connected') : t('profile.connect')}</button>
                      </>
                    )}
                </div>
            </div>

            <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">{user.name}</h2>
                </div>
                
                <div className="flex flex-wrap gap-2 items-center">
                    <p className="text-indigo-400 font-medium text-sm">@{user.handle}</p>
                    {user.roles && user.roles.map(role => <div key={role}>{getRoleBadge(role)}</div>)}
                </div>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed text-[15px] border-l-2 border-indigo-500/50 pl-4 font-light max-w-lg">{user.bio || t('profile.bio')}</p>

            <div className="flex flex-wrap gap-x-6 gap-y-3 text-gray-400 text-sm mb-8 font-medium">
                {user.location && <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"><MapPin size={14} className="text-indigo-400" /> {user.location}</div>}
                {user.website && <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"><Globe size={14} className="text-indigo-400" /> {user.website}</div>}
                {user.occupation && <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"><Briefcase size={14} className="text-indigo-400" /> {user.occupation}</div>}
            </div>
            
            {user.stats?.posts !== 0 && (
                <div className="flex gap-4 overflow-x-auto no-scrollbar mb-8 pb-2">
                    {highlights.map(hl => (
                        <div key={hl.id} className="flex flex-col items-center gap-2 cursor-pointer group">
                            <div className="w-16 h-16 rounded-full p-[2px] bg-white/10 group-hover:bg-white/30 transition-colors"><div className="w-full h-full rounded-full border-2 border-[#050b14] overflow-hidden"><img src={hl.img} className="w-full h-full object-cover" /></div></div>
                            <span className="text-xs font-medium text-gray-400">{hl.title}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6 mb-8">
                <div className="flex flex-col items-center p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group"><span className="font-bold text-2xl text-white group-hover:text-indigo-400 transition-colors">{user.stats?.following || "0"}</span><span className="text-[11px] text-gray-500 uppercase tracking-widest font-bold mt-1">{t('profile.following')}</span></div>
                <div className="flex flex-col items-center p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group"><span className="font-bold text-2xl text-white group-hover:text-indigo-400 transition-colors">{user.stats?.followers || "0"}</span><span className="text-[11px] text-gray-500 uppercase tracking-widest font-bold mt-1">{t('profile.followers')}</span></div>
                <div className="flex flex-col items-center p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group"><span className="font-bold text-2xl text-white group-hover:text-indigo-400 transition-colors">{user.stats?.posts || "0"}</span><span className="text-[11px] text-gray-500 uppercase tracking-widest font-bold mt-1">{t('profile.posts')}</span></div>
            </div>

            <div className="flex border-b border-white/10 mb-6">
                {[{ id: 'posts', icon: Grid, label: t('profile.tabs.posts') }, { id: 'media', icon: ImageIcon, label: t('profile.tabs.media') }, { id: 'likes', icon: Heart, label: t('profile.tabs.likes') }].map(tab => (
                   <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-bold relative transition-colors ${activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}><tab.icon size={16} /><span className="hidden sm:inline">{tab.label}</span>{activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_-2px_10px_rgba(99,102,241,0.5)]"></div>}</button>
                ))}
            </div>

            <div className="min-h-[300px]">
               {activeTab === 'posts' && (
                   mockPosts.length > 0 ? (
                        <div className="space-y-6">{mockPosts.map(post => <PostCard key={post.id} post={post} />)}</div>
                   ) : (
                       <div className="text-center py-10 text-gray-500">No posts yet. Start sharing your world.</div>
                   )
               )}
               {activeTab === 'media' && (
                   <div className="text-center py-10 text-gray-500">No media found.</div>
               )}
            </div>
        </div>
    </div>
  );

  if (onClose) return <div className={wrapperClass}><div className="absolute inset-0 bg-[#050b14]/90 backdrop-blur-lg animate-in fade-in duration-500" onClick={onClose}></div>{content}</div>;
  return <div className={wrapperClass}>{content}</div>;
};

export default UserProfile;
