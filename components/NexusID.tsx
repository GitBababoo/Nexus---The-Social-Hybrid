
import React from 'react';
import { User } from '../types';
import { QrCode, Share2, Copy, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NexusIDProps {
    user: User;
    onClose: () => void;
}

const NexusID: React.FC<NexusIDProps> = ({ user, onClose }) => {
    const { t } = useTranslation();
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in" onClick={onClose}></div>
            
            <div className="relative w-full max-w-sm perspective-1000 animate-in zoom-in-95 duration-300">
                {/* Holographic Card */}
                <div className="relative bg-[#0f172a] rounded-[24px] overflow-hidden border border-white/20 shadow-[0_0_50px_rgba(99,102,241,0.3)] group transform transition-transform hover:rotate-y-6 hover:rotate-x-6">
                    
                    {/* Holographic Sheen */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent z-20 pointer-events-none opacity-50"></div>
                    <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent rotate-45 animate-shimmer pointer-events-none"></div>

                    {/* Header */}
                    <div className="h-32 bg-gradient-to-r from-indigo-900 via-purple-900 to-black p-6 relative">
                         <img src="https://www.transparenttextures.com/patterns/cubes.png" className="absolute inset-0 opacity-20 mix-blend-overlay" />
                         <div className="flex justify-between items-start relative z-10">
                             <div className="flex items-center gap-2">
                                 <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                     <QrCode className="text-white" size={20} />
                                 </div>
                                 <span className="font-display font-bold text-white tracking-widest text-xs">{t('profile.nexusId')}</span>
                             </div>
                             <button onClick={onClose} className="text-white/50 hover:text-white"><X size={24}/></button>
                         </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 pb-8 relative -mt-12 z-10">
                        <div className="flex flex-col items-center">
                            <div className="w-24 h-24 rounded-[20px] p-1 bg-gradient-to-br from-indigo-500 to-pink-500 mb-4 shadow-xl">
                                <img src={user.avatar} className="w-full h-full object-cover rounded-[18px] bg-black" />
                            </div>
                            
                            <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
                            <p className="text-indigo-400 font-medium mb-6">@{user.handle}</p>

                            {/* QR Code Placeholder */}
                            <div className="bg-white p-3 rounded-xl mb-6 shadow-inner">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=nexus://user/${user.handle}&color=000000&bgcolor=ffffff`} className="w-32 h-32" alt="QR" />
                            </div>

                            <div className="flex items-center gap-4 w-full">
                                <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-white/5">
                                    <Share2 size={16} /> {t('nexusId.share')}
                                </button>
                                <button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-600/20">
                                    <Copy size={16} /> {t('nexusId.copy')}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer Stats */}
                    <div className="bg-black/40 p-4 flex justify-between border-t border-white/10 backdrop-blur-md">
                        <div className="text-center flex-1 border-r border-white/10">
                            <span className="block text-white font-bold text-sm">{user.stats?.level || 1}</span>
                            <span className="text-[10px] text-gray-500 uppercase">{t('profile.level')}</span>
                        </div>
                        <div className="text-center flex-1 border-r border-white/10">
                            <span className="block text-white font-bold text-sm">{user.stats?.followers || 0}</span>
                            <span className="text-[10px] text-gray-500 uppercase">{t('profile.followers')}</span>
                        </div>
                        <div className="text-center flex-1">
                            <span className="block text-green-400 font-bold text-sm">{t('nexusId.active')}</span>
                            <span className="text-[10px] text-gray-500 uppercase">{t('nexusId.status')}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>{`
                .perspective-1000 { perspective: 1000px; }
                @keyframes shimmer {
                    from { transform: translateX(-100%) rotate(45deg); }
                    to { transform: translateX(100%) rotate(45deg); }
                }
                .animate-shimmer {
                    animation: shimmer 3s infinite linear;
                }
            `}</style>
        </div>
    );
};

export default NexusID;
