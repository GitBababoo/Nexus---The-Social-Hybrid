
import React, { useState, useEffect } from 'react';
import { User, StoryItem } from '../types';
import { X, Heart, Send, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

interface StoryViewerProps {
    onClose: () => void;
    initialUserId: string;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ onClose, initialUserId }) => {
    const [progress, setProgress] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Mock Data
    const storyItems: StoryItem[] = [
        { id: '1', type: 'image', url: 'https://picsum.photos/seed/story1/600/1000', duration: 5, timestamp: '2h ago' },
        { id: '2', type: 'image', url: 'https://picsum.photos/seed/story2/600/1000', duration: 5, timestamp: '1h ago' },
        { id: '3', type: 'image', url: 'https://picsum.photos/seed/story3/600/1000', duration: 5, timestamp: '30m ago' },
    ];
    
    const user: User = { 
        id: initialUserId, 
        name: 'Nexus User', 
        handle: initialUserId, 
        avatar: `https://picsum.photos/seed/${initialUserId}/100`,
        roles: ['user'],
        hasCompletedOnboarding: true
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    if (currentIndex < storyItems.length - 1) {
                        setCurrentIndex(prevIndex => prevIndex + 1);
                        return 0;
                    } else {
                        onClose(); // End of stories
                        return 100;
                    }
                }
                return prev + 1; // 1% every 50ms approx for 5s duration
            });
        }, 50);

        return () => clearInterval(timer);
    }, [currentIndex]);

    const handleNext = () => {
        if (currentIndex < storyItems.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setProgress(0);
        } else {
            onClose();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setProgress(0);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-in fade-in duration-300">
            <button onClick={onClose} className="absolute top-6 right-6 text-white hover:opacity-70 z-50"><X size={32}/></button>
            
            <div className="relative w-full h-full md:w-[450px] md:h-[90vh] md:rounded-3xl overflow-hidden bg-gray-900 border border-white/10 shadow-2xl">
                {/* Progress Bars */}
                <div className="absolute top-4 left-2 right-2 flex gap-1 z-20">
                    {storyItems.map((item, idx) => (
                        <div key={item.id} className="h-1 bg-white/30 rounded-full flex-1 overflow-hidden">
                             <div 
                                className={`h-full bg-white transition-all duration-100 ease-linear ${idx < currentIndex ? 'w-full' : idx === currentIndex ? '' : 'w-0'}`}
                                style={{ width: idx === currentIndex ? `${progress}%` : undefined }}
                             ></div>
                        </div>
                    ))}
                </div>

                {/* Header */}
                <div className="absolute top-8 left-4 flex items-center gap-3 z-20">
                    <img src={user.avatar} className="w-8 h-8 rounded-full border border-white/20" />
                    <div>
                        <span className="text-sm font-bold text-white block leading-none">{user.name}</span>
                        <span className="text-xs text-white/70">{storyItems[currentIndex].timestamp}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="w-full h-full relative" onClick={(e) => {
                    const width = e.currentTarget.offsetWidth;
                    const x = e.nativeEvent.offsetX;
                    if (x < width / 3) handlePrev();
                    else handleNext();
                }}>
                    <img src={storyItems[currentIndex].url} className="w-full h-full object-cover animate-in fade-in" key={currentIndex} />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none"></div>
                </div>

                {/* Footer Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-4 z-20">
                     <div className="flex-1 relative">
                        <input type="text" placeholder={`Reply to ${user.handle}...`} className="w-full bg-transparent border border-white/30 rounded-full py-3 px-4 text-white placeholder-white/70 focus:outline-none focus:border-white focus:bg-white/10" />
                     </div>
                     <button className="text-white hover:scale-110 transition-transform"><Heart size={28} /></button>
                     <button className="text-white hover:scale-110 transition-transform"><Send size={26} /></button>
                </div>
            </div>

            {/* Desktop Nav Arrows */}
            <button onClick={handlePrev} className="hidden md:block absolute left-10 p-4 bg-white/10 rounded-full text-white hover:bg-white/20"><ChevronLeft size={32}/></button>
            <button onClick={handleNext} className="hidden md:block absolute right-10 p-4 bg-white/10 rounded-full text-white hover:bg-white/20"><ChevronRight size={32}/></button>
        </div>
    );
};

export default StoryViewer;
