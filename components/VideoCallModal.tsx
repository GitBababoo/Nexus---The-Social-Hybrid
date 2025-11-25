
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { soundEngine } from '../services/soundService';

interface VideoCallModalProps {
    user: User;
    onEndCall: () => void;
}

const VideoCallModal: React.FC<VideoCallModalProps> = ({ user, onEndCall }) => {
    const [status, setStatus] = useState<'calling' | 'connecting' | 'connected'>('calling');
    const [isMuted, setIsMuted] = useState(false);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        // Realistic connection sequence
        const t1 = setTimeout(() => setStatus('connecting'), 2000);
        const t2 = setTimeout(() => { setStatus('connected'); soundEngine.playSuccess(); }, 4000);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    useEffect(() => {
        if (status === 'connected') {
            const int = setInterval(() => setDuration(d => d + 1), 1000);
            return () => clearInterval(int);
        }
    }, [status]);

    const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col animate-in fade-in duration-300">
            <div className="relative flex-1 flex items-center justify-center overflow-hidden">
                {status === 'connected' ? (
                    <>
                        {/* Fake Friend Video */}
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-80 animate-pulse-slow"></div>
                        {/* Self View */}
                        <div className="absolute top-4 right-4 w-32 h-48 bg-black border border-white/20 rounded-xl overflow-hidden shadow-2xl">
                            <img src="https://picsum.photos/seed/me/200/300" className="w-full h-full object-cover" />
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center z-10">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500 shadow-[0_0_60px_rgba(99,102,241,0.4)] mb-6">
                            <img src={user.avatar} className="w-full h-full object-cover"/>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">{user.name}</h2>
                        <p className="text-indigo-400 animate-pulse">{status === 'calling' ? 'Dialing...' : 'Connecting...'}</p>
                    </div>
                )}
                
                {/* Timer Overlay */}
                {status === 'connected' && (
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/40 px-4 py-1 rounded-full backdrop-blur text-white font-mono">
                        {formatTime(duration)}
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="h-24 bg-[#0f172a] flex items-center justify-center gap-8 pb-safe">
                <button onClick={() => setIsMuted(!isMuted)} className={`p-4 rounded-full ${isMuted ? 'bg-white text-black' : 'bg-white/10 text-white'}`}>
                    {isMuted ? <MicOff /> : <Mic />}
                </button>
                <button onClick={onEndCall} className="p-5 bg-red-600 text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                    <PhoneOff size={32} />
                </button>
                <button className="p-4 bg-white/10 text-white rounded-full"><Video /></button>
            </div>
        </div>
    );
};

export default VideoCallModal;
