
import React, { useState, useEffect, useRef } from 'react';
import { Music, Play, Square, RotateCcw, Sliders, Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { soundEngine } from '../services/soundService';

const STEPS = 16;
const INSTRUMENTS = ['Kick', 'Snare', 'HiHat', 'Bass'];
const COLORS = ['bg-rose-500', 'bg-cyan-500', 'bg-yellow-500', 'bg-purple-500'];

const Synthesizer: React.FC = () => {
    const { t } = useTranslation();
    const [grid, setGrid] = useState<boolean[][]>(
        Array(4).fill(null).map(() => Array(STEPS).fill(false))
    );
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [bpm, setBpm] = useState(120);
    
    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            const intervalTime = (60 / bpm) * 1000 / 4; // 16th notes
            interval = setInterval(() => {
                setCurrentStep(prev => {
                    const next = (prev + 1) % STEPS;
                    // Trigger sounds for the next step
                    grid.forEach((row, instrumentIndex) => {
                        if (row[next]) {
                            // Simulating sound trigger - in a real app, connect to Web Audio API
                            soundEngine.playClick(); 
                        }
                    });
                    return next;
                });
            }, intervalTime);
        }
        return () => clearInterval(interval);
    }, [isPlaying, bpm, grid]);

    const toggleStep = (instrument: number, step: number) => {
        const newGrid = [...grid];
        newGrid[instrument][step] = !newGrid[instrument][step];
        setGrid(newGrid);
        soundEngine.playHover();
    };

    const clearGrid = () => {
        setGrid(Array(4).fill(null).map(() => Array(STEPS).fill(false)));
        setIsPlaying(false);
        setCurrentStep(0);
    };

    return (
        <div className="animate-enter pb-24 flex flex-col h-full">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white font-display flex items-center gap-3">
                        <Music size={32} className="text-purple-400" />
                        {t('synth.title')}
                    </h2>
                    <p className="text-gray-400 text-xs">{t('synth.subtitle')}</p>
                </div>
                
                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                        <span className="text-xs font-bold text-gray-400">BPM</span>
                        <input 
                            type="number" 
                            value={bpm} 
                            onChange={(e) => setBpm(Number(e.target.value))} 
                            className="w-12 bg-transparent text-white font-mono text-sm focus:outline-none text-right"
                        />
                    </div>
                    <button onClick={() => setIsPlaying(!isPlaying)} className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 transition-all">
                        {isPlaying ? <Square size={16} fill="white" /> : <Play size={18} fill="white" className="ml-1"/>}
                    </button>
                    <button onClick={clearGrid} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <RotateCcw size={20} />
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-[#0f172a] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
                
                {/* Sequencer Grid */}
                <div className="relative z-10 flex flex-col gap-4 h-full justify-center">
                    {INSTRUMENTS.map((inst, i) => (
                        <div key={inst} className="flex items-center gap-4">
                            <div className="w-16 text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Sliders size={12} /> {inst}
                            </div>
                            <div className="flex-1 grid grid-cols-16 gap-1 h-12">
                                {Array.from({ length: STEPS }).map((_, step) => (
                                    <button
                                        key={step}
                                        onClick={() => toggleStep(i, step)}
                                        className={`rounded-md transition-all duration-75 relative overflow-hidden group ${
                                            grid[i][step] 
                                                ? `${COLORS[i]} shadow-[0_0_10px_currentColor]` 
                                                : 'bg-white/5 hover:bg-white/10'
                                        } ${step % 4 === 0 ? 'border-l border-white/10' : ''}`}
                                    >
                                        {currentStep === step && (
                                            <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Visualizer Decoration */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
            </div>
        </div>
    );
};

export default Synthesizer;