
import React from 'react';
import { BarChart2, UploadCloud, Image, Film, Music, PenTool, Eye, Heart, DollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const StudioView: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="animate-enter pb-24">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-white font-display flex items-center gap-3">
                        <PenTool size={32} className="text-pink-400" />
                        {t('studio.title')}
                    </h2>
                    <p className="text-gray-400 text-xs">{t('studio.subtitle')}</p>
                </div>
                <button className="bg-white text-black px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg hover:scale-105 transition-transform">
                    <UploadCloud size={18} /> {t('studio.upload')}
                </button>
            </div>

            {/* Analytics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-900/20 to-transparent">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400"><Eye size={24} /></div>
                        <span className="text-green-400 text-xs font-bold">+12%</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white">2.4M</h3>
                    <p className="text-gray-400 text-xs">Total Views</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-pink-900/20 to-transparent">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-pink-500/20 rounded-xl text-pink-400"><Heart size={24} /></div>
                        <span className="text-green-400 text-xs font-bold">+5%</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white">85.2K</h3>
                    <p className="text-gray-400 text-xs">Engagements</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-yellow-900/20 to-transparent">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-400"><DollarSign size={24} /></div>
                        <span className="text-green-400 text-xs font-bold">+24%</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white">1,250</h3>
                    <p className="text-gray-400 text-xs">NEX Revenue</p>
                </div>
            </div>

            {/* Recent Assets Table */}
            <div className="glass-panel rounded-3xl overflow-hidden border border-white/10">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-bold text-white">Recent Assets</h3>
                    <button className="text-xs text-indigo-400 hover:text-white">View All</button>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-black/20 text-gray-500 text-xs uppercase font-bold">
                        <tr>
                            <th className="p-4 pl-6">Asset</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right pr-6">Performance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {[1, 2, 3, 4].map((i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors group">
                                <td className="p-4 pl-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-800 rounded-lg overflow-hidden">
                                            <img src={`https://picsum.photos/seed/asset${i}/100`} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="font-bold text-white">Cyberpunk City #{i}</div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        {i % 2 === 0 ? <Image size={16} /> : <Film size={16} />}
                                        {i % 2 === 0 ? 'Image' : 'Video'}
                                    </div>
                                </td>
                                <td className="p-4 text-gray-500">Oct {20 + i}, 2023</td>
                                <td className="p-4"><span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded border border-green-500/30">Published</span></td>
                                <td className="p-4 text-right pr-6 font-mono text-white">{Math.floor(Math.random() * 5000)} views</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudioView;
