
import React, { useState, useEffect } from 'react';
import { SyntheticPet } from '../types';
import { Heart, Zap, Smile, Utensils, MessageCircle, X } from 'lucide-react';
import { soundEngine } from '../services/soundService';
import { useTranslation } from 'react-i18next';

interface CompanionWidgetProps {
    pet: SyntheticPet;
    onUpdatePet: (pet: SyntheticPet) => void;
    walletBalance: number;
    onSpend: (amount: number) => void;
    onClose?: () => void;
}

const CompanionWidget: React.FC<CompanionWidgetProps> = ({ pet, onUpdatePet, walletBalance, onSpend, onClose }) => {
    const { t } = useTranslation();
    // Animation states
    const [isBouncing, setIsBouncing] = useState(false);
    const [dialogue, setDialogue] = useState<string>('');

    // Decrease stats over time
    useEffect(() => {
        const interval = setInterval(() => {
            onUpdatePet({
                ...pet,
                hunger: Math.max(0, pet.hunger - 1),
                happiness: Math.max(0, pet.happiness - 0.5)
            });
        }, 10000); // Check every 10s
        return () => clearInterval(interval);
    }, [pet, onUpdatePet]);

    const handleFeed = () => {
        if (walletBalance < 10) {
            setDialogue(t('companion.dialogue.money'));
            return;
        }
        onSpend(10);
        onUpdatePet({ ...pet, hunger: Math.min(100, pet.hunger + 30) });
        setDialogue(t('companion.dialogue.yummy'));
        soundEngine.playSuccess();
        animate();
    };

    const handlePlay = () => {
        onUpdatePet({ ...pet, happiness: Math.min(100, pet.happiness + 20) });
        setDialogue(t('companion.dialogue.fun'));
        soundEngine.playHover();
        animate();
    };

    const animate = () => {
        setIsBouncing(true);
        setTimeout(() => {
            setIsBouncing(false);
            setDialogue('');
        }, 2000);
    };

    const getMoodColor = () => {
        if (pet.happiness > 70) return 'shadow-[0_0_30px_rgba(74,222,128,0.3)] border-green-500/50';
        if (pet.happiness > 30) return 'shadow-[0_0_30px_rgba(250,204,21,0.3)] border-yellow-500/50';
        return 'shadow-[0_0_30px_rgba(244,63,94,0.3)] border-rose-500/50';
    };

    return (
        <div className="bg-[#0f172a] rounded-3xl p-6 border border-white/10 w-full max-w-sm relative overflow-hidden">
             {onClose && <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-white"><X size={18}/></button>}
             
             {/* Dialogue Bubble */}
             {dialogue && (
                 <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-3 py-1 rounded-full animate-in zoom-in shadow-lg whitespace-nowrap z-10">
                     {dialogue}
                 </div>
             )}

             {/* Pet Visual */}
             <div className="flex justify-center mb-6 mt-4">
                 <div className={`w-32 h-32 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600 relative flex items-center justify-center transition-transform duration-300 border-4 border-[#050b14] ${isBouncing ? '-translate-y-4 scale-110' : ''} ${getMoodColor()}`}>
                     {/* Face */}
                     <div className="flex gap-4">
                         <div className={`w-3 h-3 bg-white rounded-full ${pet.hunger < 30 ? 'animate-pulse' : ''}`}></div>
                         <div className={`w-3 h-3 bg-white rounded-full ${pet.hunger < 30 ? 'animate-pulse' : ''}`}></div>
                     </div>
                     <div className="absolute bottom-10 w-4 h-2 bg-black/20 rounded-b-full"></div>
                     
                     {/* Holographic Ring */}
                     <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-spin-slow" style={{ animationDuration: '10s' }}></div>
                 </div>
             </div>

             <div className="text-center mb-6">
                 <h3 className="text-xl font-bold text-white">{pet.name}</h3>
                 <p className="text-xs text-gray-400">{t('companion.lvl')} {pet.level} {t('companion.synSoul')}</p>
             </div>

             {/* Stats */}
             <div className="space-y-3 mb-6">
                 <div>
                     <div className="flex justify-between text-xs text-gray-400 mb-1">
                         <span className="flex items-center gap-1"><Zap size={12}/> {t('companion.energy')}</span>
                         <span>{pet.hunger}%</span>
                     </div>
                     <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                         <div className={`h-full rounded-full transition-all duration-500 ${pet.hunger < 30 ? 'bg-rose-500' : 'bg-green-500'}`} style={{ width: `${pet.hunger}%` }}></div>
                     </div>
                 </div>
                 <div>
                     <div className="flex justify-between text-xs text-gray-400 mb-1">
                         <span className="flex items-center gap-1"><Smile size={12}/> {t('companion.mood')}</span>
                         <span>{pet.happiness}%</span>
                     </div>
                     <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-yellow-500 rounded-full transition-all duration-500" style={{ width: `${pet.happiness}%` }}></div>
                     </div>
                 </div>
             </div>

             {/* Actions */}
             <div className="grid grid-cols-2 gap-3">
                 <button onClick={handleFeed} className="py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition-colors border border-white/5">
                     <Utensils size={14} className="text-rose-400"/> {t('companion.feed')} (10 NEX)
                 </button>
                 <button onClick={handlePlay} className="py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition-colors border border-white/5">
                     <Heart size={14} className="text-pink-400"/> {t('companion.play')}
                 </button>
             </div>
        </div>
    );
};

export default CompanionWidget;
