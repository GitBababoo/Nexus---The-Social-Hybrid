
import React from 'react';
import { Quest } from '../types';
import { Trophy, CheckCircle, Circle, Award, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface QuestBoardProps {
    quests: Quest[];
    onClaim: (questId: string) => void;
    userLevel: number;
}

const QuestBoard: React.FC<QuestBoardProps> = ({ quests, onClaim, userLevel }) => {
    const { t } = useTranslation();
    const completedCount = quests.filter(q => q.current >= q.target).length;
    const progress = (completedCount / quests.length) * 100;

    return (
        <div className="animate-enter pb-20">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white font-display flex items-center gap-3">
                    <Trophy size={32} className="text-yellow-400" />
                    {t('quest.title')}
                </h2>
                <p className="text-gray-400 mt-1">{t('quest.subtitle')}</p>
            </div>

            {/* Overall Progress */}
            <div className="glass-panel p-6 rounded-3xl mb-8 border border-white/10 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                 <div className="flex justify-between items-end mb-2 relative z-10">
                     <div>
                         <h3 className="text-lg font-bold text-white">{t('quest.status')}</h3>
                         <p className="text-xs text-gray-400">{completedCount} / {quests.length} {t('quest.completed')}</p>
                     </div>
                     <span className="text-2xl font-black text-yellow-400">{Math.round(progress)}%</span>
                 </div>
                 <div className="h-3 bg-white/10 rounded-full overflow-hidden relative z-10">
                     <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
                 </div>
            </div>

            {/* Quest List */}
            <div className="space-y-4">
                {quests.map(quest => {
                    const isCompleted = quest.current >= quest.target;
                    const canClaim = isCompleted && !quest.isClaimed;

                    return (
                        <div key={quest.id} className={`glass-panel rounded-2xl p-4 border transition-all ${isCompleted ? 'border-green-500/30 bg-green-500/5' : 'border-white/5'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isCompleted ? 'bg-green-500 text-white' : 'bg-white/10 text-gray-500'}`}>
                                    {isCompleted ? <CheckCircle size={24} /> : <Circle size={24} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className={`font-bold text-sm ${isCompleted ? 'text-white' : 'text-gray-300'}`}>{quest.title}</h4>
                                    <p className="text-xs text-gray-500 mb-2">{quest.description}</p>
                                    
                                    {/* Mini Progress */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-indigo-500'}`}
                                                style={{ width: `${Math.min(100, (quest.current / quest.target) * 100)}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-[10px] font-mono text-gray-400">{quest.current}/{quest.target}</span>
                                    </div>
                                </div>
                                
                                {/* Reward / Claim */}
                                <div className="flex flex-col items-end gap-1">
                                    <div className="flex gap-2 text-[10px] font-bold">
                                        <span className="bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30">+{quest.rewardXp} XP</span>
                                        <span className="bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded border border-yellow-500/30">+{quest.rewardCoin} NEX</span>
                                    </div>
                                    
                                    {canClaim ? (
                                        <button 
                                            onClick={() => onClaim(quest.id)}
                                            className="mt-1 px-4 py-1.5 bg-green-500 hover:bg-green-400 text-black font-bold text-xs rounded-lg transition-all shadow-[0_0_15px_rgba(34,197,94,0.4)] animate-pulse"
                                        >
                                            {t('quest.claim')}
                                        </button>
                                    ) : quest.isClaimed ? (
                                        <span className="mt-1 text-xs font-bold text-gray-500 flex items-center gap-1"><Award size={12}/> {t('quest.claimed')}</span>
                                    ) : (
                                        <span className="mt-1 text-xs text-gray-600">{t('quest.inprogress')}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Badges Section */}
            <h3 className="text-lg font-bold text-white mt-10 mb-4 flex items-center gap-2"><Award size={20}/> {t('quest.badges')}</h3>
            <div className="grid grid-cols-3 gap-4">
                 <div className={`glass-panel p-4 rounded-xl flex flex-col items-center justify-center text-center border ${userLevel >= 1 ? 'border-indigo-500/50 bg-indigo-500/10' : 'border-white/5 opacity-50 grayscale'}`}>
                     <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                         <Zap size={32} className="text-white fill-white" />
                     </div>
                     <span className="text-xs font-bold text-white">{t('quest.novice')}</span>
                     <span className="text-[10px] text-gray-400">{t('profile.level')} 1+</span>
                 </div>

                 <div className={`glass-panel p-4 rounded-xl flex flex-col items-center justify-center text-center border ${userLevel >= 5 ? 'border-purple-500/50 bg-purple-500/10' : 'border-white/5 opacity-50 grayscale'}`}>
                     <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                         <CheckCircle size={32} className="text-white fill-white" />
                     </div>
                     <span className="text-xs font-bold text-white">{t('quest.regular')}</span>
                     <span className="text-[10px] text-gray-400">{t('profile.level')} 5+</span>
                 </div>

                 <div className={`glass-panel p-4 rounded-xl flex flex-col items-center justify-center text-center border ${userLevel >= 10 ? 'border-yellow-500/50 bg-yellow-500/10' : 'border-white/5 opacity-50 grayscale'}`}>
                     <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                         <Trophy size={32} className="text-white fill-white" />
                     </div>
                     <span className="text-xs font-bold text-white">{t('quest.elite')}</span>
                     <span className="text-[10px] text-gray-400">{t('profile.level')} 10+</span>
                 </div>
            </div>
        </div>
    );
};

export default QuestBoard;
