
import React from 'react';
import { BarChart2, TrendingUp, PieChart, Calendar, ArrowUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AnalyticsView: React.FC = () => {
    const { t } = useTranslation();
    // Mock Data for Charts
    const engagementData = [45, 60, 35, 80, 55, 90, 75]; // Last 7 days
    const maxVal = Math.max(...engagementData);

    return (
        <div className="animate-enter pb-24">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white font-display flex items-center gap-3">
                    <BarChart2 size={28} className="text-green-400" />
                    {t('analytics.title')}
                </h2>
                <p className="text-gray-400 text-xs">{t('analytics.subtitle')}</p>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="glass-panel p-4 rounded-2xl border border-white/5">
                    <div className="flex justify-between mb-2">
                        <span className="text-xs text-gray-400">{t('analytics.impressions')}</span>
                        <TrendingUp size={16} className="text-green-400" />
                    </div>
                    <span className="text-2xl font-bold text-white">45.2K</span>
                    <span className="text-[10px] text-green-400 flex items-center gap-1 mt-1"><ArrowUp size={10}/> 12% {t('analytics.vs')}</span>
                </div>
                <div className="glass-panel p-4 rounded-2xl border border-white/5">
                    <div className="flex justify-between mb-2">
                        <span className="text-xs text-gray-400">{t('analytics.visits')}</span>
                        <TrendingUp size={16} className="text-indigo-400" />
                    </div>
                    <span className="text-2xl font-bold text-white">1,205</span>
                    <span className="text-[10px] text-indigo-400 flex items-center gap-1 mt-1"><ArrowUp size={10}/> 5% {t('analytics.vs')}</span>
                </div>
                <div className="glass-panel p-4 rounded-2xl border border-white/5">
                    <div className="flex justify-between mb-2">
                        <span className="text-xs text-gray-400">{t('analytics.earned')}</span>
                        <TrendingUp size={16} className="text-yellow-400" />
                    </div>
                    <span className="text-2xl font-bold text-white">350</span>
                    <span className="text-[10px] text-yellow-400 flex items-center gap-1 mt-1"><ArrowUp size={10}/> 20% {t('analytics.vs')}</span>
                </div>
            </div>

            {/* Engagement Graph */}
            <div className="glass-panel p-6 rounded-3xl border border-white/5 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-white">{t('analytics.engagement')}</h3>
                    <div className="flex gap-2">
                        <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">{t('analytics.days')}</span>
                    </div>
                </div>
                
                <div className="h-48 flex items-end justify-between gap-2">
                    {engagementData.map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                            <div className="relative w-full flex justify-center h-full items-end">
                                <div 
                                    className="w-full max-w-[30px] bg-indigo-500/50 rounded-t-lg transition-all duration-500 group-hover:bg-indigo-400" 
                                    style={{ height: `${(val / maxVal) * 100}%` }}
                                >
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded shadow-lg transition-opacity">
                                        {val}
                                    </div>
                                </div>
                            </div>
                            <span className="text-[10px] text-gray-500">D {i+1}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Split View: Content Mix & Audience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-3xl border border-white/5">
                     <h3 className="font-bold text-white mb-4 flex items-center gap-2"><PieChart size={18} className="text-pink-400"/> {t('analytics.contentMix')}</h3>
                     <div className="space-y-4">
                         <div>
                             <div className="flex justify-between text-xs mb-1 text-gray-300">
                                 <span>Images</span>
                                 <span>45%</span>
                             </div>
                             <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                 <div className="h-full bg-pink-500 w-[45%]"></div>
                             </div>
                         </div>
                         <div>
                             <div className="flex justify-between text-xs mb-1 text-gray-300">
                                 <span>Text Posts</span>
                                 <span>30%</span>
                             </div>
                             <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                 <div className="h-full bg-indigo-500 w-[30%]"></div>
                             </div>
                         </div>
                         <div>
                             <div className="flex justify-between text-xs mb-1 text-gray-300">
                                 <span>Videos</span>
                                 <span>25%</span>
                             </div>
                             <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                 <div className="h-full bg-cyan-500 w-[25%]"></div>
                             </div>
                         </div>
                     </div>
                </div>

                 <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-gradient-to-br from-indigo-900/20 to-purple-900/20">
                     <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Calendar size={18} className="text-white"/> {t('analytics.goals')}</h3>
                     <div className="space-y-3">
                         <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                             <div className="w-4 h-4 rounded-full border-2 border-green-500 bg-green-500/20"></div>
                             <span className="text-sm text-gray-200 line-through decoration-gray-500">Post 3 times this week</span>
                         </div>
                         <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                             <div className="w-4 h-4 rounded-full border-2 border-gray-500"></div>
                             <span className="text-sm text-white">Reach 50K Impressions</span>
                         </div>
                         <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                             <div className="w-4 h-4 rounded-full border-2 border-gray-500"></div>
                             <span className="text-sm text-white">Host a Live Stream</span>
                         </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsView;
