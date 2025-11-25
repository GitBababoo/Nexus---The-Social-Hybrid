
import React from 'react';
import { Newspaper, ExternalLink, TrendingUp, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NEWS_ITEMS = [
    { id: 1, title: "Quantum Computing Breakthrough: Stable Qubits at Room Temp", source: "TechCrunch", time: "2h ago", image: "https://picsum.photos/seed/news1/600/400", category: "Tech" },
    { id: 2, title: "Nexus Token (NEX) Surges 15% Following Metaverse Update", source: "CryptoDaily", time: "4h ago", image: "https://picsum.photos/seed/news2/600/400", category: "Crypto" },
    { id: 3, title: "The Rise of AI-Generated Architecture", source: "Wired", time: "6h ago", image: "https://picsum.photos/seed/news3/600/400", category: "Design" },
    { id: 4, title: "Cybersecurity Alert: New Phishing Scheme Targeting VR Users", source: "The Verge", time: "12h ago", image: "https://picsum.photos/seed/news4/600/400", category: "Security" },
    { id: 5, title: "SpaceX Launches New Starlink Satellites", source: "Reuters", time: "1d ago", image: "https://picsum.photos/seed/news5/600/400", category: "Space" },
];

const NewsView: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="animate-enter pb-24">
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white font-display flex items-center gap-3">
                    <Newspaper size={32} className="text-blue-400" />
                    {t('news.title')}
                </h2>
                <div className="bg-white/5 text-xs font-bold text-gray-300 px-3 py-1 rounded-lg flex items-center gap-2">
                    <TrendingUp size={14} className="text-green-400"/> Market: Bullish
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Featured Article */}
                <div className="md:col-span-2 relative h-64 md:h-80 rounded-3xl overflow-hidden group cursor-pointer">
                    <img src={NEWS_ITEMS[0].image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-end">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">{NEWS_ITEMS[0].category}</span>
                            <span className="text-gray-300 text-xs flex items-center gap-1"><Clock size={12}/> {NEWS_ITEMS[0].time}</span>
                        </div>
                        <h3 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-2 group-hover:text-blue-300 transition-colors">{NEWS_ITEMS[0].title}</h3>
                        <p className="text-gray-400 text-sm hidden md:block">Read full story on {NEWS_ITEMS[0].source}</p>
                    </div>
                </div>

                {/* Standard Grid */}
                {NEWS_ITEMS.slice(1).map(item => (
                    <div key={item.id} className="glass-panel rounded-2xl overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all group cursor-pointer flex flex-col">
                        <div className="h-40 relative overflow-hidden">
                            <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm p-1.5 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <ExternalLink size={16} />
                            </div>
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                            <div className="flex justify-between items-center mb-2 text-xs text-gray-500">
                                <span className="font-bold text-blue-400 uppercase tracking-wider">{item.category}</span>
                                <span>{item.time}</span>
                            </div>
                            <h4 className="font-bold text-white text-lg leading-snug mb-4 group-hover:text-blue-300 transition-colors">{item.title}</h4>
                            <div className="mt-auto text-xs font-bold text-gray-400 flex items-center gap-2">
                                <img src={`https://ui-avatars.com/api/?name=${item.source}&background=random`} className="w-5 h-5 rounded-full" />
                                {item.source}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsView;
