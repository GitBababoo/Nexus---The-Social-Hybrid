
import React, { useState, useRef } from 'react';
import { User } from '../types';
import { X, Camera, MapPin, Globe, Briefcase, User as UserIcon, Mail, Save, Image as ImageIcon, Layers, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EditProfileModalProps {
    user: User;
    onSave: (data: Partial<User>) => void;
    onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onSave, onClose }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'identity' | 'visuals' | 'details'>('identity');
    
    // Form State
    const [formData, setFormData] = useState({
        name: user.name,
        handle: user.handle,
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        occupation: user.occupation || '',
        avatar: user.avatar,
        cover: user.cover || ''
    });

    const coverInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleChange(type, reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    // Simulated randomizer for demo
    const randomizeVisuals = () => {
        const randomId = Math.floor(Math.random() * 1000);
        setFormData(prev => ({
            ...prev,
            avatar: `https://picsum.photos/seed/avatar${randomId}/200/200`,
            cover: `https://picsum.photos/seed/cover${randomId}/800/300`
        }));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in" onClick={onClose}></div>
            
            <div className="relative w-full max-w-lg bg-[#0f172a] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#0f172a] z-10">
                    <h2 className="text-xl font-bold text-white font-display">Edit Profile</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"><X size={20}/></button>
                </div>

                {/* Tabs */}
                <div className="flex px-6 pt-2 border-b border-white/5 gap-6">
                    {['identity', 'visuals', 'details'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`py-3 text-sm font-bold capitalize relative transition-colors ${activeTab === tab ? 'text-indigo-400' : 'text-gray-500 hover:text-white'}`}
                        >
                            {tab}
                            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_-2px_10px_rgba(99,102,241,0.5)]"></div>}
                        </button>
                    ))}
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    
                    {/* VISUALS TAB */}
                    {activeTab === 'visuals' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4">
                            <div className="relative group cursor-pointer rounded-2xl overflow-hidden h-40 border-2 border-dashed border-white/10 hover:border-indigo-500/50 transition-all bg-[#050b14]" onClick={() => coverInputRef.current?.click()}>
                                {formData.cover ? (
                                    <img src={formData.cover} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                                        <ImageIcon size={32} className="mb-2"/>
                                        <span className="text-xs font-bold uppercase">Upload Cover</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Camera size={24} className="text-white"/>
                                </div>
                            </div>

                            <div className="flex justify-center -mt-16 relative z-10">
                                <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                                    <div className="w-28 h-28 rounded-full border-4 border-[#0f172a] bg-[#0f172a] overflow-hidden shadow-xl">
                                        <img src={formData.avatar} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <Camera size={20} className="text-white"/>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <button onClick={randomizeVisuals} className="text-xs font-bold text-indigo-400 hover:text-white bg-indigo-500/10 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors border border-indigo-500/20 hover:bg-indigo-500/20">
                                    <Layers size={14}/> Randomize Looks
                                </button>
                            </div>

                            <input type="file" hidden ref={coverInputRef} accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} />
                            <input type="file" hidden ref={avatarInputRef} accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} />
                        </div>
                    )}

                    {/* IDENTITY TAB */}
                    {activeTab === 'identity' && (
                        <div className="space-y-5 animate-in slide-in-from-right-4">
                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Display Name</label>
                                <div className="relative">
                                    <UserIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors"/>
                                    <input type="text" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-indigo-500 focus:bg-white/10 transition-all placeholder-gray-600 text-sm font-medium" placeholder="Your Name" />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Bio</label>
                                <textarea value={formData.bio} onChange={(e) => handleChange('bio', e.target.value)} rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-indigo-500 focus:bg-white/10 transition-all placeholder-gray-600 text-sm font-medium resize-none" placeholder="Tell the world about yourself..." />
                                <div className="text-right text-[10px] text-gray-500 mt-1">{formData.bio.length}/160</div>
                            </div>
                        </div>
                    )}

                    {/* DETAILS TAB */}
                    {activeTab === 'details' && (
                        <div className="space-y-5 animate-in slide-in-from-right-4">
                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Occupation</label>
                                <div className="relative">
                                    <Briefcase size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors"/>
                                    <input type="text" value={formData.occupation} onChange={(e) => handleChange('occupation', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-indigo-500 focus:bg-white/10 transition-all placeholder-gray-600 text-sm font-medium" placeholder="e.g. Digital Artist" />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Location</label>
                                <div className="relative">
                                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors"/>
                                    <input type="text" value={formData.location} onChange={(e) => handleChange('location', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-indigo-500 focus:bg-white/10 transition-all placeholder-gray-600 text-sm font-medium" placeholder="e.g. Neo Tokyo" />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Website</label>
                                <div className="relative">
                                    <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors"/>
                                    <input type="text" value={formData.website} onChange={(e) => handleChange('website', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-indigo-500 focus:bg-white/10 transition-all placeholder-gray-600 text-sm font-medium" placeholder="https://" />
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-[#0f172a]">
                    <button onClick={handleSubmit} className="w-full py-3.5 bg-white hover:bg-gray-100 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg">
                        <Save size={18} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;
