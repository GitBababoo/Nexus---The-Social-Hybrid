
import React, { useState, useEffect, useRef } from 'react';
import { DriveFile } from '../types';
import { Cloud, Folder, Image, FileText, UploadCloud, Trash2, MoreVertical, Search } from 'lucide-react';
import { db } from '../services/db';
import { soundEngine } from '../services/soundService';
import { useTranslation } from 'react-i18next';

interface DriveViewProps { searchTerm?: string; }

const DriveView: React.FC<DriveViewProps> = ({ searchTerm = '' }) => {
    const { t } = useTranslation();
    const [files, setFiles] = useState<DriveFile[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { setFiles(db.getDriveFiles()); }, []);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const newFile: DriveFile = { 
                id: Date.now().toString(), 
                name: file.name, 
                type: file.type.includes('image') ? 'image' : 'doc', 
                size: `${(file.size / 1024 / 1024).toFixed(2)} MB`, 
                modified: 'Just now' 
            };
            setFiles(db.uploadFile(newFile));
            soundEngine.playSuccess();
        }
    };

    const filtered = files.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="animate-enter pb-24">
            <div className="mb-8 flex justify-between items-end">
                <div><h2 className="text-2xl font-bold text-white flex gap-3"><Cloud size={32} className="text-sky-400"/> {t('drive.title')}</h2></div>
                <div>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                    <button onClick={handleUploadClick} className="px-4 py-2 bg-white text-black font-bold rounded-xl flex gap-2 text-sm hover:scale-105 transition-transform"><UploadCloud size={16}/> {t('drive.upload')}</button>
                </div>
            </div>

            {searchTerm && <div className="mb-4 text-xs text-gray-400 flex items-center gap-2"><Search size={12}/> {t('drive.filter')} "{searchTerm}"</div>}
            
            <div className="glass-panel p-6 rounded-3xl border border-white/10 mb-8 bg-gradient-to-r from-indigo-900/20 to-purple-900/20">
                <div className="flex justify-between text-sm mb-2"><span className="text-white font-bold">{t('drive.storage')}</span><span className="text-gray-400">{(files.length * 2.5).toFixed(1)} GB / 100 GB</span></div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-sky-400 to-indigo-500" style={{ width: `${Math.min(100, files.length * 5)}%` }}></div></div>
            </div>
            
            <h3 className="text-lg font-bold text-white mb-4">{t('drive.files')} ({filtered.length})</h3>
            <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
                {filtered.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">{t('drive.noFiles')}</div>
                ) : (
                    filtered.map(file => (
                        <div key={file.id} className="flex px-4 py-3 items-center hover:bg-white/5 border-b border-white/5 text-sm text-gray-300 group transition-colors cursor-pointer">
                            <div className="flex-1 flex items-center gap-3 font-medium text-white">
                                {file.type==='folder'?<Folder size={20} className="text-yellow-400"/>:file.type==='image'?<Image size={20} className="text-purple-400"/>:<FileText size={20} className="text-blue-400"/>}
                                {file.name}
                            </div>
                            <div className="w-24 text-right text-gray-500 text-xs">{file.size}</div>
                            <button className="p-1 opacity-0 group-hover:opacity-100 hover:text-white"><MoreVertical size={16}/></button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
export default DriveView;
