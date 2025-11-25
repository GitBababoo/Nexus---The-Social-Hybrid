
import React, { useState, useEffect } from 'react';
import { Proposal } from '../types';
import { Vote, CheckCircle, XCircle } from 'lucide-react';
import { db } from '../services/db';
import { soundEngine } from '../services/soundService';
import { useTranslation } from 'react-i18next';

const DaoView: React.FC = () => {
    const { t } = useTranslation();
    const [proposals, setProposals] = useState<Proposal[]>([]);

    useEffect(() => { setProposals(db.getProposals()); }, []);

    const handleVote = (id: string, vote: 'for' | 'against') => {
        soundEngine.playClick();
        const updated = db.voteProposal(id, vote);
        setProposals(updated);
        soundEngine.playSuccess();
    };

    return (
        <div className="animate-enter pb-24">
            <div className="mb-8"><h2 className="text-2xl font-bold text-white flex gap-3"><Vote size={32} className="text-cyan-400" /> {t('dao.title')}</h2><p className="text-gray-400 text-xs">{t('dao.subtitle')}</p></div>
            <div className="space-y-6">{proposals.map(prop => {
                const total = prop.votesFor + prop.votesAgainst;
                const percent = total > 0 ? (prop.votesFor / total) * 100 : 0;
                return (
                    <div key={prop.id} className="glass-panel rounded-3xl p-6 border border-white/10 relative overflow-hidden">
                        <div className="flex justify-between mb-4"><span className={`px-2 py-1 rounded text-xs font-bold ${prop.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-indigo-500/10 text-indigo-400'}`}>{prop.status}</span><span className="text-xs font-mono text-gray-500">#{prop.id}</span></div>
                        <h3 className="text-xl font-bold text-white mb-2">{prop.title}</h3>
                        <p className="text-gray-400 text-sm mb-6">{prop.description}</p>
                        <div className="mb-2 flex justify-between text-xs font-bold"><span className="text-green-400">Yes {Math.round(percent)}%</span><span className="text-red-400">No {Math.round(100 - percent)}%</span></div>
                        <div className="h-4 bg-white/10 rounded-full overflow-hidden flex mb-6"><div className="h-full bg-green-500" style={{ width: `${percent}%` }}></div><div className="h-full bg-red-500" style={{ width: `${100 - percent}%` }}></div></div>
                        {prop.status === 'Active' && !prop.userVoted && <div className="flex gap-3"><button onClick={() => handleVote(prop.id, 'for')} className="flex-1 py-2 bg-green-500/10 text-green-400 border border-green-500/30 rounded-xl font-bold text-xs flex justify-center gap-2"><CheckCircle size={16}/> {t('dao.voteYes')}</button><button onClick={() => handleVote(prop.id, 'against')} className="flex-1 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl font-bold text-xs flex justify-center gap-2"><XCircle size={16}/> {t('dao.voteNo')}</button></div>}
                        {prop.userVoted && <div className="text-sm font-bold text-white bg-white/5 px-3 py-1.5 rounded-lg inline-block">{t('dao.youVoted')} <span className={prop.userVoted === 'for' ? 'text-green-400' : 'text-red-400'}>{prop.userVoted.toUpperCase()}</span></div>}
                    </div>
                );
            })}</div>
        </div>
    );
};
export default DaoView;
