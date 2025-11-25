
import React, { useState } from 'react';
import { Disc, Sparkles, AlertCircle } from 'lucide-react';
import { soundEngine } from '../services/soundService';
import { useTranslation } from 'react-i18next';

interface LuckyWheelProps {
    onWin: (reward: number, type: 'xp' | 'coin') => void;
}

const ITEMS = [
    { label: '50 NEX', color: '#f59e0b', type: 'coin', val: 50 },
    { label: '100 XP', color: '#3b82f6', type: 'xp', val: 100 },
    { label: 'Try Again', color: '#64748b', type: 'none', val: 0 },
    { label: '500 XP', color: '#8b5cf6', type: 'xp', val: 500 },
    { label: '10 NEX', color: '#f59e0b', type: 'coin', val: 10 },
    { label: 'Jackpot', color: '#ec4899', type: 'coin', val: 1000 },
    { label: 'Try Again', color: '#64748b', type: 'none', val: 0 },
    { label: '200 XP', color: '#3b82f6', type: 'xp', val: 200 },
];

const LuckyWheel: React.FC<LuckyWheelProps> = ({ onWin }) => {
    const { t } = useTranslation();
    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [hasSpun, setHasSpun] = useState(false);

    const spin = () => {
        if (spinning || hasSpun) return;
        setSpinning(true);
        soundEngine.playClick();
        
        // Random rotations (at least 5 full spins + random segment)
        const randomSegment = Math.floor(Math.random() * ITEMS.length);
        const segmentAngle = 360 / ITEMS.length;
        // Calculate offset to land in middle of segment
        const finalAngle = 3600 + (randomSegment * segmentAngle); 
        
        setRotation(finalAngle);

        setTimeout(() => {
            setSpinning(false);
            setHasSpun(true);
            const winningItem = ITEMS[ITEMS.length - 1 - randomSegment]; // Reverse index due to rotation
            
            if (winningItem.val > 0) {
                soundEngine.playSuccess();
                onWin(winningItem.val, winningItem.type as any);
            } else {
                soundEngine.playError();
            }
        }, 5000);
    };

    return (
        <div className="animate-enter pb-24 flex flex-col items-center">
             <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-white font-display flex items-center justify-center gap-3">
                    <Disc size={32} className="text-purple-400" />
                    {t('wheel.title')}
                </h2>
                <p className="text-gray-400 text-sm mt-1">{t('wheel.subtitle')}</p>
            </div>

            <div className="relative mb-8">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 z-20 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-white drop-shadow-lg"></div>

                {/* Wheel */}
                <div 
                    className="w-80 h-80 rounded-full border-4 border-white/20 overflow-hidden relative shadow-[0_0_50px_rgba(168,85,247,0.3)] bg-[#1e293b]"
                    style={{ 
                        transform: `rotate(${rotation}deg)`,
                        transition: 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)'
                    }}
                >
                    {ITEMS.map((item, i) => (
                        <div 
                            key={i}
                            className="absolute w-[50%] h-[50%] top-[50%] left-[50%] origin-top-left flex items-end justify-center pt-8 border-l border-b border-white/5"
                            style={{ 
                                backgroundColor: item.color,
                                transform: `rotate(${i * (360 / ITEMS.length)}deg) translateY(-100%)`,
                                clipPath: 'polygon(0 0, 100% 0, 100% 100%)' // Simplification for segments
                            }}
                        >
                             {/* CSS-only wheel segments are tricky, using simplified bg colors here */}
                        </div>
                    ))}
                    
                    {/* Render text on top to avoid rotation issues with clip-path */}
                    {ITEMS.map((item, i) => (
                         <div 
                            key={`txt-${i}`}
                            className="absolute top-[50%] left-[50%] w-full h-[2px] origin-left pl-10 flex items-center"
                            style={{ 
                                transform: `rotate(${i * (360 / ITEMS.length) + (360/ITEMS.length)/2}deg) translate(20px)`
                            }}
                         >
                            <span className="text-white font-bold text-xs drop-shadow-md whitespace-nowrap">{item.label}</span>
                         </div>
                    ))}
                </div>
                
                {/* Center Hub */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl border-4 border-gray-200 z-10 flex items-center justify-center">
                    <Sparkles size={20} className="text-purple-500" />
                </div>
            </div>

            <button 
                onClick={spin}
                disabled={spinning || hasSpun}
                className={`px-12 py-4 rounded-2xl font-black text-xl tracking-widest transition-all shadow-xl ${spinning || hasSpun ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-105 hover:shadow-indigo-500/50'}`}
            >
                {spinning ? t('wheel.spinning') : hasSpun ? t('wheel.comeBack') : t('wheel.spin')}
            </button>
            
            {hasSpun && (
                <div className="mt-4 flex items-center gap-2 text-gray-400 text-sm">
                    <AlertCircle size={14}/> {t('wheel.reset')}
                </div>
            )}
        </div>
    );
};

export default LuckyWheel;
