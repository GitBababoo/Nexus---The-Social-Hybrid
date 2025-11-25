
import React, { useState, useEffect } from 'react';
import { Wallet } from '../types';
import { Landmark, TrendingUp, Lock, Unlock, ArrowRight, ShieldCheck, History } from 'lucide-react';
import { soundEngine } from '../services/soundService';
import { useTranslation } from 'react-i18next';

interface VaultViewProps {
    wallet: Wallet;
    onStake: (amount: number) => void;
    onUnstake: (amount: number) => void;
}

const VaultView: React.FC<VaultViewProps> = ({ wallet, onStake, onUnstake }) => {
    const { t } = useTranslation();
    const [stakeAmount, setStakeAmount] = useState('');
    const [apy, setApy] = useState(12.5);
    const [rewards, setRewards] = useState(0.00);

    // Simulate rewards accumulation
    useEffect(() => {
        if (wallet.staked > 0) {
            const interval = setInterval(() => {
                setRewards(prev => prev + (wallet.staked * (apy / 100) / 365 / 24 / 60 / 6)); // Fast simulated yield
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [wallet.staked, apy]);

    const handleStake = () => {
        const val = parseFloat(stakeAmount);
        if (val > 0 && val <= wallet.balance) {
            onStake(val);
            setStakeAmount('');
            soundEngine.playClick();
        }
    };

    const handleUnstake = () => {
        const val = parseFloat(stakeAmount);
        if (val > 0 && val <= wallet.staked) {
            onUnstake(val);
            setStakeAmount('');
            soundEngine.playSuccess();
        }
    };

    return (
        <div className="animate-enter pb-24">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white font-display flex items-center gap-3">
                    <Landmark size={32} className="text-emerald-400" />
                    {t('vault.title')}
                </h2>
                <p className="text-gray-400 text-xs">{t('vault.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Balance Card */}
                <div className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-8 -mt-8"></div>
                     <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">{t('vault.balance')}</h3>
                     <div className="text-3xl font-black text-white mb-1">{wallet.balance.toFixed(2)} NEX</div>
                     <p className="text-xs text-gray-500">{t('vault.ready')}</p>
                </div>

                {/* Staked Card */}
                <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -mr-8 -mt-8"></div>
                     <h3 className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><Lock size={12}/> {t('vault.staked')}</h3>
                     <div className="text-3xl font-black text-white mb-1">{wallet.staked.toFixed(2)} NEX</div>
                     <p className="text-xs text-emerald-400/70">{t('vault.earning')} {apy}% APY</p>
                </div>
            </div>

            {/* Main Action Area */}
            <div className="glass-panel rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                 <div className="flex flex-col md:flex-row gap-8">
                     <div className="flex-1">
                         <div className="flex justify-between items-center mb-4">
                             <h3 className="font-bold text-white text-lg">{t('vault.manage')}</h3>
                             <div className="text-xs text-gray-400 flex items-center gap-1"><ShieldCheck size={12} className="text-green-400"/> {t('vault.audited')}</div>
                         </div>
                         
                         <div className="relative mb-4">
                             <input 
                                type="number" 
                                value={stakeAmount} 
                                onChange={(e) => setStakeAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-[#050b14] border border-white/10 rounded-xl py-4 px-4 text-white text-xl font-mono focus:border-indigo-500 focus:outline-none"
                             />
                             <button 
                                onClick={() => setStakeAmount(wallet.balance.toString())}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-indigo-400 hover:text-white bg-indigo-500/10 px-2 py-1 rounded"
                             >
                                 {t('vault.max')}
                             </button>
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                             <button 
                                onClick={handleStake}
                                disabled={!stakeAmount || parseFloat(stakeAmount) > wallet.balance}
                                className="py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                             >
                                 <Lock size={16} /> {t('vault.stake')}
                             </button>
                             <button 
                                onClick={handleUnstake}
                                disabled={!stakeAmount || parseFloat(stakeAmount) > wallet.staked}
                                className="py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                             >
                                 <Unlock size={16} /> {t('vault.unstake')}
                             </button>
                         </div>
                     </div>

                     <div className="w-px bg-white/10 hidden md:block"></div>

                     <div className="flex-1 flex flex-col justify-center">
                         <h3 className="font-bold text-white text-lg mb-4">{t('vault.yield')}</h3>
                         <div className="flex items-end gap-2 mb-2">
                             <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">
                                 {rewards.toFixed(6)}
                             </span>
                             <span className="text-sm font-bold text-gray-500 mb-1">NEX</span>
                         </div>
                         <p className="text-xs text-gray-500 mb-6">Updates in real-time based on pool activity.</p>
                         
                         <button 
                             onClick={() => {
                                 onStake(rewards); // Re-stake rewards (compound)
                                 setRewards(0);
                                 soundEngine.playMint();
                             }}
                             disabled={rewards <= 0}
                             className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(234,179,8,0.3)] disabled:opacity-50 disabled:shadow-none"
                         >
                             <TrendingUp size={16} /> {t('vault.compound')}
                         </button>
                     </div>
                 </div>
            </div>
            
            <div className="mt-8">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><History size={16}/> {t('vault.activity')}</h3>
                <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                        <span>{t('vault.deposit')}</span>
                        <span>+500.00 NEX</span>
                    </div>
                     <div className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                        <span>Compound</span>
                        <span>+12.45 NEX</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VaultView;
