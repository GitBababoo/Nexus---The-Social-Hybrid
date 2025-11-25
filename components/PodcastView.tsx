
import React from 'react';
import { Mic2, Play, MoreHorizontal, Clock, Headphones } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PODCASTS = [
    { id: 1, title: 'The Future of Reality', host: 'Lex Fridman', duration: '2h 15m', image: 'https://picsum.photos/seed/pod1/300' },
    { id: 2, title: 'Crypto Nights', host: 'Bankless', duration: '1h 05m', image: 'https://picsum.photos/seed/pod2/300' },
    { id: 3, title: 'Design Matters', host: 'Debbie Millman', duration: '45m', image: 'https://picsum.photos/seed/pod3/300' },
];

const PodcastView: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="animate-enter pb-24">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white font-display flex items-center gap-3">
                    <Mic2 size={32} className="text-purple-400" />
                    {t('podcast.title')}
                </h2>
                <p className="text-gray-400 text-xs">{t('podcast.subtitle')}</p>
            </div>

            {/* Featured */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-purple-900 to-indigo-900 p-8 mb-8 flex items-center gap-8">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
                <img src="https://picsum.photos/seed/podfeat/300" className="w-32 h-32 rounded-2xl shadow-2xl relative z-10 hidden md:block" />
                <div className="relative z-10 flex-1">
                    <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded text-white mb-2 inline-block">FEATURED</span>
                    <h3 className="text-2xl font-bold text-white mb-1">Deep Dive into AI Consciousness</h3>
                    <p className="text-indigo-200 text-sm mb-4">Join us as we explore the boundaries of synthetic minds.</p>
                    <button className="bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform">
                        <Play size={18} fill="black" /> Listen Now
                    </button>
                </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-4">Recent Episodes</h3>
            <div className="space-y-4">
                {PODCASTS.map(pod => (
                    <div key={pod.id} className="glass-panel p-4 rounded-2xl border border-white/5 hover:bg-white/5 transition-colors flex items-center gap-4 group cursor-pointer">
                        <div className="relative w-16 h-16 shrink-0">
                            <img src={pod.image} className="w-full h-full rounded-xl object-cover" />
                            <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play size={24} className="text-white fill-white" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-white font-bold text-sm truncate">{pod.title}</h4>
                            <p className="text-gray-400 text-xs">{pod.host}</p>
                        </div>
                        <div className="text-right text-xs text-gray-500 hidden md:block">
                            <div className="flex items-center gap-1"><Clock size={12}/> {pod.duration}</div>
                        </div>
                        <button className="p-2 hover:bg-white/10 rounded-full text-gray-400"><MoreHorizontal size={18}/></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PodcastView;
