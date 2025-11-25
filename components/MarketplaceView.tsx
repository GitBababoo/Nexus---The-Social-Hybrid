
import React, { useState } from 'react';
import { Product } from '../types';
import { Search, ShoppingBag, Filter, ShoppingCart, ArrowRight, CheckCircle, Star, Heart, AlertCircle, Loader2, TrendingUp, BrainCircuit } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MarketplaceViewProps { walletBalance: number; onBuyItem: (product: Product) => void; ownedItems: string[]; searchTerm: string; }

const MOCK_PRODUCTS: Product[] = [
    { id: '1', name: 'Cyberpunk Helmet v2', price: 150.00, displayPrice: '150 NEX', category: 'Accessories', image: 'https://picsum.photos/seed/prod1/400/400', seller: { id: 's1', name: 'Tech Vendor', handle: 'tech', avatar: '', roles: ['user'], hasCompletedOnboarding: true } },
    { id: '2', name: 'Neon Light Strips', price: 25.00, displayPrice: '25 NEX', category: 'Home', image: 'https://picsum.photos/seed/prod2/400/400', seller: { id: 's2', name: 'Light House', handle: 'light', avatar: '', roles: ['user'], hasCompletedOnboarding: true }, isHot: true },
    { id: '3', name: 'Mechanical Keycaps', price: 45.00, displayPrice: '45 NEX', category: 'Tech', image: 'https://picsum.photos/seed/prod3/400/400', seller: { id: 's3', name: 'Keebs', handle: 'keeb', avatar: '', roles: ['user'], hasCompletedOnboarding: true } },
    { id: '4', name: 'Digital Art Frame', price: 300.00, displayPrice: '300 NEX', category: 'Home', image: 'https://picsum.photos/seed/prod4/400/400', seller: { id: 's4', name: 'ArtTech', handle: 'art', avatar: '', roles: ['user'], hasCompletedOnboarding: true } },
    { id: '5', name: 'Holographic Plant', price: 80.00, displayPrice: '80 NEX', category: 'Home', image: 'https://picsum.photos/seed/prod5/400/400', seller: { id: 's5', name: 'FutureFlora', handle: 'flora', avatar: '', roles: ['user'], hasCompletedOnboarding: true } },
    { id: '6', name: 'Smart Glasses', price: 450.00, displayPrice: '450 NEX', category: 'Tech', image: 'https://picsum.photos/seed/prod6/400/400', seller: { id: 's6', name: 'VisionCorp', handle: 'vision', avatar: '', roles: ['user'], hasCompletedOnboarding: true } },
];

const MarketplaceView: React.FC<MarketplaceViewProps> = ({ walletBalance, onBuyItem, ownedItems, searchTerm }) => {
    const { t } = useTranslation();
    const [category, setCategory] = useState('All');
    const [purchasingId, setPurchasingId] = useState<string | null>(null);

    const filteredProducts = MOCK_PRODUCTS.filter(p => (category === 'All' || p.category === category) && p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleBuyClick = (product: Product) => {
        setPurchasingId(product.id);
        setTimeout(() => { 
            onBuyItem(product); 
            setPurchasingId(null); 
        }, 800);
    };

    const categories = [
        { id: 'All', label: t('market.cat.all') },
        { id: 'Tech', label: t('market.cat.tech') },
        { id: 'Home', label: t('market.cat.home') },
        { id: 'Accessories', label: t('market.cat.acc') },
    ];

    return (
        <div className="animate-enter pb-24">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3"><ShoppingBag className="text-indigo-400" size={32} /> {t('market.title')}</h2>
                    <p className="text-gray-400 mt-1 flex items-center gap-2">
                        {t('market.balance')} 
                        <span className={`font-mono font-bold px-2 py-0.5 rounded ${walletBalance < 100 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                            {walletBalance.toFixed(2)} NEX
                        </span>
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="w-full md:w-auto px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm flex items-center gap-2">
                        <Search size={14} className="text-gray-400"/> {searchTerm ? `${t('market.searching')}: "${searchTerm}"` : t('market.browse')}
                    </div>
                    <button className="p-2.5 bg-indigo-600 rounded-xl text-white relative shadow-lg shadow-indigo-600/20 hover:scale-105 transition-transform">
                        <ShoppingCart size={20}/>
                        {ownedItems.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold">{ownedItems.length}</span>}
                    </button>
                </div>
            </div>
            
            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-2">
                {categories.map(cat => (
                    <button key={cat.id} onClick={() => setCategory(cat.id)} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all border ${category === cat.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white/5 text-gray-400 border-white/5 hover:text-white hover:border-white/10'}`}>{cat.label}</button>
                ))}
            </div>

            {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 border-dashed">
                    <ShoppingBag size={48} className="mx-auto text-gray-600 mb-4"/>
                    <p className="text-gray-400">No items found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredProducts.map(product => {
                        const isOwned = ownedItems.includes(product.id);
                        const canAfford = walletBalance >= product.price;
                        const isPurchasing = purchasingId === product.id;

                        return (
                            <div key={product.id} className="glass-panel rounded-2xl overflow-hidden border border-white/5 hover:border-indigo-500/50 transition-all shadow-lg flex flex-col group hover:-translate-y-1 duration-300">
                                <div className="relative aspect-square bg-gray-800 overflow-hidden">
                                    <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} />
                                    {isOwned && <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1"><CheckCircle size={10}/> {t('market.owned')}</div>}
                                    {product.isHot && !isOwned && <div className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1"><Star size={10} fill="white"/> HOT</div>}
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <h3 className="text-white font-bold text-sm leading-tight mb-1">{product.name}</h3>
                                    <div className="flex justify-between items-center mb-3">
                                        <p className="text-indigo-400 font-mono font-bold text-sm">{product.displayPrice}</p>
                                    </div>
                                    <div className="mt-auto">
                                        {isOwned ? (
                                            <button disabled className="w-full py-2 bg-white/5 text-gray-500 text-xs font-bold rounded-lg border border-white/5 cursor-default flex items-center justify-center gap-2">
                                                <CheckCircle size={14}/> {t('market.owned')}
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleBuyClick(product)} 
                                                disabled={!canAfford || isPurchasing} 
                                                className={`w-full py-2 text-xs font-bold rounded-lg flex justify-center items-center gap-1 transition-all ${canAfford ? 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-lg shadow-indigo-600/20' : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'}`}
                                            >
                                                {isPurchasing ? <Loader2 size={14} className="animate-spin"/> : canAfford ? <>{t('market.buy')}</> : <><AlertCircle size={14}/> {t('market.funds')}</>}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
export default MarketplaceView;
