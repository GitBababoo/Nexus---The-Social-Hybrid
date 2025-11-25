
import React, { useEffect, useRef } from 'react';
import { Map, Globe, Navigation, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const HoloMap: React.FC = () => {
    const { t } = useTranslation();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.clientWidth;
        let height = canvas.clientHeight;
        canvas.width = width;
        canvas.height = height;

        const points: {x: number, y: number, z: number, color: string}[] = [];
        const numPoints = 200;

        // Generate sphere points
        for (let i = 0; i < numPoints; i++) {
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = height * 0.35;
            
            points.push({
                x: r * Math.sin(phi) * Math.cos(theta),
                y: r * Math.sin(phi) * Math.sin(theta),
                z: r * Math.cos(phi),
                color: Math.random() > 0.9 ? '#f43f5e' : '#6366f1' // Rare red events
            });
        }

        let angle = 0;
        let animationId: number;

        const draw = () => {
            ctx.fillStyle = '#050b14'; // Clear with bg color
            ctx.fillRect(0, 0, width, height);
            
            // Draw Grid (Static background)
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
            ctx.lineWidth = 1;
            for(let i=0; i<width; i+=40) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
            }
            for(let i=0; i<height; i+=40) {
                ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
            }

            angle += 0.002;

            // Sort points by Z depth for pseudo-3D
            const projectedPoints = points.map(p => {
                // Rotate Y
                const x1 = p.x * Math.cos(angle) - p.z * Math.sin(angle);
                const z1 = p.x * Math.sin(angle) + p.z * Math.cos(angle);
                
                // Simple perspective projection
                const scale = 400 / (400 + z1);
                return {
                    x: x1 * scale + width / 2,
                    y: p.y * scale + height / 2,
                    z: z1,
                    scale: scale,
                    color: p.color
                };
            }).sort((a, b) => b.z - a.z); // Draw back to front

            projectedPoints.forEach(p => {
                const alpha = (p.z + height*0.35) / (height*0.7); // Fade back points
                
                // Connections
                ctx.strokeStyle = `rgba(99, 102, 241, ${Math.max(0, alpha * 0.1)})`;
                projectedPoints.forEach(other => {
                    const dx = p.x - other.x;
                    const dy = p.y - other.y;
                    if (Math.sqrt(dx*dx + dy*dy) < 40) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.stroke();
                    }
                });

                // Node
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2 * p.scale, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = Math.max(0.1, alpha);
                ctx.fill();
                
                // Glow
                if (p.color === '#f43f5e' && p.z > 0) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 8 * p.scale, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(244, 63, 94, 0.2)';
                    ctx.fill();
                }
                
                ctx.globalAlpha = 1;
            });

            // HUD Elements
            ctx.fillStyle = '#fff';
            ctx.font = '10px monospace';
            ctx.fillText(`LAT: ${Math.sin(angle).toFixed(4)}`, 20, height - 40);
            ctx.fillText(`LNG: ${Math.cos(angle).toFixed(4)}`, 20, height - 25);
            ctx.fillText(`NODES: ${numPoints}`, 20, height - 10);

            animationId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationId);
    }, []);

    return (
        <div className="animate-enter pb-24 h-full flex flex-col">
            <div className="mb-4 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white font-display flex items-center gap-3">
                        <Map size={32} className="text-cyan-400" />
                        {t('map.title')}
                    </h2>
                    <p className="text-gray-400 text-xs">{t('map.subtitle')}</p>
                </div>
                <div className="flex gap-2 text-xs font-bold">
                    <div className="flex items-center gap-1 text-rose-400"><span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span> {t('map.events')}</div>
                    <div className="flex items-center gap-1 text-indigo-400"><span className="w-2 h-2 bg-indigo-500 rounded-full"></span> {t('map.users')}</div>
                </div>
            </div>

            <div className="flex-1 glass-panel rounded-3xl overflow-hidden relative border border-white/10 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
                <canvas ref={canvasRef} className="w-full h-full block" />
                
                {/* Overlay UI */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button className="p-2 bg-black/50 text-white rounded-lg border border-white/20 hover:bg-white/10"><Globe size={20}/></button>
                    <button className="p-2 bg-black/50 text-white rounded-lg border border-white/20 hover:bg-white/10"><Navigation size={20}/></button>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center gap-4">
                    <div className="w-10 h-10 bg-rose-500/20 rounded-full flex items-center justify-center text-rose-500 border border-rose-500/50">
                        <Zap size={20} />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-white text-sm font-bold">Nearby: Cyber Rave</h4>
                        <p className="text-gray-400 text-xs">2.4km away • 124 Attendees</p>
                    </div>
                    <button className="px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:scale-105 transition-transform">Route</button>
                </div>
            </div>
        </div>
    );
};

export default HoloMap;