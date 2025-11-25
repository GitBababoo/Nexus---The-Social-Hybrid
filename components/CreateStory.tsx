
import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Camera, Type, Send, ChevronRight, Disc } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { soundEngine } from '../services/soundService';

interface CreateStoryProps {
    onPost: (file: string, type: 'image' | 'video') => void;
    onClose: () => void;
}

const CreateStory: React.FC<CreateStoryProps> = ({ onPost, onClose }) => {
    const { t } = useTranslation();
    const [preview, setPreview] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
                setMediaType(file.type.startsWith('video') ? 'video' : 'image');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleShare = () => {
        if (preview) {
            onPost(preview, mediaType);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-start pt-safe">
                <button onClick={onClose} className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-white/10 transition-colors">
                    <X size={24} />
                </button>
                <div className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white">
                    <Type size={24} />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative bg-[#111] flex items-center justify-center overflow-hidden">
                {preview ? (
                    mediaType === 'video' ? (
                        <video src={preview} autoPlay loop muted className="w-full h-full object-cover" />
                    ) : (
                        <img src={preview} alt="Story Preview" className="w-full h-full object-cover" />
                    )
                ) : (
                    <div className="text-center text-gray-500 flex flex-col items-center gap-4">
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-white/50 hover:bg-white/5 transition-all group"
                        >
                            <Camera size={32} className="text-gray-400 group-hover:text-white" />
                        </div>
                        <p className="text-sm font-medium">{t('story.createDesc') || 'Tap to capture'}</p>
                    </div>
                )}
                
                {/* Gradient Overlay for Text readability */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
            </div>

            {/* Footer Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pb-safe z-20 flex items-center justify-between">
                <div className="flex gap-4">
                    <button onClick={() => fileInputRef.current?.click()} className="w-10 h-10 rounded-lg border-2 border-white/20 overflow-hidden">
                        <img src="https://picsum.photos/seed/gallery/100" className="w-full h-full object-cover opacity-60" />
                    </button>
                </div>

                {preview ? (
                    <button 
                        onClick={handleShare}
                        className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                        {t('story.share') || 'Share to Story'} <Send size={16} />
                    </button>
                ) : (
                    <div className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center cursor-pointer active:scale-90 transition-transform" onClick={() => fileInputRef.current?.click()}>
                        <div className="w-14 h-14 bg-white rounded-full"></div>
                    </div>
                )}

                <div className="w-10"></div> {/* Spacer for center alignment */}
            </div>

            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*,video/*" 
                onChange={handleFileSelect} 
            />
        </div>
    );
};

export default CreateStory;
