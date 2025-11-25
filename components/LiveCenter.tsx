
import React, { useState } from 'react';
import { LiveStream } from '../types';
import { Radio, Users, MessageSquare, Gift, Heart, Share2, Play, Video, Mic, Settings, X, UploadCloud } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MOCK_STREAMS: LiveStream[] = [
    { id: '1', title: 'Coding the Future 💻', streamer: { id: 'u1', name: 'DevKing', handle: 'dev', avatar: 'https://picsum.photos/seed/u1/50', roles: ['creator'], hasCompletedOnboarding: true }, viewers: '1.2K', category: 'Tech', isLive: true, thumbnail: 'https://picsum.photos/seed/live1/800/450' },
    { id: '2', title: 'Late Night Gaming 🎮', streamer: { id: 'u2', name: 'ProGamer', handle: 'game', avatar: 'https://picsum.photos/seed/u2/50', roles: ['creator'], hasCompletedOnboarding: true }, viewers: '4.5K', category: 'Gaming', isLive: true, thumbnail: 'https://picsum.photos/seed/live2/800/450' },
    { id: '3', title: 'Chill LoFi Beats 🎵', streamer: { id: 'u3', name: 'LoFi Girl', handle: 'music', avatar: 'https://picsum.photos/seed/u3/50', roles: ['creator'], hasCompletedOnboarding: true }, viewers: '10K', category: 'Music', isLive: true, thumbnail: 'https://picsum.photos/seed/live3/800/450' },
];

const LiveCenter: React.FC = () => {
    const { t } = useTranslation();
    const [showGoLive, setShowGoLive] = useState(false);

    return (
        <div className="animate-enter pb-24 relative">
             <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500 rounded-lg animate-pulse">
                        <Radio size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white font-display">{t('live.title')}</h2>
                        <p className="text-gray-400 text-xs">{t('live.subtitle')}</p>
                    </div>
                 </div>
                 <button 
                    onClick={() => setShowGoLive(true)}
                    className="bg-white text-black px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform shadow-lg"
                 >
                    <Video size={16} /> Go Live
                 </button>
             </div>

             {/* Featured Stream */}
             <div className="relative aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl mb-8 group">
                 <img src={MOCK_STREAMS[0].thumbnail} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40">
                     <div className="absolute top-4 left-4 flex gap-2">
                         <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">LIVE</span>
                         <span className="bg-black/50 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-md flex items-center gap-1"><Users size={12}/> {MOCK_STREAMS[0].viewers}</span>
                     </div>
                     <div className="absolute bottom-0 left-0 right-0 p-6">
                         <h3 className="text-2xl font-bold text-white mb-2">{MOCK_STREAMS[0].title}</h3>
                         <div className="flex items-center gap-3">
                             <img src={MOCK_STREAMS[0].streamer.avatar} className="w-8 h-8 rounded-full border border-white/20" />
                             <span className="text-white font-medium">{MOCK_STREAMS[0].streamer.name}</span>
                             <button className="ml-auto bg-white text-black px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 hover:scale-105 transition-transform">
                                 <Play size={12} fill="black" /> Watch
                             </button>
                         </div>
                     </div>
                 </div>
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                         <Play size={32} className="text-white fill-white ml-1" />
                     </div>
                 </div>
             </div>

             <h3 className="text-lg font-bold text-white mb-4">{t('live.recommended')}</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {MOCK_STREAMS.slice(1).map(stream => (
                     <div key={stream.id} className="glass-panel rounded-2xl overflow-hidden group cursor-pointer">
                         <div className="relative aspect-video">
                             <img src={stream.thumbnail} className="w-full h-full object-cover" />
                             <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">LIVE</div>
                             <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1"><Users size={10}/> {stream.viewers}</div>
                         </div>
                         <div className="p-3 flex gap-3">
                             <img src={stream.streamer.avatar} className="w-10 h-10 rounded-full bg-gray-800" />
                             <div className="flex-1 min-w-0">
                                 <h4 className="text-white font-bold text-sm truncate">{stream.title}</h4>
                                 <p className="text-gray-400 text-xs">{stream.streamer.name}</p>
                                 <p className="text-indigo-400 text-xs mt-1">{stream.category}</p>
                             </div>
                         </div>
                     </div>
                 ))}
             </div>

             {/* Go Live Modal */}
             {showGoLive && (
                 <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
                     <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-6 w-full max-w-md relative shadow-2xl">
                         <button onClick={() => setShowGoLive(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24}/></button>
                         <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Radio size={24} className="text-red-500"/> Go Live</h3>
                         
                         <div className="aspect-video bg-black rounded-xl mb-6 flex items-center justify-center border border-white/10 relative overflow-hidden group">
                             <div className="text-gray-500 flex flex-col items-center gap-2">
                                 <Video size={32} />
                                 <span className="text-xs">Camera Preview</span>
                             </div>
                             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
                                 <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"><Mic size={20}/></button>
                                 <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"><Video size={20}/></button>
                                 <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"><Settings size={20}/></button>
                             </div>
                         </div>

                         <div className="space-y-4">
                             <div>
                                 <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Stream Title</label>
                                 <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none" placeholder="What are you streaming?" />
                             </div>
                             <button className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/20">
                                 Start Broadcasting
                             </button>
                         </div>
                     </div>
                 </div>
             )}
        </div>
    );
};

export default LiveCenter;
