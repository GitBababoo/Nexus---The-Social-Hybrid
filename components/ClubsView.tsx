
import React, { useState, useEffect } from 'react';
import { Club } from '../types';
import { Users, UserPlus, Check, Plus, X } from 'lucide-react';
import { db } from '../services/db';
import { soundEngine } from '../services/soundService';
import { useTranslation } from 'react-i18next';

interface ClubsViewProps { searchTerm?: string; }

const ClubsView: React.FC<ClubsViewProps> = ({ searchTerm = '' }) => {
    const { t } = useTranslation();
    const [clubs, setClubs] = useState<Club[]>([]);
    const [showCreate, setShowCreate] = useState(false);
    const [newClubName, setNewClubName] = useState('');

    useEffect(() => { setClubs(db.getClubs()); }, []);

    const toggleJoin = (id: string) => {
        const updated = db.joinClub(id);
        const joined = updated.find(c => c.id === id)?.isJoined;
        if (joined) soundEngine.playSuccess(); else soundEngine.playClick();
        setClubs(updated);
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newClubName.trim()) return;
        // In a real app, we'd add to DB. For now, optimistic UI update.
        const newClub: Club = {
            id: `cl-${Date.now()}`,
            name: newClubName,
            members: '1',
            description: 'A new community.',
            image: `https://picsum.photos/seed/${newClubName}/300`,
            isJoined: true
        };
        setClubs(prev => [newClub, ...prev]);
        soundEngine.playSuccess();
        setShowCreate(false);
        setNewClubName('');
    };

    const filtered = clubs.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="animate-enter pb-24 relative">
            <div className="mb-8 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex gap-3"><Users size={32} className="text-orange-400"/> {t('clubs.title')}</h2>
                <button onClick={() => setShowCreate(true)} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-colors border border-white/5"><Plus size={20}/></button>
            </div>
            
            <div className="grid grid-cols-1 gap-6">{filtered.map(club => (
                <div key={club.id} className="glass-panel rounded-3xl overflow-hidden border border-white/5 group hover:border-orange-500/30 transition-all">
                    <div className="relative h-32 md:h-40">
                        <img src={club.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">{club.name}</h3>
                                <span className="text-xs text-gray-300">{club.members} {t('clubs.members')}</span>
                            </div>
                            {club.isJoined ? 
                                <button onClick={() => toggleJoin(club.id)} className="px-4 py-1.5 bg-green-500/20 border border-green-500/50 text-green-400 text-xs font-bold rounded-lg flex items-center gap-1 hover:bg-green-500/30 transition-colors"><Check size={14}/> {t('clubs.joined')}</button> 
                                : 
                                <button onClick={() => toggleJoin(club.id)} className="px-4 py-1.5 bg-orange-500 text-black text-xs font-bold rounded-lg flex items-center gap-1 hover:bg-orange-400 transition-colors shadow-lg shadow-orange-500/20"><UserPlus size={14}/> {t('clubs.join')}</button>
                            }
                        </div>
                    </div>
                    <div className="px-4 py-3 bg-white/5 text-xs text-gray-400">{club.description}</div>
                </div>
            ))}</div>

            {/* Create Club Modal */}
            {showCreate && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-6 w-full max-w-sm relative shadow-2xl">
                        <button onClick={() => setShowCreate(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24}/></button>
                        <h3 className="text-xl font-bold text-white mb-6">Create Community</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Club Name</label>
                                <input 
                                    type="text" 
                                    value={newClubName} 
                                    onChange={(e) => setNewClubName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:outline-none" 
                                    placeholder="e.g. Crypto Traders"
                                />
                            </div>
                            <button type="submit" disabled={!newClubName} className="w-full py-3 bg-orange-500 hover:bg-orange-400 text-black font-bold rounded-xl transition-all shadow-lg disabled:opacity-50">
                                Launch Club
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ClubsView;
