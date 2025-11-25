
import React, { useState } from 'react';
import { Heart, X, MessageCircle, Star, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { soundEngine } from '../services/soundService';

const PROFILES = [
    { id: 1, name: 'Sarah', age: 24, bio: 'Digital Artist & Cyber Cafe owner. Looking for Player 2.', img: 'https://picsum.photos/seed/match1/400/600', match: 98 },
    { id: 2, name: 'Kenji', age: 28, bio: 'Fullstack Dev. I dream in React hooks.', img: 'https://picsum.photos/seed/match2/400/600', match: 85 },
    { id: 3, name: 'Elara', age: 22, bio: 'Space enthusiast. Let\'s go to Mars.', img: 'https://picsum.photos/seed/match3/400/600', match: 92 },
];

const MatchView: React.FC = () => {
    const { t } = useTranslation();
    const [currentProfile, setCurrentProfile] = useState(0);
    const [lastDirection, setLastDirection] = useState<string | null>(null);

    const swipe = (direction: string) => {
        setLastDirection(direction);
        soundEngine.playClick();
        setTimeout(() => {
            setCurrentProfile(prev => prev + 1);
            setLastDirection(null);
        }, 300);
    };

    if (currentProfile >= PROFILES.length) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-enter">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <Heart size={40} className="text-rose-500 animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-white">No more profiles</h2>
                <p className="text-gray-400 mt-2">Check back later for new neural matches.</p>
                <button onClick={() => setCurrentProfile(0)} className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-bold">Reset Demo</button>
            </div>
        );
    }

    const profile = PROFILES[currentProfile];

    return (
        <div className="animate-enter pb-24 flex flex-col items-center">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-white font-display flex items-center justify-center gap-2">
                    <Heart size={24} className="text-rose-500 fill-rose-500" /> {t('match.title')}
                </h2>
                <p className="text-gray-400 text-xs">{t('match.subtitle')}</p>
            </div>

            <div className="relative w-full max-w-sm h-[500px]">
                <div className={`absolute inset-0 bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 transition-transform duration-300 ${lastDirection === 'left' ? '-translate-x-full rotate-[-20deg] opacity-0' : lastDirection === 'right' ? 'translate-x-full rotate-[20deg] opacity-0' : ''}`}>
                    <img src={profile.img} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-6">
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <h3 className="text-3xl font-bold text-white">{profile.name}, {profile.age}</h3>
                                <p className="text-white/80 text-sm line-clamp-2">{profile.bio}</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full border-4 border-green-500 flex items-center justify-center bg-black font-bold text-green-500 text-sm">
                                    {profile.match}%
                                </div>
                                <span className="text-[10px] text-green-500 font-bold uppercase mt-1">Match</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-6 mt-8">
                <button onClick={() => swipe('left')} className="w-16 h-16 bg-[#1e293b] rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg border border-white/5">
                    <X size={32} />
                </button>
                <button className="w-12 h-12 bg-[#1e293b] rounded-full flex items-center justify-center text-blue-400 hover:bg-blue-500 hover:text-white transition-all shadow-lg border border-white/5 mt-2">
                    <Star size={20} />
                </button>
                <button onClick={() => swipe('right')} className="w-16 h-16 bg-[#1e293b] rounded-full flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-lg border border-white/5">
                    <Heart size={32} />
                </button>
            </div>
        </div>
    );
};

export default MatchView;
