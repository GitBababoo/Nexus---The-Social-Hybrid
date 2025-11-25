
import React, { useState, useEffect } from 'react';
import { Bounty } from '../types';
import { Briefcase, DollarSign, Code, PenTool, FileText, CheckCircle2 } from 'lucide-react';
import { db } from '../services/db';
import { soundEngine } from '../services/soundService';
import { useTranslation } from 'react-i18next';

interface BountyBoardProps { searchTerm?: string; }

const BountyBoard: React.FC<BountyBoardProps> = ({ searchTerm = '' }) => {
    const { t } = useTranslation();
    const [bounties, setBounties] = useState<Bounty[]>([]);
    
    // Poll DB for changes
    useEffect(() => { 
        setBounties(db.getBounties());
        const interval = setInterval(() => setBounties(db.getBounties()), 2000);
        return () => clearInterval(interval);
    }, []);

    const handleAccept = (id: string) => {
        soundEngine.playClick();
        setBounties(db.acceptBounty(id));
        soundEngine.playSuccess();
    };

    const filtered = bounties.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="animate-enter pb-24">
            <div className="mb-8"><h2 className="text-2xl font-bold text-white flex gap-3"><Briefcase size={32} className="text-orange-400"/> {t('bounty.title')}</h2></div>
            <div className="grid grid-cols-1 gap-4">{filtered.map(bounty => (
                <div key={bounty.id} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-orange-500/30 transition-all relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="flex items-center gap-3"><div className={`p-3 rounded-xl ${bounty.category==='Dev'?'bg-blue-500/20 text-blue-400':'bg-pink-500/20 text-pink-400'}`}>{bounty.category==='Dev'?<Code size={20}/>:<PenTool size={20}/>}</div><div><h3 className="font-bold text-white text-lg">{bounty.title}</h3><span className="text-xs text-gray-500">@{bounty.employer}</span></div></div>
                        <div className="text-right"><div className="text-2xl font-black text-white flex items-center gap-1">{bounty.reward} <span className="text-xs text-orange-400">NEX</span></div></div>
                    </div>
                    <p className="text-gray-300 text-sm mb-6 bg-white/5 p-4 rounded-xl relative z-10">{bounty.description}</p>
                    <div className="flex justify-between items-center relative z-10">{bounty.status === 'Open' ? <button onClick={() => handleAccept(bounty.id)} className="px-6 py-2 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform flex items-center gap-2">{t('bounty.accept')} <DollarSign size={16}/></button> : <button disabled className="px-6 py-2 bg-green-500/10 text-green-400 border border-green-500/20 font-bold rounded-xl flex items-center gap-2"><CheckCircle2 size={16}/> {t('bounty.progress')}</button>}</div>
                </div>
            ))}</div>
        </div>
    );
};
export default BountyBoard;
