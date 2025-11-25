
import React, { useEffect, useRef } from 'react';
import { User } from '../types';
import { Share2, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

interface Node {
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
    label: string;
    image: string;
    isMain?: boolean;
}

interface NeuralGraphProps {
    currentUser: User;
}

const NeuralGraph: React.FC<NeuralGraphProps> = ({ currentUser }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = container.clientWidth;
        let height = container.clientHeight;
        canvas.width = width;
        canvas.height = height;

        // Create Nodes
        const nodes: Node[] = [];
        
        // Main User
        nodes.push({
            id: 'me',
            x: width / 2,
            y: height / 2,
            vx: 0,
            vy: 0,
            radius: 30,
            color: '#6366f1',
            label: 'You',
            image: currentUser.avatar,
            isMain: true
        });

        // Friends
        for(let i=0; i<15; i++) {
            nodes.push({
                id: `friend-${i}`,
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: 15 + Math.random() * 10,
                color: i % 3 === 0 ? '#ec4899' : i % 3 === 1 ? '#8b5cf6' : '#10b981',
                label: `User_${i}`,
                image: `https://picsum.photos/seed/graph${i}/50`
            });
        }

        let animationFrameId: number;

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            
            // Draw Connections
            ctx.lineWidth = 1;
            const mainNode = nodes[0];
            
            nodes.forEach((node, i) => {
                // Physics update
                if (!node.isMain) {
                    node.x += node.vx;
                    node.y += node.vy;

                    // Bounce off walls
                    if (node.x < 0 || node.x > width) node.vx *= -1;
                    if (node.y < 0 || node.y > height) node.vy *= -1;

                    // Gravitate gently towards center
                    const dx = width/2 - node.x;
                    const dy = height/2 - node.y;
                    node.vx += dx * 0.0001;
                    node.vy += dy * 0.0001;
                }

                // Draw Line to Main
                const dist = Math.hypot(mainNode.x - node.x, mainNode.y - node.y);
                const opacity = Math.max(0, 1 - dist / (width * 0.4));
                
                if (!node.isMain && opacity > 0) {
                    ctx.beginPath();
                    ctx.moveTo(mainNode.x, mainNode.y);
                    ctx.lineTo(node.x, node.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
                    ctx.stroke();
                }
                
                // Draw Connections between random nodes
                nodes.forEach((otherNode, j) => {
                    if (i !== j && !node.isMain && !otherNode.isMain) {
                         const d = Math.hypot(node.x - otherNode.x, node.y - otherNode.y);
                         if (d < 150) {
                             ctx.beginPath();
                             ctx.moveTo(node.x, node.y);
                             ctx.lineTo(otherNode.x, otherNode.y);
                             ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - d/150)})`;
                             ctx.stroke();
                         }
                    }
                });
            });

            // Draw Nodes
            nodes.forEach(node => {
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#0f172a';
                ctx.fill();
                ctx.strokeStyle = node.color;
                ctx.lineWidth = 2;
                ctx.stroke();

                // Draw Image (simplified circle clip)
                ctx.save();
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius - 2, 0, Math.PI * 2);
                ctx.closePath();
                ctx.clip();
                // In a real app we'd load images, here we use color/placeholder
                ctx.fillStyle = node.color;
                ctx.fill();
                ctx.fillStyle = 'rgba(0,0,0,0.3)';
                ctx.fill();
                ctx.restore();

                // Draw Label
                ctx.fillStyle = '#ffffff';
                ctx.font = '10px Inter';
                ctx.textAlign = 'center';
                ctx.fillText(node.label, node.x, node.y + node.radius + 15);
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => cancelAnimationFrame(animationFrameId);
    }, [currentUser]);

    return (
        <div className="animate-enter pb-24 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-white font-display flex items-center gap-3">
                        <Share2 size={28} className="text-pink-500" />
                        Neural Graph
                    </h2>
                    <p className="text-gray-400 text-xs">Visualizing your social connections.</p>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 bg-white/5 rounded-lg text-white hover:bg-white/10"><ZoomIn size={18}/></button>
                    <button className="p-2 bg-white/5 rounded-lg text-white hover:bg-white/10"><ZoomOut size={18}/></button>
                    <button className="p-2 bg-white/5 rounded-lg text-white hover:bg-white/10"><RefreshCw size={18}/></button>
                </div>
            </div>

            <div className="flex-1 min-h-[500px] glass-panel rounded-3xl overflow-hidden relative border border-white/10" ref={containerRef}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10 pointer-events-none"></div>
                <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
                
                {/* HUD Overlay */}
                <div className="absolute bottom-4 left-4 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10">
                    <h4 className="text-xs font-bold text-white mb-2 uppercase">Network Stats</h4>
                    <div className="flex gap-4 text-xs text-gray-300">
                        <div>
                            <span className="block font-bold text-indigo-400 text-lg">1,240</span>
                            Nodes
                        </div>
                        <div>
                            <span className="block font-bold text-pink-400 text-lg">3.2k</span>
                            Links
                        </div>
                        <div>
                            <span className="block font-bold text-green-400 text-lg">89%</span>
                            Health
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NeuralGraph;
