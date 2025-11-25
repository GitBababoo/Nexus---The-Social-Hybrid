
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Gamepad2, Play, RefreshCw, Trophy, Coins, ArrowLeft, Grid } from 'lucide-react';
import { soundEngine } from '../services/soundService';
import { useTranslation } from 'react-i18next';

interface ArcadeViewProps {
    onScoreSubmit: (score: number) => void;
}

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const SPEEDS = { EASY: 150, HARD: 80 };

const SnakeGame: React.FC<{ onGameOver: (score: number) => void, onExit: () => void }> = ({ onGameOver, onExit }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAME_OVER'>('START');
    const [score, setScore] = useState(0);
    const [snake, setSnake] = useState<{x: number, y: number}[]>([{x: 10, y: 10}]);
    const [food, setFood] = useState({x: 15, y: 15});
    const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
    
    const initGame = () => {
        setSnake([{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}]);
        setFood({x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE)});
        setScore(0);
        setDirection('RIGHT');
        setGameState('PLAYING');
        soundEngine.playClick();
    };

    useEffect(() => {
        if (gameState !== 'PLAYING') return;
        const moveSnake = () => {
            setSnake(prevSnake => {
                const head = { ...prevSnake[0] };
                switch (direction) {
                    case 'UP': head.y -= 1; break;
                    case 'DOWN': head.y += 1; break;
                    case 'LEFT': head.x -= 1; break;
                    case 'RIGHT': head.x += 1; break;
                }
                if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
                    gameOver(); return prevSnake;
                }
                if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
                    gameOver(); return prevSnake;
                }
                const newSnake = [head, ...prevSnake];
                if (head.x === food.x && head.y === food.y) {
                    setScore(s => s + 10);
                    soundEngine.playSuccess();
                    setFood({x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE)});
                } else {
                    newSnake.pop();
                }
                return newSnake;
            });
        };
        const gameInterval = setInterval(moveSnake, SPEEDS.EASY);
        return () => clearInterval(gameInterval);
    }, [gameState, direction, food]);

    const gameOver = () => {
        setGameState('GAME_OVER');
        soundEngine.playError();
        onGameOver(score);
    };

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            switch(e.key) {
                case 'ArrowUp': if(direction !== 'DOWN') setDirection('UP'); break;
                case 'ArrowDown': if(direction !== 'UP') setDirection('DOWN'); break;
                case 'ArrowLeft': if(direction !== 'RIGHT') setDirection('LEFT'); break;
                case 'ArrowRight': if(direction !== 'LEFT') setDirection('RIGHT'); break;
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [direction]);

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        for(let i=0; i<=GRID_SIZE; i++) {
            ctx.beginPath(); ctx.moveTo(i * CELL_SIZE, 0); ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i * CELL_SIZE); ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE); ctx.stroke();
        }
        ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(food.x * CELL_SIZE + CELL_SIZE/2, food.y * CELL_SIZE + CELL_SIZE/2, CELL_SIZE/2 - 2, 0, Math.PI * 2); ctx.fill();
        snake.forEach((segment, i) => {
            ctx.fillStyle = i === 0 ? '#6366f1' : '#818cf8';
            ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
        });
    }, [snake, food]);

    return (
        <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative flex flex-col items-center">
            <div className="flex justify-between w-full mb-4 text-white font-mono">
                <button onClick={onExit} className="flex items-center gap-2 text-xs hover:text-indigo-400"><ArrowLeft size={14}/> BACK</button>
                <div className="flex items-center gap-2">SCORE: {score}</div>
            </div>
            <canvas ref={canvasRef} width={GRID_SIZE * CELL_SIZE} height={GRID_SIZE * CELL_SIZE} className="rounded-xl border border-white/20 bg-black/50 shadow-inner" />
            {gameState === 'START' && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl">
                    <h3 className="text-2xl font-bold text-white mb-4">Cyber Snake</h3>
                    <button onClick={initGame} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center gap-2 transition-all hover:scale-105 shadow-lg"><Play size={20} /> START</button>
                </div>
            )}
            {gameState === 'GAME_OVER' && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl">
                    <h3 className="text-2xl font-bold text-rose-500 mb-2">GAME OVER</h3>
                    <p className="text-white mb-6">Score: {score}</p>
                    <button onClick={initGame} className="px-8 py-3 bg-white text-black font-bold rounded-xl flex items-center gap-2 transition-all hover:scale-105"><RefreshCw size={20} /> RETRY</button>
                </div>
            )}
        </div>
    );
};

const ArcadeView: React.FC<ArcadeViewProps> = ({ onScoreSubmit }) => {
    const { t } = useTranslation();
    const [activeGame, setActiveGame] = useState<'none' | 'snake'>('none');

    const handleGameOver = (score: number) => {
        const reward = Math.floor(score / 10);
        if (reward > 0) onScoreSubmit(reward);
    };

    if (activeGame === 'snake') {
        return <SnakeGame onGameOver={handleGameOver} onExit={() => setActiveGame('none')} />;
    }

    return (
        <div className="animate-enter pb-24 flex flex-col items-center">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-white font-display flex items-center justify-center gap-3">
                    <Gamepad2 size={32} className="text-purple-400" />
                    {t('arcade.title')}
                </h2>
                <p className="text-gray-400 text-sm mt-1">{t('arcade.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                {/* Snake Card */}
                <div 
                    onClick={() => setActiveGame('snake')}
                    className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-indigo-500/50 cursor-pointer group transition-all hover:-translate-y-1 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                        <Grid size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Cyber Snake</h3>
                    <p className="text-gray-400 text-xs mb-4">Classic gameplay. Eat bits, grow tail, earn crypto.</p>
                    <div className="flex items-center gap-2 text-green-400 text-xs font-bold"><Coins size={12}/> Earn NEX</div>
                </div>

                {/* Placeholder Game */}
                <div className="glass-panel p-6 rounded-3xl border border-white/5 opacity-50 cursor-not-allowed relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
                        <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">COMING SOON</span>
                    </div>
                    <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg grayscale">
                        <Gamepad2 size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Neon Rider</h3>
                    <p className="text-gray-400 text-xs mb-4">High speed racing in the grid.</p>
                </div>
            </div>
        </div>
    );
};

export default ArcadeView;
