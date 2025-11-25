
import React, { useState, useRef, useEffect } from 'react';
import { X, Check, Sliders, RotateCcw, Image as ImageIcon, Maximize, Sun, Contrast, Droplet } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MediaEditorProps {
    imageUrl: string;
    onSave: (processedUrl: string) => void;
    onCancel: () => void;
}

const FILTERS = [
    { name: 'Normal', filter: 'none' },
    { name: 'Cyber', filter: 'contrast(1.2) saturate(1.5) hue-rotate(10deg)' },
    { name: 'Noir', filter: 'grayscale(100%) contrast(1.2)' },
    { name: 'Sepia', filter: 'sepia(0.8) contrast(0.9)' },
    { name: 'Warm', filter: 'sepia(0.3) saturate(1.2) hue-rotate(-10deg)' },
    { name: 'Cool', filter: 'hue-rotate(30deg) saturate(0.8)' },
];

const MediaEditor: React.FC<MediaEditorProps> = ({ imageUrl, onSave, onCancel }) => {
    const { t } = useTranslation();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);
    const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
    const [activeTab, setActiveTab] = useState<'filters' | 'adjust'>('filters');

    // Apply filters to canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.src = imageUrl;
        img.crossOrigin = "anonymous";
        
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Apply filters via CSS logic string
            const filterString = `
                ${activeFilter.filter !== 'none' ? activeFilter.filter : ''} 
                brightness(${brightness}%) 
                contrast(${contrast}%) 
                saturate(${saturation}%)
            `;
            
            ctx.filter = filterString;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
    }, [imageUrl, activeFilter, brightness, contrast, saturation]);

    const handleSave = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            onSave(canvas.toDataURL('image/jpeg', 0.9));
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
            {/* Header */}
            <div className="h-16 px-4 flex items-center justify-between bg-[#0f172a] border-b border-white/10">
                <button onClick={onCancel} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5 transition-colors">
                    <X size={24} />
                </button>
                <h2 className="text-white font-bold text-lg">{t('editor.title')}</h2>
                <button onClick={handleSave} className="px-4 py-1.5 bg-indigo-600 text-white rounded-full font-bold text-sm hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20 flex items-center gap-2">
                    {t('editor.save')} <Check size={16} />
                </button>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 bg-[#050b14] flex items-center justify-center p-8 overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
                <canvas 
                    ref={canvasRef} 
                    className="max-w-full max-h-full object-contain shadow-2xl border border-white/10 rounded-lg"
                />
            </div>

            {/* Controls */}
            <div className="h-64 bg-[#0f172a] border-t border-white/10 flex flex-col">
                {/* Tabs */}
                <div className="flex border-b border-white/10">
                    <button 
                        onClick={() => setActiveTab('filters')}
                        className={`flex-1 py-4 font-bold text-sm flex items-center justify-center gap-2 ${activeTab === 'filters' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-white/5' : 'text-gray-500 hover:text-white'}`}
                    >
                        <ImageIcon size={18} /> {t('editor.filters')}
                    </button>
                    <button 
                        onClick={() => setActiveTab('adjust')}
                        className={`flex-1 py-4 font-bold text-sm flex items-center justify-center gap-2 ${activeTab === 'adjust' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-white/5' : 'text-gray-500 hover:text-white'}`}
                    >
                        <Sliders size={18} /> {t('editor.adjust')}
                    </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    {activeTab === 'filters' && (
                        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                            {FILTERS.map(filter => (
                                <div key={filter.name} className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => setActiveFilter(filter)}>
                                    <div className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${activeFilter.name === filter.name ? 'border-indigo-500 scale-105' : 'border-transparent group-hover:border-white/30'}`}>
                                        <img 
                                            src={imageUrl} 
                                            className="w-full h-full object-cover" 
                                            style={{ filter: filter.filter !== 'none' ? filter.filter : undefined }} 
                                        />
                                    </div>
                                    <span className={`text-xs font-bold ${activeFilter.name === filter.name ? 'text-white' : 'text-gray-500'}`}>{filter.name}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'adjust' && (
                        <div className="space-y-6 max-w-md mx-auto">
                            <div>
                                <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                                    <span className="flex items-center gap-2"><Sun size={14}/> {t('editor.brightness')}</span>
                                    <span>{brightness}%</span>
                                </div>
                                <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500" />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                                    <span className="flex items-center gap-2"><Contrast size={14}/> {t('editor.contrast')}</span>
                                    <span>{contrast}%</span>
                                </div>
                                <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500" />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                                    <span className="flex items-center gap-2"><Droplet size={14}/> {t('editor.saturate')}</span>
                                    <span>{saturation}%</span>
                                </div>
                                <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500" />
                            </div>
                            <div className="flex justify-center mt-4">
                                <button onClick={() => { setBrightness(100); setContrast(100); setSaturation(100); }} className="text-xs text-indigo-400 flex items-center gap-2 hover:text-white">
                                    <RotateCcw size={12} /> Reset Adjustments
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MediaEditor;
