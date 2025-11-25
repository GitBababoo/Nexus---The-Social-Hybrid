
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Hand, X, MoreHorizontal, Volume2, Settings, Users } from 'lucide-react';
import { User, RoomParticipant } from '../types';
import { useTranslation } from 'react-i18next';
import { soundEngine } from '../services/soundService';

interface VoiceRoomProps {
    roomId: string;
    roomName: string;
    currentUser: User;
    onLeave: () => void;
}

// Mock Data Generator
const generateParticipants = (user: User): RoomParticipant[] => [
    { id: user.id, name: user.name, avatar: user.avatar, role: 'speaker', isMuted: true, isSpeaking: false },
    { id: 'u2', name: 'Alice', avatar: 'https://picsum.photos/seed/u2/100', role: 'host', isMuted: false, isSpeaking: true },
    { id: 'u3', name: 'Bob', avatar: 'https://picsum.photos/seed/u3/100', role: 'speaker', isMuted: false, isSpeaking: false },
    { id: 'u4', name: 'Charlie', avatar: 'https://picsum.photos/seed/u4/100', role: 'listener', isMuted: true, isSpeaking: false, raisedHand: true },
    { id: 'u5', name: 'Dave', avatar: 'https://picsum.photos/seed/u5/100', role: 'listener', isMuted: true, isSpeaking: false },
    { id: 'u6', name: 'Eve', avatar: 'https://picsum.photos/seed/u6/100', role: 'listener', isMuted: true, isSpeaking: false },
];

const VoiceRoom: React.FC<VoiceRoomProps> = ({ roomId, roomName, currentUser, onLeave }) => {
    const { t } = useTranslation();
    const [participants, setParticipants] = useState<RoomParticipant[]>([]);
    const [isMuted, setIsMuted] = useState(true);
    const [handRaised, setHandRaised] = useState(false);

    useEffect(() => {
        setParticipants(generateParticipants(currentUser));
        
        // Simulation: Random speaking
        const interval = setInterval(() => {
            setParticipants(prev => prev.map(p => {
                if (p.role !== 'listener' && !p.isMuted) {
                    return { ...p, isSpeaking: Math.random() > 0.6 };
                }
                return p;
            }));
        }, 500);

        return () => clearInterval(interval);
    }, [currentUser]);

    const toggleMute = () => {
        setIsMuted(!isMuted);
        setParticipants(prev => prev.map(p => p.id === currentUser.id ? { ...p, isMuted: !isMuted } : p));
        soundEngine.playClick();
    };

    const toggleHand = () => {
        setHandRaised(!handRaised);
        setParticipants(prev => prev.map(p => p.id === currentUser.id ? { ...p, raisedHand: !handRaised } : p));
        soundEngine.playNotification();
    };

    const speakers = participants.filter(p => p.role !== 'listener');
    const listeners = participants.filter(p => p.role === 'listener');

    return (
        <div className="fixed inset-0 z-[100] bg-[#050b14] flex flex-col animate-in slide-in-from-bottom duration-500">
            {/* Header */}
            <div className="h-16 px-6 flex items-center justify-between border-b border-white/5 bg-[#0f172a]">
                <button onClick={onLeave} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                    <X size={24} className="rotate-90 md:rotate-0" />
                </button>
                <div className="flex flex-col items-center">
                    <h2 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> {t('voice.room')}
                    </h2>
                    <span className="text-xs text-gray-500">{roomName}</span>
                </div>
                <button className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                    <MoreHorizontal size={24} />
                </button>
            </div>

            {/* Stage Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                
                {/* Speakers Grid */}
                <div className="mb-8">
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center gap-2">
                        <Users size={14}/> {t('voice.speakers')}
                    </h3>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-6 justify-items-center">
                        {speakers.map(p => (
                            <div key={p.id} className="flex flex-col items-center group relative">
                                <div className={`relative w-20 h-20 rounded-[24px] transition-all duration-300 ${p.isSpeaking ? 'shadow-[0_0_0_4px_rgba(99,102,241,0.5)] scale-105' : ''}`}>
                                    <img src={p.avatar} className="w-full h-full rounded-[24px] object-cover bg-gray-800" />
                                    {p.isMuted && (
                                        <div className="absolute -bottom-2 -right-2 bg-[#0f172a] p-1 rounded-full border border-white/10">
                                            <MicOff size={14} className="text-rose-500" />
                                        </div>
                                    )}
                                    {p.role === 'host' && (
                                        <div className="absolute -top-2 -left-2 bg-yellow-500 text-black text-[10px] font-bold px-1.5 rounded">HOST</div>
                                    )}
                                </div>
                                <span className="mt-2 text-sm font-bold text-white truncate max-w-[100px]">{p.name}</span>
                                {p.isSpeaking && <div className="absolute -bottom-6 w-full h-1 bg-indigo-500 rounded-full animate-pulse"></div>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Listeners Grid */}
                <div className="bg-[#0f172a]/50 rounded-3xl p-6 border border-white/5">
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center gap-2">
                        <Users size={14}/> {t('voice.listeners')} ({listeners.length})
                    </h3>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-4 justify-items-center">
                        {listeners.map(p => (
                            <div key={p.id} className="flex flex-col items-center">
                                <div className="relative w-14 h-14">
                                    <img src={p.avatar} className="w-full h-full rounded-2xl object-cover bg-gray-800 opacity-80" />
                                    {p.raisedHand && (
                                        <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center animate-bounce">
                                            <Hand size={24} className="text-yellow-400 fill-yellow-400" />
                                        </div>
                                    )}
                                </div>
                                <span className="mt-1 text-xs text-gray-400 truncate max-w-[60px]">{p.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="h-24 bg-[#0f172a] border-t border-white/5 px-6 flex items-center justify-between pb-safe">
                <button onClick={onLeave} className="text-rose-500 font-bold text-xs hover:text-rose-400 transition-colors uppercase tracking-wider">
                    {t('voice.leave')}
                </button>

                <div className="flex items-center gap-4">
                    <button 
                        onClick={toggleMute}
                        className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all shadow-lg ${isMuted ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white text-black hover:scale-105'}`}
                    >
                        {isMuted ? <MicOff size={24} /> : <Mic size={24} className="fill-black"/>}
                    </button>
                    <button 
                        onClick={toggleHand}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${handRaised ? 'bg-yellow-500 text-black' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                    >
                        <Hand size={20} className={handRaised ? 'fill-black' : ''} />
                    </button>
                </div>

                <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                    <Settings size={20} />
                </button>
            </div>
        </div>
    );
};

export default VoiceRoom;
