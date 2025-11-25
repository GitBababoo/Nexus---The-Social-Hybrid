
import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, Check, User, ShoppingBag, Wallet, Zap, MousePointer2 } from 'lucide-react';
import { soundEngine } from '../services/soundService';

interface TutorialOverlayProps {
    onComplete: () => void;
}

interface Step {
    targetId: string; // DOM ID to highlight
    title: string;
    description: string;
    position: 'top' | 'bottom' | 'left' | 'right' | 'center';
    fallbackTargetId?: string; // For mobile/desktop alternatives
}

const STEPS: Step[] = [
    {
        targetId: 'center-screen', // Special keyword for modal
        title: "Welcome to Nexus",
        description: "Your digital identity is ready. Let's take a quick tour of your new reality.",
        position: 'center'
    },
    {
        targetId: 'nav-home',
        fallbackTargetId: 'mobile-nav-home',
        title: "Your Feed",
        description: "This is your home base. See updates from the network and your friends here.",
        position: 'right'
    },
    {
        targetId: 'create-post-container',
        title: "Broadcast",
        description: "Share your thoughts, images, or mint digital assets directly to the blockchain.",
        position: 'bottom'
    },
    {
        targetId: 'nav-market',
        fallbackTargetId: 'mobile-nav-market',
        title: "The Marketplace",
        description: "Spend your earned NEX credits on digital goods, tools, and customizations.",
        position: 'right'
    },
    {
        targetId: 'xp-widget',
        fallbackTargetId: 'nav-profile', // Fallback for mobile
        title: "Level Up",
        description: "Engage to earn XP. Unlock new roles and badges as you grow.",
        position: 'bottom'
    }
];

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onComplete }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [rect, setRect] = useState<DOMRect | null>(null);
    const [isVisible, setIsVisible] = useState(true);

    // Update position when step changes or window resizes
    useEffect(() => {
        const updatePosition = () => {
            const step = STEPS[currentStepIndex];
            
            if (step.targetId === 'center-screen') {
                setRect(null); // Null rect means center modal
                return;
            }

            let el = document.getElementById(step.targetId);
            
            // Try fallback if main target not found (e.g. mobile view)
            if (!el && step.fallbackTargetId) {
                el = document.getElementById(step.fallbackTargetId);
            }

            if (el) {
                const r = el.getBoundingClientRect();
                setRect(r);
                // Scroll element into view if needed
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                // Element not found, skip step automatically or center fallback
                console.warn(`Tutorial target ${step.targetId} not found`);
                // setRect(null); 
            }
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        return () => window.removeEventListener('resize', updatePosition);
    }, [currentStepIndex]);

    const handleNext = () => {
        soundEngine.playClick();
        if (currentStepIndex < STEPS.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        } else {
            finish();
        }
    };

    const finish = () => {
        soundEngine.playSuccess();
        setIsVisible(false);
        setTimeout(onComplete, 500); // Wait for animation
    };

    const step = STEPS[currentStepIndex];
    const isLastStep = currentStepIndex === STEPS.length - 1;

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] overflow-hidden">
            {/* Dark Backdrop with Cutout using CSS Clip-path or box-shadow trick */}
            {rect ? (
                // Spotlight Mode
                <>
                    {/* The Dark overlay around the rect */}
                    <div 
                        className="absolute inset-0 bg-black/70 transition-all duration-500 ease-in-out"
                        style={{
                            clipPath: `polygon(
                                0% 0%, 
                                0% 100%, 
                                0% ${rect.top}px, 
                                ${rect.left}px ${rect.top}px, 
                                ${rect.left}px ${rect.bottom}px, 
                                ${rect.right}px ${rect.bottom}px, 
                                ${rect.right}px ${rect.top}px, 
                                0% ${rect.top}px, 
                                100% 0%, 
                                100% 100%, 
                                0% 100%
                            )`
                            // Note: Basic polygon cutout. For rounded corners and smoothness, 
                            // a giant box-shadow on a dummy div is often smoother, but this is lightweight.
                        }} 
                    />
                    
                    {/* Glowing Border on target */}
                    <div 
                        className="absolute border-2 border-indigo-500 rounded-xl shadow-[0_0_30px_rgba(99,102,241,0.6)] animate-pulse pointer-events-none transition-all duration-500 ease-in-out"
                        style={{
                            top: rect.top - 4,
                            left: rect.left - 4,
                            width: rect.width + 8,
                            height: rect.height + 8
                        }}
                    />

                    {/* Tooltip Card */}
                    <div 
                        className="absolute bg-[#1e293b] border border-white/10 p-6 rounded-2xl shadow-2xl max-w-xs w-full transition-all duration-500 ease-in-out flex flex-col gap-4"
                        style={{
                            top: rect.bottom + 20 > window.innerHeight - 200 ? rect.top - 220 : rect.bottom + 20, // Flip if too low
                            left: Math.min(Math.max(20, rect.left + rect.width / 2 - 160), window.innerWidth - 340) // Center horizontally, clamp to screen
                        }}
                    >
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-bold text-white font-display">{step.title}</h3>
                            <span className="text-xs font-mono text-gray-500">{currentStepIndex + 1}/{STEPS.length}</span>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">{step.description}</p>
                        
                        <div className="flex justify-between items-center pt-2">
                            <button onClick={onComplete} className="text-xs text-gray-500 hover:text-white">Skip</button>
                            <button 
                                onClick={handleNext}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-lg"
                            >
                                {isLastStep ? "Finish" : "Next"} {isLastStep ? <Check size={14}/> : <ArrowRight size={14}/>}
                            </button>
                        </div>
                        
                        {/* Little arrow pointer */}
                        <div 
                            className={`absolute w-4 h-4 bg-[#1e293b] border-l border-t border-white/10 transform rotate-45 left-1/2 -ml-2 ${rect.bottom + 20 > window.innerHeight - 200 ? '-bottom-2 border-l-0 border-t-0 border-r border-b' : '-top-2'}`}
                        ></div>
                    </div>
                </>
            ) : (
                // Center Modal Mode (Start)
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-500">
                    <div className="bg-[#0f172a] border border-white/10 p-8 rounded-3xl max-w-md text-center shadow-[0_0_50px_rgba(99,102,241,0.2)] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                        <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-400">
                            <MousePointer2 size={40} />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4 font-display">{step.title}</h2>
                        <p className="text-gray-400 mb-8 leading-relaxed">{step.description}</p>
                        <button 
                            onClick={handleNext}
                            className="w-full py-4 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-xl"
                        >
                            Start Tour <ArrowRight size={18}/>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TutorialOverlay;
