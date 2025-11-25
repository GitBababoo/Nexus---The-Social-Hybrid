
import React, { useState } from 'react';
import { Palette, Eraser, Share2, ZoomIn, ZoomOut, Save } from 'lucide-react';
import { soundEngine } from '../services/soundService';

const GRID_SIZE = 20;
const COLORS = [
    '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', 
    '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', 
    '#ffffff', '#94a3b8', '#475569', '#000000'
];

const PixelCanvas: React.FC = () => {
    const [grid, setGrid] = useState<string[]>(Array(GRID_SIZE * GRID_SIZE).fill('#1e293b'));
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [scale, setScale] = useState(1);

    const handlePixelClick = (index: number) => {
        const newGrid = [...grid];
        newGrid[index] = selectedColor;
        setGrid(newGrid);
        soundEngine.playClick();
    };

    return (
        <div className="animate-enter pb-24 flex flex-col items-center">
            <div className="mb-6 w-full text-center md:text-left">
                <h2 className="text-2xl font-bold text-white font-display flex items-center justify-center md:justify-start gap-3">
                    <Palette size={32} className="text-pink-400" />
                    Nexus Canvas
                </h2>
                <p className="text-gray-400 text-xs">Collaborative art space. Place a pixel, leave your mark.</p>
            </div>

            {/* Controls */}
            <div className="glass-panel p-4 rounded-2xl mb-6 flex flex-wrap gap-4 items-center justify-center border border-white/10">
                <div className="flex gap-2">
                    {COLORS.map(color => (
                        <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`w-8 h-8 rounded-full border-2 transition-transform ${selectedColor === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
                <div className="w-px h-8 bg-white/10 mx-2"></div>
                <div className="flex gap-2 text-gray-400">
                    <button onClick={() => setSelectedColor('#1e293b')} className={`p-2 rounded-lg hover:bg-white/10 ${selectedColor === '#1e293b' ? 'text-white bg-white/10' : ''}`}><Eraser size={20}/></button>
                    <button onClick={() => setScale(s => Math.min(2, s + 0.1))} className="p-2 rounded-lg hover:bg-white/10"><ZoomIn size={20}/></button>
                    <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="p-2 rounded-lg hover:bg-white/10"><ZoomOut size={20}/></button>
                </div>
            </div>

            {/* Canvas Container */}
            <div className="overflow-auto max-w-full p-4 border border-white/10 rounded-2xl bg-[#0f172a] shadow-2xl">
                <div 
                    className="grid gap-[1px] bg-gray-800"
                    style={{ 
                        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                        width: `${GRID_SIZE * 20 * scale}px`,
                        height: `${GRID_SIZE * 20 * scale}px`
                    }}
                >
                    {grid.map((color, i) => (
                        <div 
                            key={i}
                            onClick={() => handlePixelClick(i)}
                            className="w-full h-full cursor-pointer hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
            </div>

            <div className="mt-6 flex gap-4">
                 <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20">
                     <Save size={18} /> Save Art
                 </button>
                 <button className="px-6 py-2 bg-white/10 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-white/20 transition-colors">
                     <Share2 size={18} /> Share
                 </button>
            </div>
        </div>
    );
};

export default PixelCanvas;
