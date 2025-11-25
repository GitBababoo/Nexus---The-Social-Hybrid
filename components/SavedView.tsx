
import React from 'react';
import { Bookmark, ArrowRight, Grid, List, Folder, Trash2 } from 'lucide-react';
import { Post } from '../types';
import { useTranslation } from 'react-i18next';

interface SavedViewProps {
  savedPosts: Post[];
  onRemove: (id: string) => void;
}

const SavedView: React.FC<SavedViewProps> = ({ savedPosts, onRemove }) => {
  const { t } = useTranslation();
  const categories = [
    { id: 1, name: 'Design Inspiration', count: 12, color: 'bg-pink-500' },
    { id: 2, name: 'Dev Tutorials', count: 8, color: 'bg-blue-500' },
    { id: 3, name: 'Articles', count: 5, color: 'bg-emerald-500' },
  ];

  return (
    <div className="animate-enter mt-2 pb-20">
       <div className="flex items-center justify-between mb-8 px-2">
         <h2 className="text-2xl font-bold text-white flex items-center gap-3 font-display">
           <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
             <Bookmark className="fill-current" size={24} />
           </div>
           {t('saved.title')}
         </h2>
         <div className="flex gap-2">
            <button className="p-2 hover:bg-white/10 rounded-lg text-white"><Grid size={20}/></button>
            <button className="p-2 hover:bg-white/10 rounded-lg text-gray-500"><List size={20}/></button>
         </div>
       </div>

       {/* Collections Rail (Mock) */}
       <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 mb-4">
          {categories.map(cat => (
            <div key={cat.id} className="min-w-[160px] glass-panel p-4 rounded-2xl cursor-pointer hover:bg-white/5 transition-colors group border border-white/5">
               <div className={`w-10 h-10 ${cat.color} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                  <Folder size={20} className="text-white fill-white/20" />
               </div>
               <h4 className="font-bold text-white text-sm">{cat.name}</h4>
               <p className="text-xs text-gray-400 mt-1">{cat.count} items</p>
            </div>
          ))}
       </div>

       <h3 className="text-lg font-bold text-white mb-4 px-2">{t('saved.recent')}</h3>
       
       {savedPosts.length === 0 ? (
          <div className="text-center py-20 border border-white/5 border-dashed rounded-3xl bg-white/[0.02]">
              <Bookmark size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 font-medium">{t('saved.empty')}</p>
              <p className="text-xs text-gray-600">{t('saved.emptyDesc')}</p>
          </div>
       ) : (
          <div className="columns-2 gap-4 space-y-4">
              {savedPosts.map(post => (
                <div key={post.id} className="glass-panel rounded-2xl overflow-hidden group cursor-pointer break-inside-avoid border border-white/5 relative hover:-translate-y-1 transition-transform duration-300">
                  <div className="relative overflow-hidden bg-gray-900 min-h-[120px]">
                      {post.image ? (
                        <img 
                          src={post.image} 
                          className="w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          alt=""
                        />
                      ) : post.video ? (
                         <div className="w-full h-40 bg-black flex items-center justify-center">
                            <span className="text-xs text-gray-500 font-mono">VIDEO CONTENT</span>
                         </div>
                      ) : (
                         <div className="p-6 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 h-full flex items-center justify-center">
                            <p className="text-xs text-gray-300 line-clamp-3 italic">"{post.content}"</p>
                         </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <div className="w-full flex justify-between items-center">
                            <span className="text-xs font-bold text-white">{t('saved.view')}</span>
                            <ArrowRight size={16} className="text-white" />
                          </div>
                      </div>
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); onRemove(post.id); }}
                        className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                         <Trash2 size={14} />
                      </button>
                  </div>
                  <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 rounded-full bg-gray-700 overflow-hidden">
                            <img src={post.user.avatar} alt="" />
                        </div>
                        <span className="text-xs text-gray-400 truncate">@{post.user.handle}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white leading-tight line-clamp-2">{post.content}</h4>
                      <p className="text-[10px] text-gray-500 mt-2">{post.timestamp}</p>
                  </div>
                </div>
              ))}
          </div>
       )}
    </div>
  );
};

export default SavedView;
