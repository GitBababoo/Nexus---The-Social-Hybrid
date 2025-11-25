
import React, { useState, memo, useCallback, useEffect, useRef } from 'react';
import { Post, Comment, ReactionType, MediaAttachment } from '../types';
import { Heart, MessageCircle, Share2, MoreHorizontal, BadgeCheck, Bookmark, Link as LinkIcon, X, Quote, Play, Volume2, EyeOff, Code, Gem } from 'lucide-react';
import { LinkPreviewData } from './CreatePost';
import { soundEngine } from '../services/soundService';
import { useTranslation } from 'react-i18next';
import SmartImage from './SmartImage'; 

interface PostCardProps {
  post: Post;
  onUserClick?: (user: Post['user']) => void;
  notify?: (type: 'success' | 'error' | 'info', msg: string) => void;
  onQuote?: (post: Post) => void;
  onShareToStory?: (post: Post) => void;
  onHidePost?: (postId: string) => void;
  onBlockUser?: (userId: string) => void; 
  isSaved?: boolean;
  isBlurEnabled?: boolean;
  onToggleSave?: () => void;
  onInteraction?: (type: 'like' | 'comment' | 'share' | 'vote') => void;
  onTagClick?: (tag: string) => void;
}

// Optimized: React.memo prevents this heavy component from re-rendering 
// if the parent changes but the post data stays the same.
const PostCard: React.FC<PostCardProps> = memo(({ post, onUserClick, onQuote, onShareToStory, isSaved, isBlurEnabled, onToggleSave, onInteraction, onTagClick }) => {
  const { t } = useTranslation();
  
  // Local state for immediate UI feedback (Optimistic UI)
  const [likes, setLikes] = useState(post.likes);
  const [currentReaction, setCurrentReaction] = useState<ReactionType | null>(post.userReaction || null);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const menuRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sync state if store updates externally
  useEffect(() => {
      setLikes(post.likes);
      setCurrentReaction(post.userReaction || null);
  }, [post.likes, post.userReaction]);

  const linkPreview = (post as any).linkPreview as LinkPreviewData | undefined;
  const isMinted = post.status?.isMinted;
  const MAX_CONTENT_LENGTH = 280;
  const content = post.content || "";
  const isLongContent = content.length > MAX_CONTENT_LENGTH;

  const mediaSlides: MediaAttachment[] = post.media || [];
  if (mediaSlides.length === 0) {
      if (post.images) post.images.forEach(url => mediaSlides.push({ type: 'image', url }));
      else if (post.image) mediaSlides.push({ type: 'image', url: post.image });
      if (post.video) mediaSlides.push({ type: 'video', url: post.video });
  }

  // Logic: Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setShowMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Logic: Smart Video Autoplay via Intersection Observer
  useEffect(() => {
    if (!videoRef.current) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting && !isBlurEnabled) {
                videoRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
            } else {
                videoRef.current?.pause();
                setIsPlaying(false);
            }
        });
    }, { threshold: 0.6 });
    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [isBlurEnabled, currentSlideIndex]); 

  const handleReaction = () => {
    soundEngine.playClick();
    onInteraction?.('like');
    // Optimistic update local state
    if (currentReaction) {
        setLikes(l => l - 1);
        setCurrentReaction(null);
    } else {
        setLikes(l => l + 1);
        setCurrentReaction('like');
        if (navigator.vibrate) navigator.vibrate(10);
    }
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
      e.stopPropagation(); e.preventDefault(); 
      setShowHeartOverlay(true); 
      setTimeout(() => setShowHeartOverlay(false), 800);
      soundEngine.playSuccess();
      if (!currentReaction) handleReaction();
  };

  const renderContent = useCallback(() => {
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const parts = content.split(codeBlockRegex);
    const matches = content.match(codeBlockRegex);

    if (!matches) {
        const textToRender = isContentExpanded || !isLongContent ? content : content.slice(0, MAX_CONTENT_LENGTH) + '...';
        return (
            <p className="text-gray-200 text-[15px] leading-relaxed whitespace-pre-wrap font-normal tracking-wide break-words inline">
                {textToRender.split(/(\s+)/).map((part, i) => {
                    if (part.startsWith('#')) return <span key={i} onClick={(e) => { e.stopPropagation(); onTagClick?.(part.replace('#','')); }} className="text-indigo-400 font-medium hover:underline cursor-pointer">{part}</span>;
                    if (part.startsWith('@')) return <span key={i} className="text-pink-400 font-medium hover:underline cursor-pointer">{part}</span>;
                    return part;
                })}
                {isLongContent && !isContentExpanded && (
                    <button onClick={(e) => { e.stopPropagation(); setIsContentExpanded(true); }} className="ml-1 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider">See more</button>
                )}
            </p>
        );
    }
    return (
        <div className="space-y-2">
            {parts.map((part, i) => {
                if (i % 2 === 1) { 
                    return (
                        <div key={i} className="my-3 rounded-lg overflow-hidden bg-[#0a0f1c] border border-white/5 shadow-inner">
                            <div className="bg-white/5 px-4 py-1.5 flex justify-between items-center border-b border-white/5">
                                <span className="text-[10px] text-gray-500 font-mono font-bold uppercase flex items-center gap-1"><Code size={10}/> Code Snippet</span>
                                <button className="text-[10px] text-indigo-400 hover:text-indigo-300" onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(part.trim()); }}>Copy</button>
                            </div>
                            <pre className="p-4 overflow-x-auto custom-scrollbar text-sm font-mono text-green-300">{part.trim()}</pre>
                        </div>
                    )
                }
                return <p key={i} className="text-gray-200">{part}</p>;
            })}
        </div>
    )
  }, [content, isContentExpanded, isLongContent, onTagClick]);

  const shouldBlur = isBlurEnabled && !isRevealed;

  return (
    <div className={`glass-panel rounded-[24px] md:rounded-[32px] mb-6 overflow-visible border hover:bg-white/[0.03] transition-all duration-500 ease-out relative group/card ${isMinted ? 'border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.05)]' : 'border-white/5 shadow-sm'}`}>
      {isMinted && <div className="absolute -top-3 -right-3 z-10 bg-gradient-to-br from-yellow-400 to-orange-500 text-black font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 text-xs animate-bounce"><Gem size={12} fill="black" /> {t('post.rare')}</div>}
      
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-3 items-center cursor-pointer group" onClick={() => onUserClick?.(post.user)}>
             <div className="relative">
                 <SmartImage src={post.user.avatar} alt={post.user.name} className={`w-10 h-10 md:w-12 md:h-12 rounded-full md:rounded-2xl bg-gray-800 ring-2 ring-transparent transition-all ${isMinted ? 'ring-yellow-500/50' : 'group-hover:ring-white/10'}`} />
                 <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#050b14] rounded-full flex items-center justify-center"><div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div></div>
             </div>
             <div className="leading-tight min-w-0">
                <div className="flex items-center gap-1.5"><h3 className={`font-bold text-[15px] md:text-[16px] truncate transition-colors ${isMinted ? 'text-yellow-400' : 'text-white group-hover:text-indigo-300'}`}>{post.user.name}</h3>{post.user.isVerified && <BadgeCheck size={16} className="text-indigo-500 fill-indigo-500/10 shrink-0" />}</div>
                <div className="flex items-center gap-2 mt-0.5"><p className="text-gray-500 text-xs flex items-center gap-1 truncate">@{post.user.handle} • {post.timestamp}</p></div>
             </div>
          </div>
          
          {/* Menu */}
          <div className="relative" ref={menuRef}>
            <button onClick={() => setShowMenu(!showMenu)} className={`text-gray-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5 ${showMenu ? 'bg-white/10 text-white' : ''}`}><MoreHorizontal size={20} /></button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 flex flex-col py-1.5 ring-1 ring-black/5">
                 <button onClick={() => { onShareToStory?.(post); setShowMenu(false); }} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-200 hover:bg-white/5 transition-colors w-full group"><div className="w-5 h-5 rounded-full border-2 border-indigo-400 group-hover:scale-110 transition-transform"></div>{t('post.shareStory')}</button>
                 <button onClick={() => { onQuote?.(post); setShowMenu(false); }} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-200 hover:bg-white/5 transition-colors w-full group"><Quote size={16} className="text-gray-400 group-hover:text-white" /> {t('post.quotePost')}</button>
                 <button onClick={() => { onToggleSave?.(); setShowMenu(false); }} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-200 hover:bg-white/5 transition-colors w-full group"><Bookmark size={16} className={isSaved ? "text-indigo-400 fill-indigo-400" : "text-gray-400"} />{isSaved ? t('post.unsave') : t('post.save')}</button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
           {renderContent()}
        </div>
        
        {/* Link Preview */}
        {linkPreview && (
             <div className="mb-5 rounded-xl overflow-hidden border border-white/5 bg-[#0a0f1c] group relative shadow-md hover:shadow-lg transition-all cursor-pointer">
                 <div className="h-40 md:h-auto md:w-36 relative shrink-0 overflow-hidden bg-gray-900"><SmartImage src={linkPreview.image} alt="Link" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"/></div>
                 <div className="p-4 relative flex flex-col justify-center flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[10px] text-indigo-300 mb-2 uppercase tracking-widest font-bold"><LinkIcon size={10} /><span className="truncate">{linkPreview.domain}</span></div>
                    <h4 className="font-bold text-white text-base leading-tight mb-2 line-clamp-1">{linkPreview.title}</h4>
                 </div>
              </div>
        )}
        
        {/* Media */}
        <div className="relative mb-5 group cursor-pointer" onDoubleClick={handleDoubleTap} onMouseEnter={() => soundEngine.playHover()}>
             {showHeartOverlay && <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"><Heart size={100} className="text-white fill-white animate-pop drop-shadow-2xl" /></div>}
             {shouldBlur && <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/50 backdrop-blur-md rounded-3xl cursor-pointer transition-opacity duration-300" onClick={() => setIsRevealed(true)}><EyeOff size={48} className="text-gray-400 mb-2" /><p className="text-white font-bold">{t('post.sensitive')}</p></div>}

            {mediaSlides.length > 0 && (
                 <div className={`relative rounded-3xl overflow-hidden border border-white/5 bg-gray-900 group/img transition-all duration-500 ${shouldBlur ? 'blur-xl scale-95 opacity-50' : ''}`}>
                    <div className="relative w-full h-full min-h-[300px] max-h-[600px] flex items-center justify-center bg-black">
                        {mediaSlides[currentSlideIndex].type === 'video' ? (
                             <div className="w-full h-full flex items-center justify-center" onClick={(e) => { e.stopPropagation(); if(videoRef.current) { if(isPlaying) videoRef.current.pause(); else videoRef.current.play(); setIsPlaying(!isPlaying); } }}>
                                 <video ref={videoRef} src={mediaSlides[currentSlideIndex].url} className="w-full h-full object-contain max-h-[600px]" loop muted={isMuted} playsInline />
                                 {!isPlaying && !shouldBlur && <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]"><Play size={48} className="text-white fill-white opacity-80" /></div>}
                                 <button onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} className="absolute bottom-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-white/20 transition-colors z-20"><Volume2 size={20} /></button>
                             </div>
                        ) : (
                            <SmartImage src={mediaSlides[currentSlideIndex].url} alt="Post" className="w-full h-auto object-cover max-h-[600px] cursor-zoom-in" onClick={() => setLightboxImage(mediaSlides[currentSlideIndex].url)} />
                        )}
                    </div>
                 </div>
            )}
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between px-2">
            <div className="flex gap-6">
                <button onClick={handleReaction} className={`flex items-center gap-2 group transition-all ${currentReaction ? 'text-rose-500' : 'text-gray-400 hover:text-rose-400'}`}><div className={`p-2 rounded-full group-hover:bg-rose-500/10 transition-colors relative ${currentReaction ? 'animate-pop' : ''}`}><Heart size={22} className={currentReaction ? 'fill-current' : ''} /></div><span className={`text-sm font-bold ${currentReaction ? 'text-rose-500' : ''}`}>{likes}</span></button>
                <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 group text-gray-400 hover:text-indigo-400 transition-all"><div className="p-2 rounded-full group-hover:bg-indigo-500/10 transition-colors"><MessageCircle size={22} /></div><span className="text-sm font-bold">{post.commentsCount}</span></button>
                <button className={`flex items-center gap-2 group transition-all text-gray-400 hover:text-green-400`}><div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors"><Share2 size={22} /></div><span className="text-sm font-bold">{post.shares}</span></button>
            </div>
            <button onClick={onToggleSave} className={`text-gray-400 hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-white/5 ${isSaved ? 'text-indigo-400' : ''}`}><Bookmark size={22} className={isSaved ? 'fill-current' : ''} /></button>
        </div>

        {/* Comments (Simplified for View) */}
        {showComments && (
            <div className="mt-4 pt-4 border-t border-white/5 animate-in slide-in-from-top-2">
                 <p className="text-center text-gray-500 text-sm py-2">View detailed comments in full post view.</p>
            </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center animate-in fade-in duration-300" onClick={() => setLightboxImage(null)}>
            <button className="absolute top-4 right-4 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors z-[101]"><X size={24} /></button>
            <img src={lightboxImage} className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-lg cursor-zoom-out" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
});

export default PostCard;
