
import React, { useState } from 'react';
import { Server, Channel } from '../types';
import { Hash, Volume2, Settings, Mic, Headphones, Plus, ChevronDown, User, Gift, Bell, Smile, MicOff, Monitor } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import VoiceRoom from './VoiceRoom';

interface ServerViewProps {
  server: Server;
}

const ServerView: React.FC<ServerViewProps> = ({ server }) => {
  const { t } = useTranslation();
  const { currentUser } = useAppStore();
  const [activeChannelId, setActiveChannelId] = useState('c1');
  const [messageText, setMessageText] = useState('');
  const [activeVoiceRoom, setActiveVoiceRoom] = useState<Channel | null>(null);

  const channels: Channel[] = [
    { id: 'c1', name: 'general', type: 'text', unreadCount: 2 },
    { id: 'c2', name: 'announcements', type: 'text' },
    { id: 'c3', name: 'off-topic', type: 'text' },
    { id: 'c4', name: 'General Voice', type: 'voice', activeUsers: [{ id: 'u1', name: 'Alice', handle: 'alice', avatar: 'https://picsum.photos/seed/u1/40', roles: ['user'], hasCompletedOnboarding: true }] },
    { id: 'c5', name: 'Gaming', type: 'voice' },
  ];

  const onlineUsers = [
      { id: 'u2', name: 'Bob', status: 'online', avatar: 'https://picsum.photos/seed/u2/40' },
      { id: 'u3', name: 'Charlie', status: 'dnd', avatar: 'https://picsum.photos/seed/u3/40' },
      { id: 'u4', name: 'Dave', status: 'idle', avatar: 'https://picsum.photos/seed/u4/40' },
  ];

  return (
    <div className="flex h-full w-full bg-[#050b14] overflow-hidden">
        {/* Channel List */}
        <div className="w-64 bg-[#0f172a]/50 border-r border-white/5 flex flex-col pt-safe md:pt-0">
            <div className="h-12 flex items-center px-4 font-bold text-white border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors">
                {server.name} <ChevronDown size={16} className="ml-auto" />
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                 <div className="mb-4">
                     <div className="flex items-center justify-between px-2 text-xs font-bold text-gray-500 uppercase hover:text-gray-300 cursor-pointer mb-1 group">
                         <span>{t('server.channels_text')}</span>
                         <Plus size={12} className="opacity-0 group-hover:opacity-100" />
                     </div>
                     {channels.filter(c => c.type === 'text').map(c => (
                         <div 
                            key={c.id}
                            onClick={() => setActiveChannelId(c.id)}
                            className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer mb-0.5 group ${activeChannelId === c.id ? 'bg-indigo-500/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-gray-300'}`}
                         >
                             <Hash size={18} className="text-gray-500" />
                             <span className="font-medium">{c.name}</span>
                             {c.unreadCount && <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 rounded-full">{c.unreadCount}</span>}
                         </div>
                     ))}
                 </div>

                 <div className="mb-4">
                     <div className="flex items-center justify-between px-2 text-xs font-bold text-gray-500 uppercase hover:text-gray-300 cursor-pointer mb-1 group">
                         <span>{t('server.channels_voice')}</span>
                         <Plus size={12} className="opacity-0 group-hover:opacity-100" />
                     </div>
                     {channels.filter(c => c.type !== 'text').map(c => (
                         <div key={c.id}>
                             <div 
                                onClick={() => setActiveVoiceRoom(c)}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer mb-0.5 text-gray-400 hover:bg-white/5 hover:text-gray-300 group transition-colors"
                             >
                                <Volume2 size={18} className="text-gray-500" />
                                <span className="font-medium">{c.name}</span>
                             </div>
                             {c.activeUsers && (
                                 <div className="ml-8 space-y-1 mb-2">
                                     {c.activeUsers.map(u => (
                                         <div key={u.id} className="flex items-center gap-2">
                                             <img src={u.avatar} className="w-5 h-5 rounded-full border border-green-500/50" />
                                             <span className="text-xs text-white">{u.name}</span>
                                         </div>
                                     ))}
                                 </div>
                             )}
                         </div>
                     ))}
                 </div>
            </div>

            {/* User Controls */}
            <div className="bg-[#050b14]/80 p-3 flex items-center gap-2 border-t border-white/5 pb-safe">
                <div className="relative">
                    <img src={currentUser?.avatar || "https://picsum.photos/seed/me/40"} className="w-8 h-8 rounded-full bg-gray-700" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#050b14]"></div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white truncate">{currentUser?.name || 'NexusUser'}</div>
                    <div className="text-[10px] text-gray-500 truncate">#{currentUser?.id.slice(0,4) || '8492'}</div>
                </div>
                <div className="flex gap-1">
                    <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400"><Mic size={16}/></button>
                    <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400"><Headphones size={16}/></button>
                    <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400"><Settings size={16}/></button>
                </div>
            </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#050b14] relative">
            <div className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-[#050b14] pt-safe md:pt-0">
                <div className="flex items-center gap-2 text-white font-bold">
                    <Hash size={20} className="text-gray-500" />
                    general
                </div>
                <div className="flex gap-4 text-gray-400">
                    <Bell size={20} />
                    <User size={20} className="md:hidden" />
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                <div className="flex flex-col items-center justify-center py-10 text-gray-500 border-b border-white/5 mb-4">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Hash size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{t('server.welcome')} #general</h2>
                    <p>{t('server.start')}</p>
                </div>

                {[1,2,3].map(i => (
                    <div key={i} className="flex gap-4 group hover:bg-white/[0.02] p-2 -mx-2 rounded-lg transition-colors">
                        <img src={`https://picsum.photos/seed/msg${i}/40`} className="w-10 h-10 rounded-full bg-gray-700 mt-1" />
                        <div>
                            <div className="flex items-baseline gap-2">
                                <span className="font-bold text-white hover:underline cursor-pointer">User {i}</span>
                                <span className="text-xs text-gray-500">Today at {10+i}:00 AM</span>
                            </div>
                            <p className="text-gray-300 text-[15px] leading-relaxed">This is a test message to show how the chat layout works. It's clean and functional!</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-[#050b14] pb-safe">
                <div className="bg-white/5 rounded-xl px-4 py-2.5 flex items-center gap-3 border border-white/5 focus-within:border-indigo-500/50 transition-colors">
                    <button className="text-gray-400 hover:text-white"><Plus size={20}/></button>
                    <input 
                        type="text" 
                        placeholder={`${t('server.message_placeholder')} #general`}
                        className="bg-transparent flex-1 text-white focus:outline-none placeholder-gray-500 text-sm"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                    />
                    <div className="flex gap-2 text-gray-400">
                         <Gift size={20} className="hover:text-white cursor-pointer" />
                         <Smile size={20} className="hover:text-yellow-400 cursor-pointer" />
                    </div>
                </div>
            </div>
        </div>

        {/* Member List (Desktop) */}
        <div className="w-60 bg-[#0f172a]/30 border-l border-white/5 hidden lg:flex flex-col p-4 pt-safe md:pt-4">
             <h3 className="text-xs font-bold text-gray-500 uppercase mb-4">{t('server.online')} — {onlineUsers.length}</h3>
             <div className="space-y-2">
                 {onlineUsers.map(u => (
                     <div key={u.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer group opacity-90 hover:opacity-100">
                         <div className="relative">
                             <img src={u.avatar} className="w-8 h-8 rounded-full" />
                             <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#050b14] ${u.status === 'online' ? 'bg-green-500' : u.status === 'dnd' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                         </div>
                         <div>
                             <div className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">{u.name}</div>
                             <div className="text-xs text-gray-500">{t('server.playing')}</div>
                         </div>
                     </div>
                 ))}
             </div>
        </div>

        {/* Voice Room Overlay */}
        {activeVoiceRoom && currentUser && (
            <VoiceRoom 
                roomId={activeVoiceRoom.id} 
                roomName={activeVoiceRoom.name} 
                currentUser={currentUser} 
                onLeave={() => setActiveVoiceRoom(null)} 
            />
        )}
    </div>
  );
};

export default ServerView;
