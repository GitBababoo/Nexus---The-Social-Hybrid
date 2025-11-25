
import React from 'react';
import { Rocket, TrendingUp, Users, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PROJECTS = [
    { id: 1, title: 'Neon VR Headset', raised: 125000, goal: 200000, backers: 450, daysLeft: 12, image: 'https://picsum.photos/seed/launch1/600/400', category: 'Hardware' },
    { id: 2, title: 'Decentralized Cloud', raised: 850000, goal: 1000000, backers: 3200, daysLeft: 5, image: 'https://picsum.photos/seed/launch2/600/400', category: 'Web3' },
    { id: 3, title: 'Cyberpunk RPG', raised: 45000, goal: 50000, backers: 890, daysLeft: 2, image: 'https://picsum.photos/seed/launch3/600/400', category: 'Gaming' },
];

const LaunchpadView: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="animate-enter pb-24">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white font-display flex items-center gap-3">
                    <Rocket size={32} className="text-orange-500" />
                    {t('launchpad.title')}
                </h2>
                <p className="text-gray-400 text-xs">{t('launchpad.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {PROJECTS.map(proj => {
                    const percent = Math.min(100, (proj.raised / proj.goal) * 100);
                    return (
                        <div key={proj.id} className="glass-panel rounded-3xl overflow-hidden border border-white/10 group hover:border-orange-500/30 transition-all">
                            <div className="relative h-48 md:h-64">
                                <img src={proj.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute top-4 left-4 bg-white text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                    {proj.category}
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-white">{proj.title}</h3>
                                    <div className="flex items-center gap-1 text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">
                                        <Clock size={12} /> {proj.daysLeft} days left
                                    </div>
                                </div>

                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-400 font-bold">{proj.raised.toLocaleString()} NEX</span>
                                        <span className="text-gray-500">of {proj.goal.toLocaleString()} NEX</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-orange-500 to-red-500" style={{ width: `${percent}%` }}></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>{Math.round(percent)}% funded</span>
                                        <span className="flex items-center gap-1"><Users size={10}/> {proj.backers} backers</span>
                                    </div>
                                </div>

                                <button className="w-full py-3 bg-white text-black font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-lg">
                                    {t('launchpad.back')}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LaunchpadView;
