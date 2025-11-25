
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, MessageCircle, Share2, Music, ArrowLeft, Play, Volume2, VolumeX } from 'lucide-react';
import { db } from '../services/db';
import { ShortVideo } from '../types';
import { soundEngine } from '../services/soundService';

interface ShortsViewerProps {
    onClose: () => void;
}

const ShortsViewer: React.FC<ShortsViewerProps> = ({ onClose }) => {
    const [shorts, setShorts] = useState<ShortVideo[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const data = db.getShorts();
        setShorts(data);
        if(data.length > 0) setActiveId(data[0].id);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('data-id');
                        if(id) setActiveId(id);
                    }
                });
            },
            { threshold: 0.6, root: containerRef.current }
        );
        const elements = document.querySelectorAll('.short-container');
        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [shorts]);

    const toggleLike = useCallback((id: string) => {
        const updated = db.likeShort(id);
        setShorts(updated);
        const vid = updated.find(s => s.id === id);
        if (vid?.isLiked) soundEngine.playSuccess();
    }, []);

    return (
        <div className="fixed inset-0 z-[60] bg-black flex justify-center items-center animate-in zoom-in-95 duration-300">
            <div className="absolute top-safe left-safe z-[70] m-4 flex gap-4">
                <button onClick={onClose} className="text-white p-3 bg-black/20 hover:bg-white/10 rounded-full backdrop-blur-lg transition-all hover:scale-110 border border-white/10">
                    <ArrowLeft size={24} />
                </button>
                <button onClick={() => setIsMuted(!isMuted)} className="text-white p-3 bg-black/20 hover:bg-white/10 rounded-full backdrop-blur-lg transition-all hover:scale-110 border border-white/10">
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
            </div>

            <div 
                ref={containerRef}
                className="w-full h-full md:w-[450px] md:h-[90vh] md:rounded-[32px] overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-[#000] relative shadow-[0_0_100px_rgba(99,102,241,0.2)] border border-white/10"
            >
                {shorts.map((video) => {
                    const isActive = activeId === video.id;
                    return (
                        <div 
                            key={video.id} 
                            data-id={video.id}
                            className={`short-container w-full h-full snap-start snap-always relative flex items-center justify-center ${video.color} overflow-hidden bg-black`}
                        >
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay animate-pulse-slow"></div>
                            {isActive ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center opacity-50 animate-pulse">
                                        <h2 className="text-6xl font-black text-white/10 uppercase -rotate-90 tracking-widest scale-150">PLAYING</h2>
                                    </div>
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all"><Play size={48} className="text-white/50" /></div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90 pointer-events-none"></div>

                            <div className="absolute right-4 bottom-24 flex flex-col gap-6 items-center z-20">
                                <div className="relative group cursor-pointer">
                                    <img src={`https://picsum.photos/seed/${video.user}/100`} className="w-12 h-12 rounded-full border-2 border-white shadow-lg" />
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-rose-500 rounded-full p-0.5 shadow-md hover:scale-110 transition-transform">
                                        <div className="w-3 h-3 flex items-center justify-center text-[8px] font-bold text-white">+</div>
                                    </div>
                                </div>
                                <button onClick={() => toggleLike(video.id)} className="flex flex-col items-center gap-1 group">
                                    <div className={`p-2 rounded-full transition-all ${video.isLiked ? 'text-rose-500' : 'text-white bg-white/10 group-hover:bg-white/20'}`}>
                                        <Heart size={28} className={video.isLiked ? 'fill-current scale-110' : ''} />
                                    </div>
                                    <span className="text-xs font-bold text-white drop-shadow-md">{video.likes}</span>
                                </button>
                                <button className="flex flex-col items-center gap-1 group">
                                    <div className="p-2 rounded-full text-white bg-white/10 group-hover:bg-white/20 transition-all"><MessageCircle size={28} /></div>
                                    <span className="text-xs font-bold text-white drop-shadow-md">{video.comments}</span>
                                </button>
                                <button className="flex flex-col items-center gap-1 group">
                                    <div className="p-2 rounded-full text-white bg-white/10 group-hover:bg-white/20 transition-all"><Share2 size={28} /></div>
                                    <span className="text-xs font-bold text-white drop-shadow-md">Share</span>
                                </button>
                                <div className={`mt-4 w-10 h-10 rounded-full bg-[#1a1a1a] border-[3px] border-gray-800 flex items-center justify-center shadow-xl overflow-hidden ${isActive ? 'animate-spin-slow' : ''}`}>
                                    <img src={`https://picsum.photos/seed/${video.user}/50`} className="w-full h-full object-cover opacity-80" />
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-16 p-4 pb-8 z-20">
                                <h3 className="text-white font-bold text-lg mb-2 drop-shadow-md flex items-center gap-2">@{video.user} <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded text-white backdrop-blur-sm border border-white/10">Follow</span></h3>
                                <p className="text-white/90 text-sm leading-snug mb-4 drop-shadow-md line-clamp-2 font-medium">{video.desc} <span className="text-indigo-400">#viral #nexus</span></p>
                                <div className="flex items-center gap-2 text-white text-xs bg-white/10 px-4 py-2 rounded-full w-fit backdrop-blur-md border border-white/5 animate-pulse-slow">
                                    <Music size={14} />
                                    <div className="overflow-hidden w-32"><span className="truncate block">{video.music}</span></div>
                                </div>
                            </div>
                            
                            {/* Progress Bar Sim */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                                <div className={`h-full bg-white ${isActive ? 'w-full transition-all duration-[10000ms] ease-linear' : 'w-0'}`}></div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <style>{`
                .animate-spin-slow { animation: spin 6s linear infinite; }
                .top-safe { top: env(safe-area-inset-top, 20px); }
                .left-safe { left: env(safe-area-inset-left, 20px); }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default ShortsViewer;
