
import React from 'react';
import { Trophy, Medal, TrendingUp, User } from 'lucide-react';
import { db } from '../services/db';
import { useTranslation } from 'react-i18next';

const LeaderboardView: React.FC = () => {
    const { t } = useTranslation();
    const users = db.getAllUsers().sort((a, b) => (b.stats?.xp || 0) - (a.stats?.xp || 0)).slice(0, 10);

    return (
        <div className="animate-enter pb-24">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-white font-display flex items-center justify-center gap-3">
                    <Trophy size={32} className="text-yellow-400" />
                    {t('leaderboard.title')}
                </h2>
                <p className="text-gray-400 text-xs mt-2">{t('leaderboard.subtitle')}</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
                {/* Top 3 Podium (Simulated styling for top entries) */}
                {users.map((user, idx) => {
                    const rank = idx + 1;
                    let medalColor = 'text-gray-500';
                    let glow = '';
                    let border = 'border-white/5';
                    
                    if (rank === 1) { medalColor = 'text-yellow-400'; glow = 'shadow-[0_0_30px_rgba(250,204,21,0.15)]'; border = 'border-yellow-500/30'; }
                    else if (rank === 2) { medalColor = 'text-gray-300'; border = 'border-gray-400/30'; }
                    else if (rank === 3) { medalColor = 'text-amber-700'; border = 'border-amber-700/30'; }

                    return (
                        <div key={user.id} className={`glass-panel p-4 rounded-2xl flex items-center gap-4 border ${border} ${glow} transition-transform hover:scale-[1.02]`}>
                            <div className={`font-black text-xl w-8 text-center ${medalColor}`}>{rank}</div>
                            <div className="relative">
                                <img src={user.avatar} className="w-12 h-12 rounded-full border-2 border-white/10" />
                                {rank <= 3 && <div className="absolute -top-2 -right-2 bg-white text-black rounded-full p-1 shadow-lg"><Medal size={12} /></div>}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-white font-bold">{user.name}</h4>
                                <p className="text-xs text-gray-500">@{user.handle}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-black text-white font-mono">{user.stats?.xp.toLocaleString()} XP</div>
                                <div className="text-[10px] text-gray-500">Level {user.stats?.level}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LeaderboardView;
