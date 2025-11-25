
import React, { useState } from 'react';
import { Wallet } from '../types';
import { TrendingUp, ArrowUpRight, ArrowDownLeft, Zap, Wallet as WalletIcon, Clock, CreditCard, BarChart2, X, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { soundEngine } from '../services/soundService';
import { db } from '../services/db';

interface WalletViewProps {
    wallet: Wallet;
}

const WalletView: React.FC<WalletViewProps> = ({ wallet }) => {
    const { t } = useTranslation();
    const [showTransfer, setShowTransfer] = useState(false);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');

    // Generate graph points based on transactions (mocked for visual)
    const graphPoints = [20, 45, 30, 60, 55, 80, 65];
    const maxGraph = Math.max(...graphPoints);
    const polylinePoints = graphPoints.map((val, i) => `${i * (100 / (graphPoints.length - 1))},${100 - (val / maxGraph) * 80}`).join(' ');

    const handleTransfer = (e: React.FormEvent) => {
        e.preventDefault();
        const val = parseFloat(amount);
        if (!recipient || !val || val <= 0 || val > wallet.balance) return;

        db.transaction(val, 'outgoing', `Transfer to ${recipient}`);
        soundEngine.playSuccess();
        setShowTransfer(false);
        setRecipient('');
        setAmount('');
    };

    return (
        <div className="animate-enter pb-24 relative">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white font-display flex items-center gap-3">
                    <WalletIcon size={28} className="text-indigo-400" />
                    {t('wallet.title')}
                </h2>
                <div className="flex items-center gap-2">
                     <div className="px-3 py-1 bg-white/5 rounded-lg text-xs font-mono text-gray-400 border border-white/5 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        {wallet.address}
                     </div>
                </div>
            </div>

            {/* Balance Card */}
            <div className="glass-panel rounded-3xl p-8 mb-8 relative overflow-hidden group border border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.1)]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
                
                <div className="relative z-10">
                     <div className="flex justify-between items-start mb-2">
                        <p className="text-gray-400 font-medium flex items-center gap-2"><CreditCard size={16}/> {t('wallet.total')}</p>
                        <img src="https://picsum.photos/seed/chip/50/50" className="w-10 h-8 rounded opacity-50 mix-blend-screen" alt="chip" />
                     </div>
                     <div className="flex items-baseline gap-2 mb-6">
                         <span className="text-5xl font-black text-white tracking-tight animate-in fade-in transition-all duration-500">
                             {wallet.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                         </span>
                         <span className="text-xl font-bold text-indigo-400">{wallet.currency}</span>
                     </div>

                     <div className="flex gap-4">
                         <button onClick={() => setShowTransfer(true)} className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                             <ArrowUpRight size={18} /> {t('wallet.send')}
                         </button>
                         <button className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-colors border border-white/10">
                             <ArrowDownLeft size={18} /> {t('wallet.receive')}
                         </button>
                     </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-8 right-8 w-12 h-8 rounded-md bg-gradient-to-br from-yellow-200 to-yellow-500 opacity-80 shadow-lg border border-yellow-200/50"></div>
                <div className="absolute bottom-6 right-6 text-white/10 font-black text-6xl select-none">NEXUS</div>
            </div>

            {/* Spending Graph */}
            <div className="glass-panel p-6 rounded-3xl border border-white/5 mb-8 overflow-hidden relative">
                <div className="flex justify-between items-center mb-4 relative z-10">
                    <h3 className="font-bold text-white flex items-center gap-2"><BarChart2 size={18} className="text-cyan-400"/> Activity</h3>
                    <span className="text-xs text-green-400 font-bold">+12% this week</span>
                </div>
                <div className="h-32 w-full relative">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <defs>
                            <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="rgba(6, 182, 212, 0.5)" />
                                <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
                            </linearGradient>
                        </defs>
                        <path d={`M0,100 ${polylinePoints} 100,100 Z`} fill="url(#grad)" />
                        <polyline points={polylinePoints} fill="none" stroke="#06b6d4" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                        {graphPoints.map((val, i) => (
                            <circle key={i} cx={i * (100 / (graphPoints.length - 1))} cy={100 - (val / maxGraph) * 80} r="3" fill="#fff" className="hover:scale-150 transition-transform origin-center" vectorEffect="non-scaling-stroke" />
                        ))}
                    </svg>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center gap-4 hover:bg-white/5 transition-colors group">
                     <div className="p-3 bg-green-500/10 rounded-full text-green-400 group-hover:scale-110 transition-transform">
                         <TrendingUp size={24} />
                     </div>
                     <div>
                         <p className="text-xs text-gray-400">{t('wallet.income')}</p>
                         <p className="text-lg font-bold text-white">+1,250 NEX</p>
                     </div>
                 </div>
                 <div className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center gap-4 hover:bg-white/5 transition-colors group">
                     <div className="p-3 bg-purple-500/10 rounded-full text-purple-400 group-hover:scale-110 transition-transform">
                         <Zap size={24} />
                     </div>
                     <div>
                         <p className="text-xs text-gray-400">{t('wallet.rate')}</p>
                         <p className="text-lg font-bold text-white">2.5x Boost</p>
                     </div>
                 </div>
            </div>

            {/* Transactions */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">{t('wallet.history')}</h3>
                <div className="text-xs text-gray-400 flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg cursor-pointer hover:text-white">
                    <Clock size={12}/> Recent
                </div>
            </div>
            
            <div className="space-y-3">
                {wallet.transactions.length === 0 ? (
                     <div className="p-8 text-center text-gray-500 glass-panel rounded-2xl border border-white/5 border-dashed">No transactions yet</div>
                ) : (
                    wallet.transactions.map(tx => (
                        <div key={tx.id} className="flex items-center justify-between p-4 glass-panel rounded-2xl hover:bg-white/5 transition-colors border border-white/5 animate-enter">
                            <div className="flex items-center gap-4">
                                <div className={`p-2.5 rounded-full ${tx.type === 'incoming' ? 'bg-green-500/10 text-green-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                    {tx.type === 'incoming' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                </div>
                                <div>
                                    <p className="font-bold text-white text-sm">{tx.description}</p>
                                    <p className="text-xs text-gray-500">{tx.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-bold font-mono ${tx.type === 'incoming' ? 'text-green-400' : 'text-white'}`}>
                                    {tx.type === 'incoming' ? '+' : '-'}{tx.amount.toFixed(2)} NEX
                                </p>
                                <p className={`text-[10px] uppercase font-bold ${tx.status === 'completed' ? 'text-gray-500' : 'text-yellow-500'}`}>{tx.status}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* TRANSFER MODAL */}
            {showTransfer && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-6 w-full max-w-sm relative shadow-2xl">
                        <button onClick={() => setShowTransfer(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24}/></button>
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Send size={20} className="text-indigo-400"/> Send NEX</h3>
                        
                        <form onSubmit={handleTransfer} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Recipient</label>
                                <input 
                                    type="text" 
                                    value={recipient} 
                                    onChange={(e) => setRecipient(e.target.value)}
                                    placeholder="@username or 0x..." 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none" 
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Amount</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        value={amount} 
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00" 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-white focus:border-indigo-500 focus:outline-none font-mono text-lg" 
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">NEX</span>
                                </div>
                                <p className="text-right text-xs text-gray-500 mt-1">Max: {wallet.balance.toFixed(2)}</p>
                            </div>
                            <button 
                                type="submit" 
                                disabled={!recipient || !amount || parseFloat(amount) > wallet.balance}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg"
                            >
                                Confirm Transfer
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletView;
