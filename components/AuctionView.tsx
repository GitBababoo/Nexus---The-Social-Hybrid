
import React, { useState, useEffect } from 'react';
import { AuctionItem, Wallet } from '../types';
import { Gavel, Clock, ArrowUp, TrendingUp } from 'lucide-react';
import { db } from '../services/db';
import { useTranslation } from 'react-i18next';

interface AuctionViewProps { wallet: Wallet; onPlaceBid: (itemId: string, amount: number) => void; }

const AuctionView: React.FC<AuctionViewProps> = ({ wallet, onPlaceBid }) => {
    const { t } = useTranslation();
    const [auctions, setAuctions] = useState<AuctionItem[]>([]);
    const [timers, setTimers] = useState<Record<string, string>>({});

    useEffect(() => { setAuctions(db.getAuctions()); }, [wallet]); // Refresh on wallet change (bid update)

    useEffect(() => {
        const interval = setInterval(() => {
            const newTimers: Record<string, string> = {};
            auctions.forEach(item => {
                const diff = item.endTime - Date.now();
                newTimers[item.id] = diff <= 0 ? t('auction.ended') : `${Math.floor(diff / 3600000)}h ${Math.floor((diff % 3600000) / 60000)}m`;
            });
            setTimers(newTimers);
        }, 1000);
        return () => clearInterval(interval);
    }, [auctions, t]);

    const handleBid = (id: string, currentBid: number, increment: number) => {
        const nextBid = currentBid + increment;
        if (wallet.balance >= nextBid) {
            onPlaceBid(id, nextBid);
            setAuctions(prev => prev.map(a => a.id === id ? { ...a, currentBid: nextBid, bidders: a.bidders + 1, highestBidder: 'You' } : a));
        } else { alert("Insufficient funds"); }
    };

    return (
        <div className="animate-enter pb-24">
            <div className="flex justify-between mb-8"><div><h2 className="text-2xl font-bold text-white flex gap-3"><Gavel size={28} className="text-amber-500"/> {t('auction.title')}</h2></div><div className="bg-white/5 px-4 py-2 rounded-xl text-right"><p className="text-xs text-gray-500">{t('auction.funds')}</p><p className="font-mono font-bold text-white">{wallet.balance} NEX</p></div></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{auctions.map(item => (
                <div key={item.id} className="glass-panel rounded-3xl overflow-hidden border border-white/5 group"><div className="relative h-48"><img src={item.image} className="w-full h-full object-cover" /><div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded-lg flex gap-2"><Clock size={14} className="text-green-400"/><span className="font-mono font-bold text-sm text-white">{timers[item.id] || '...'}</span></div></div><div className="p-6"><div className="flex justify-between items-end mb-6"><div><p className="text-xs text-gray-400">{t('auction.highest')}</p><span className="text-2xl font-black text-white">{item.currentBid} NEX</span><p className="text-xs text-gray-500">by <span className="text-indigo-400">@{item.highestBidder}</span></p></div><div className="text-right"><p className="text-xs text-gray-400">{t('auction.bidders')}</p><p className="font-bold text-white">{item.bidders}</p></div></div>{timers[item.id] !== t('auction.ended') ? <button onClick={() => handleBid(item.id, item.currentBid, item.minBidIncrement)} className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm rounded-xl flex justify-center gap-2">{t('auction.bid')} {item.currentBid + item.minBidIncrement} NEX <ArrowUp size={16}/></button> : <button disabled className="w-full py-4 bg-white/5 text-gray-500 font-bold rounded-xl">{t('auction.ended')}</button>}</div></div>
            ))}</div>
        </div>
    );
};
export default AuctionView;
