
import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw, CloudRain, Coffee, Wind, Moon } from 'lucide-react';
import { soundEngine } from '../services/soundService';
import { useTranslation } from 'react-i18next';

const FocusView: React.FC = () => {
    const { t } = useTranslation();
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [activeSound, setActiveSound] = useState<string | null>(null);

    const SOUNDSCAPES = [
        { id: 'rain', label: t('focus.rain'), icon: CloudRain, color: 'text-blue-400' },
        { id: 'cafe', label: t('focus.cafe'), icon: Coffee, color: 'text-orange-400' },
        { id: 'wind', label: t('focus.wind'), icon: Wind, color: 'text-gray-400' },
        { id: 'night', label: t('focus.space'), icon: Moon, color: 'text-purple-400' },
    ];

    useEffect(() => {
        let interval: any;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            soundEngine.playSuccess();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggleTimer = () => {
        soundEngine.playClick();
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(25 * 60);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="animate-enter pb-24 h-full flex flex-col items-center justify-center">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-white font-display flex items-center justify-center gap-3">
                    <Clock size={32} className="text-indigo-400" />
                    {t('focus.title')}
                </h2>
                <p className="text-gray-400 text-xs">{t('focus.subtitle')}</p>
            </div>

            {/* Timer Circle */}
            <div className="relative w-64 h-64 mb-10 flex items-center justify-center">
                {/* Background Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="128" cy="128" r="120" stroke="#1e293b" strokeWidth="8" fill="none" />
                    <circle 
                        cx="128" cy="128" r="120" 
                        stroke="#6366f1" strokeWidth="8" fill="none" 
                        strokeDasharray={754}
                        strokeDashoffset={754 - (754 * timeLeft) / (25 * 60)}
                        className="transition-all duration-1000 ease-linear"
                        strokeLinecap="round"
                    />
                </svg>
                
                <div className="text-center">
                    <div className="text-6xl font-black text-white font-mono tracking-wider mb-4">{formatTime(timeLeft)}</div>
                    <div className="flex gap-4 justify-center">
                        <button onClick={toggleTimer} className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            {isActive ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" className="ml-1"/>}
                        </button>
                        <button onClick={resetTimer} className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
                            <RotateCcw size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Soundscapes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
                {SOUNDSCAPES.map(sound => (
                    <button 
                        key={sound.id}
                        onClick={() => setActiveSound(activeSound === sound.id ? null : sound.id)}
                        className={`glass-panel p-4 rounded-xl flex flex-col items-center gap-2 border transition-all ${activeSound === sound.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 hover:bg-white/5'}`}
                    >
                        <sound.icon size={24} className={sound.color} />
                        <span className="text-xs font-bold text-gray-300">{sound.label}</span>
                        {activeSound === sound.id && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FocusView;
