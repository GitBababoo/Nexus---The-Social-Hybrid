
import React, { useState, useRef, useEffect } from 'react';
import { Image, Send, X, Mic, Loader2, Link as LinkIcon, StopCircle, ScanEye, Trash2, FileImage, BarChart2, Quote, Smile, MapPin, Film, Gem, UploadCloud, Calendar, Clock, Search, Hash, Layers, PlayCircle, AtSign, Edit3, Sparkles } from 'lucide-react';
import { Poll, MediaAttachment, User } from '../types';
import { soundEngine } from '../services/soundService';
import { useTranslation } from 'react-i18next';
import { db } from '../services/db';
import MediaEditor from './MediaEditor';

interface CreatePostProps {
  onPost?: (data: { content: string; media?: MediaAttachment[]; quotedPostId?: string; poll?: Poll; linkPreview?: any; isMinted?: boolean; scheduledAt?: string }) => void;
  notify?: (type: 'success' | 'error' | 'info', msg: string) => void;
  quotingPost?: any;
  onClearQuote?: () => void;
  walletBalance?: number;
}

export interface LinkPreviewData {
  url: string;
  title: string;
  description: string;
  image: string;
  domain: string;
}

const EMOJIS = ["🔥", "😂", "❤️", "👍", "🚀", "✨", "🎉", "👀", "💯", "💀", "😭", "😍", "🤔", "🙌", "🤡", "💩"];
const SUGGESTED_TAGS = ["Nexus", "Crypto", "Art", "DeFi", "Gaming", "Cyberpunk", "Tech", "AI", "Metaverse", "DevLife", "Design", "Music", "Vibes"];

const MOCK_GIFS = [
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3R6bWJ6ZHg4dnpmdDV6eWx6bWJ6ZHg4dnpmdDV6eWx6bWJ6ZHg4ZHAmZXA9djFfaW50ZXJuYWxfZ2lmX2J5X2lkJmN0PWc/3o7TKSjRrfIPjeiVyM/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHc3OWJ6ZHg4dnpmdDV6eWx6bWJ6ZHg4dnpmdDV6eWx6bWJ6ZHg4ZHAmZXA9djFfaW50ZXJuYWxfZ2lmX2J5X2lkJmN0PWc/xT9IgG50Fb7Mi0prBC/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWc1NWJ6ZHg4dnpmdDV6eWx6bWJ6ZHg4dnpmdDV6eWx6bWJ6ZHg4ZHAmZXA9djFfaW50ZXJuYWxfZ2lmX2J5X2lkJmN0PWc/l0HlHFRb68qGNz6lq/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaG44M2J6ZHg4dnpmdDV6eWx6bWJ6ZHg4dnpmdDV6eWx6bWJ6ZHg4ZHAmZXA9djFfaW50ZXJuYWxfZ2lmX2J5X2lkJmN0PWc/3o6UB3VhArvomJHtdK/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExajJtM2J6ZHg4dnpmdDV6eWx6bWJ6ZHg4dnpmdDV6eWx6bWJ6ZHg4ZHAmZXA9djFfaW50ZXJuYWxfZ2lmX2J5X2lkJmN0PWc/l0HlO3BJ8LxrZ4T3q/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2s5MWJ6ZHg4dnpmdDV6eWx6bWJ6ZHg4dnpmdDV6eWx6bWJ6ZHg4ZHAmZXA9djFfaW50ZXJuYWxfZ2lmX2J5X2lkJmN0PWc/3o7abKhOpu0NwenH3O/giphy.gif"
];

interface UploadedFile {
    url: string;
    type: 'image' | 'video';
    name: string;
    size: string;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPost, notify, quotingPost, onClearQuote, walletBalance = 0 }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<UploadedFile[]>([]);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [location, setLocation] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const MINT_COST = 50;
  
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifSearch, setGifSearch] = useState('');
  
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);
  const [tagQuery, setTagQuery] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Editor State
  const [editingImage, setEditingImage] = useState<{ index: number; url: string } | null>(null);
  
  const dragCounter = useRef(0);
  const [pollOptions, setPollOptions] = useState(['', '']);

  const [linkPreview, setLinkPreview] = useState<LinkPreviewData | null>(null);
  const [isFetchingLink, setIsFetchingLink] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const linkTimeoutRef = useRef<any>(null);

  const MAX_CHARS = 280;
  const CHAR_WARNING = 240;

  useEffect(() => {
      setAllUsers(db.getAllUsers());
  }, []);

  useEffect(() => {
    if (quotingPost) {
      setIsExpanded(true);
      textareaRef.current?.focus();
    }
  }, [quotingPost]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node) && !content && mediaFiles.length === 0 && !quotingPost && !showPollCreator && !showScheduler) {
        setIsExpanded(false);
        setShowEmojiPicker(false);
        setShowGifPicker(false);
        setShowTagSuggestions(false);
        setShowUserSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [content, mediaFiles, quotingPost, showPollCreator, showScheduler]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      if(isExpanded) {
        textareaRef.current.style.height = Math.max(80, textareaRef.current.scrollHeight) + 'px';
      }
    }
  }, [content, isExpanded]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      const cursorPos = e.target.selectionStart;
      setContent(val);
      setCursorPosition(cursorPos);

      const textBeforeCursor = val.slice(0, cursorPos);
      
      // Tag Suggestion
      const tagMatch = textBeforeCursor.match(/#(\w*)$/);
      if (tagMatch) {
          setTagQuery(tagMatch[1]);
          setShowTagSuggestions(true);
          setShowUserSuggestions(false);
      } else {
          setShowTagSuggestions(false);
      }

      // User Mention Suggestion
      const userMatch = textBeforeCursor.match(/@(\w*)$/);
      if (userMatch) {
          setUserQuery(userMatch[1]);
          setShowUserSuggestions(true);
          setShowTagSuggestions(false);
      } else {
          setShowUserSuggestions(false);
      }
  };

  const insertTag = (tag: string) => {
      const textBeforeCursor = content.slice(0, cursorPosition);
      const textAfterCursor = content.slice(cursorPosition);
      
      const newTextBefore = textBeforeCursor.replace(/#(\w*)$/, `#${tag} `);
      const newContent = newTextBefore + textAfterCursor;
      
      setContent(newContent);
      setShowTagSuggestions(false);
      
      setTimeout(() => {
          if (textareaRef.current) {
              textareaRef.current.focus();
              const newPos = newTextBefore.length;
              textareaRef.current.setSelectionRange(newPos, newPos);
          }
      }, 0);
  };

  const insertMention = (handle: string) => {
      const textBeforeCursor = content.slice(0, cursorPosition);
      const textAfterCursor = content.slice(cursorPosition);
      
      const newTextBefore = textBeforeCursor.replace(/@(\w*)$/, `@${handle} `);
      const newContent = newTextBefore + textAfterCursor;
      
      setContent(newContent);
      setShowUserSuggestions(false);
      
      setTimeout(() => {
          if (textareaRef.current) {
              textareaRef.current.focus();
              const newPos = newTextBefore.length;
              textareaRef.current.setSelectionRange(newPos, newPos);
          }
      }, 0);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        notify?.('error', 'Voice dictation not supported.');
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
        }
        if (finalTranscript) setContent(prev => (prev ? prev + ' ' : '') + finalTranscript);
      };
      recognition.onerror = () => setIsListening(false);
      recognitionRef.current = recognition;
      recognition.start();
      notify?.('info', 'Listening...');
    }
  };

  useEffect(() => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = content.match(urlRegex);
    if (linkTimeoutRef.current) clearTimeout(linkTimeoutRef.current);

    if (match && match[0]) {
      const url = match[0];
      if (linkPreview?.url === url) return;
      setIsFetchingLink(true);
      linkTimeoutRef.current = window.setTimeout(() => {
        try {
          const urlObj = new URL(url);
          setLinkPreview({
            url: url,
            domain: urlObj.hostname,
            title: `Content from ${urlObj.hostname}`,
            description: "Automatically generated preview.",
            image: `https://picsum.photos/seed/${urlObj.hostname.length}/500/300`
          });
          soundEngine.playNotification();
        } catch (e) { /* ignore */ } finally { setIsFetchingLink(false); }
      }, 1000);
    } else {
      if (!match && (linkPreview || isFetchingLink)) {
        setLinkPreview(null);
        setIsFetchingLink(false);
      }
    }
    return () => { if (linkTimeoutRef.current) clearTimeout(linkTimeoutRef.current); };
  }, [content, linkPreview]);

  const handlePost = () => {
    if ((!content.trim() && mediaFiles.length === 0 && !quotingPost && !showPollCreator) || content.length > MAX_CHARS) return;
    
    if (isMinting && walletBalance < MINT_COST) {
        notify?.('error', `Insufficient funds. You need ${MINT_COST} NEX.`);
        return;
    }

    let pollData: Poll | undefined;
    const validOptions = pollOptions.filter(o => typeof o === 'string' && o.trim().length > 0);
    if (showPollCreator && validOptions.length >= 2) {
        pollData = {
            id: Date.now().toString(),
            question: "Poll", 
            options: validOptions.map((o, i) => ({ id: `opt-${i}`, text: o, votes: 0 })),
            endsAt: '24h',
            totalVotes: 0
        };
    }

    soundEngine.playSuccess();
    if (scheduledDate) notify?.('success', `${t('post.scheduledFor')} ${new Date(scheduledDate).toLocaleString()}`);

    const formattedMedia: MediaAttachment[] = mediaFiles.map(f => ({
        type: f.type,
        url: f.url
    }));

    onPost?.({ 
        content, 
        media: formattedMedia.length > 0 ? formattedMedia : undefined,
        quotedPostId: quotingPost?.id, 
        poll: pollData, 
        linkPreview: linkPreview,
        isMinted: isMinting,
        scheduledAt: scheduledDate || undefined
    });
    
    setContent('');
    setMediaFiles([]);
    setLinkPreview(null);
    setLocation(null);
    setIsExpanded(false);
    setShowPollCreator(false);
    setPollOptions(['', '']);
    setIsMinting(false);
    setScheduledDate('');
    setShowScheduler(false);
    onClearQuote?.();
  };

  const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault(); e.stopPropagation(); dragCounter.current++;
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault(); e.stopPropagation(); dragCounter.current--;
      if (dragCounter.current === 0) setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault(); e.stopPropagation(); setIsDragging(false); dragCounter.current = 0;
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          Array.from(e.dataTransfer.files).forEach(processFile);
      }
  };

  const processFile = (file: File) => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (!isImage && !isVideo) { notify?.('error', 'Only images and videos supported.'); return; }
      if (mediaFiles.length >= 6) { notify?.('error', 'Max 6 attachments allowed.'); return; }
      
      setIsProcessing(true);
      setIsExpanded(true);
      const reader = new FileReader();
      reader.onloadend = () => { 
          setMediaFiles(prev => [...prev, {
              url: reader.result as string,
              type: isImage ? 'image' : 'video',
              name: file.name,
              size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
          }]);
          setIsProcessing(false); 
      };
      reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        Array.from(e.target.files).forEach(processFile);
    }
  };

  const removeMedia = (index: number) => { 
      setMediaFiles(prev => prev.filter((_, i) => i !== index));
      if (fileInputRef.current) fileInputRef.current.value = ''; 
  };
  
  const insertEmoji = (emoji: string) => { setContent(prev => prev + emoji); textareaRef.current?.focus(); };
  const selectGif = (url: string) => { 
      setMediaFiles(prev => [...prev, { url, name: "GIF", size: "GIF", type: 'image' }]);
      setShowGifPicker(false); 
      setIsExpanded(true); 
  };
  const toggleLocation = () => { if (location) setLocation(null); else { setLocation("Neo Tokyo"); soundEngine.playClick(); } };

  // Media Editor Handling
  const handleEditMedia = (index: number) => {
      setEditingImage({ index, url: mediaFiles[index].url });
  };

  const handleEditorSave = (processedUrl: string) => {
      if (editingImage !== null) {
          setMediaFiles(prev => prev.map((item, i) => i === editingImage.index ? { ...item, url: processedUrl } : item));
          setEditingImage(null);
          soundEngine.playSuccess();
      }
  };

  const charCount = content.length;
  const isOverLimit = charCount > MAX_CHARS;
  const isNearLimit = charCount > CHAR_WARNING;
  const progressPercentage = Math.min(100, (charCount / MAX_CHARS) * 100);
  const progressColor = isOverLimit ? '#ef4444' : isNearLimit ? '#eab308' : '#6366f1';

  return (
    <>
    <div className="mb-10 relative z-20 group" ref={containerRef} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop} id="create-post-container">
      <div className={`absolute inset-0 z-50 bg-indigo-600/90 rounded-[32px] border-2 border-dashed border-white flex flex-col items-center justify-center backdrop-blur-sm transition-all duration-300 pointer-events-none ${isDragging ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <UploadCloud size={48} className="text-white mb-2 animate-bounce" /><h3 className="text-xl font-bold text-white">{t('post.drop')}</h3>
      </div>
      <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-[32px] blur-xl transition-opacity duration-500 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}></div>
      <div className={`glass-panel relative transition-all duration-300 ease-out overflow-visible ${isExpanded ? 'rounded-[32px] p-5 bg-[#1e293b]/90 border-white/10 shadow-2xl' : 'rounded-full p-2 cursor-text hover:bg-white/5 border-white/5'}`} onClick={() => !isExpanded && setIsExpanded(true)}>
        <div className="flex gap-4">
          <img src="https://picsum.photos/seed/me/100" className={`object-cover rounded-2xl transition-all ${isExpanded ? 'w-12 h-12 shadow-lg' : 'w-10 h-10'}`} alt="User" />
          <div className="flex-1 min-w-0 flex flex-col justify-center relative">
            {isExpanded ? (
              <textarea ref={textareaRef} value={content} onChange={handleTextChange} onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handlePost(); }} placeholder={quotingPost ? t('post.reply') : t('post.placeholder')} className="w-full bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none text-lg leading-relaxed min-h-[80px] font-light pr-10" autoFocus />
            ) : ( <p className="text-gray-500 font-medium truncate flex items-center gap-2"><span>{t('post.placeholder')}</span></p> )}
            
            {/* Smart Tag Suggestions */}
            {showTagSuggestions && (
                <div className="absolute top-full left-0 mt-2 bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl p-2 z-50 w-48 animate-in slide-in-from-top-2">
                    <div className="text-xs text-gray-500 font-bold px-2 py-1 uppercase">{t('post.suggestions')}</div>
                    {SUGGESTED_TAGS.filter(t => t.toLowerCase().includes(tagQuery.toLowerCase())).map(tag => (
                        <button key={tag} onClick={() => insertTag(tag)} className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg text-sm text-white flex items-center gap-2"><Hash size={14} className="text-indigo-400"/> {tag}</button>
                    ))}
                </div>
            )}

            {/* Smart User Mentions */}
            {showUserSuggestions && (
                <div className="absolute top-full left-0 mt-2 bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl p-2 z-50 w-64 animate-in slide-in-from-top-2 max-h-60 overflow-y-auto custom-scrollbar">
                    <div className="text-xs text-gray-500 font-bold px-2 py-1 uppercase">Mention</div>
                    {allUsers.filter(u => u.handle.toLowerCase().includes(userQuery.toLowerCase()) || u.name.toLowerCase().includes(userQuery.toLowerCase())).map(user => (
                        <button key={user.id} onClick={() => insertMention(user.handle)} className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg text-sm text-white flex items-center gap-2">
                            <img src={user.avatar} className="w-6 h-6 rounded-full" />
                            <div className="flex flex-col">
                                <span className="font-bold text-xs">{user.name}</span>
                                <span className="text-[10px] text-gray-400">@{user.handle}</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {isListening && (
               <div className="absolute right-2 top-2 flex gap-1 items-center bg-rose-500/20 px-2 py-1 rounded-full animate-pulse border border-rose-500/20">
                 <div className="w-1.5 h-4 bg-rose-500 rounded-full animate-[pulse_0.5s_ease-in-out_infinite]"></div><span className="text-[10px] font-bold text-rose-400">{t('post.rec')}</span>
               </div>
            )}
          </div>
          {!isExpanded && <div className="flex items-center gap-2 pr-2"><button className="p-2 text-indigo-400 bg-indigo-500/10 rounded-full hover:bg-indigo-500/20 transition-colors"><Image size={18} /></button></div>}
        </div>

        {isExpanded && (
          <div className="mt-4 animate-enter relative">
            {showPollCreator && (
                <div className="mb-4 p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/5 relative animate-in zoom-in-95">
                    <h4 className="text-xs font-bold text-indigo-300 uppercase mb-2 flex items-center gap-2"><BarChart2 size={14} /> {t('post.poll')}</h4>
                    <div className="space-y-2">
                        {pollOptions.map((opt, idx) => (
                            <input key={idx} type="text" value={opt} onChange={(e) => { const newOpts = [...pollOptions]; newOpts[idx] = e.target.value; setPollOptions(newOpts); }} placeholder={`Option ${idx + 1}`} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
                        ))}
                        {pollOptions.length < 5 && <button onClick={() => setPollOptions([...pollOptions, ''])} className="text-xs text-indigo-400 font-bold hover:underline">+ Add Option</button>}
                    </div>
                     <button onClick={() => setShowPollCreator(false)} className="absolute top-2 right-2 text-gray-500 hover:text-white p-1"><X size={14} /></button>
                </div>
            )}
            
            {showScheduler && (
                <div className="mb-4 p-4 rounded-xl border border-white/10 bg-white/5 relative animate-in zoom-in-95">
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2"><Calendar size={14} /> {t('post.schedule')}</h4>
                    <div className="flex gap-2"><input type="datetime-local" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none w-full" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} /></div>
                    {scheduledDate && <p className="text-xs text-indigo-300 mt-2">{t('post.scheduledFor')} {new Date(scheduledDate).toLocaleString()}</p>}
                    <button onClick={() => setShowScheduler(false)} className="absolute top-2 right-2 text-gray-500 hover:text-white p-1"><X size={14} /></button>
                </div>
            )}

            {quotingPost && (
              <div className="mb-4 p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/5 relative animate-in zoom-in-95">
                 <div className="flex gap-2 items-center text-xs text-indigo-300 mb-2 font-bold uppercase tracking-wider"><Quote size={12} /> {t('post.replyingTo')} {quotingPost.user.name}</div>
                 <div className="flex gap-3">
                    <img src={quotingPost.user.avatar} className="w-8 h-8 rounded-lg opacity-80" alt="" />
                    <div className="flex-1 min-w-0"><p className="text-sm text-gray-300 line-clamp-2 italic">"{quotingPost.content}"</p></div>
                 </div>
                 <button onClick={onClearQuote} className="absolute top-2 right-2 text-gray-500 hover:text-white p-1"><X size={14} /></button>
              </div>
            )}

            {location && <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold animate-in zoom-in-95"><MapPin size={12} /><span>{location}</span><button onClick={() => setLocation(null)} className="ml-1 hover:text-white"><X size={12}/></button></div>}
            {isFetchingLink && !linkPreview && <div className="mb-4 px-4 py-3 bg-white/5 rounded-xl flex items-center gap-3 border border-white/5 animate-pulse"><Loader2 size={16} className="text-indigo-400 animate-spin" /><span className="text-xs text-gray-400">Extracting link metadata...</span></div>}

            {mediaFiles.length === 0 && linkPreview && (
              <div className="mb-4 rounded-xl overflow-hidden border border-white/10 bg-[#050b14]/60 group relative shadow-xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
                 <div className="h-40 md:h-auto md:w-32 relative shrink-0 overflow-hidden bg-gray-900"><img src={linkPreview.image} alt="Link Preview" className="w-full h-full object-cover opacity-90"/></div>
                 <div className="p-3 relative flex flex-col justify-center flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[10px] text-indigo-300 mb-1.5 bg-indigo-500/10 inline-flex px-2 py-1 rounded border border-indigo-500/20 w-fit"><LinkIcon size={10} /><span className="truncate max-w-[150px] font-bold">{linkPreview.domain}</span></div>
                    <h4 className="font-bold text-white text-sm leading-tight mb-1 truncate">{linkPreview.title}</h4>
                    <p className="text-xs text-gray-400 line-clamp-2">{linkPreview.description}</p>
                 </div>
                 <button onClick={() => setLinkPreview(null)} className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full text-white hover:bg-rose-500 transition-colors"><X size={12} /></button>
              </div>
            )}

            {/* Mixed Media Preview Carousel */}
            {(mediaFiles.length > 0 || isProcessing) && (
              <div className="relative mb-4 p-3 rounded-2xl border border-white/10 bg-[#0f172a]/80 flex gap-4 overflow-x-auto custom-scrollbar animate-in zoom-in-95 items-start">
                 {mediaFiles.map((file, index) => (
                     <div key={index} className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-white/10 bg-black group/preview">
                        {file.type === 'image' ? (
                            <>
                                <img src={file.url} alt="Preview" className="w-full h-full object-cover" />
                                <button 
                                    onClick={() => handleEditMedia(index)}
                                    className="absolute bottom-1 right-1 p-1 bg-black/60 text-white rounded-md opacity-0 group-hover/preview:opacity-100 transition-opacity hover:bg-indigo-500"
                                >
                                    <Edit3 size={10} />
                                </button>
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                <video src={file.url} className="w-full h-full object-cover opacity-50" />
                                <PlayCircle size={24} className="absolute text-white" />
                            </div>
                        )}
                        <div className="absolute top-1 right-1 opacity-0 group-hover/preview:opacity-100 transition-opacity">
                            <button onClick={() => removeMedia(index)} className="p-1 bg-rose-500 rounded-full text-white hover:scale-110 transition-transform"><X size={10} /></button>
                        </div>
                        {index === 0 && <div className="absolute top-1 left-1 bg-indigo-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">COVER</div>}
                     </div>
                 ))}
                 
                 {isProcessing && (
                     <div className="w-24 h-24 shrink-0 rounded-xl border border-white/10 bg-black/50 flex items-center justify-center">
                         <Loader2 size={24} className="text-indigo-500 animate-spin" />
                     </div>
                 )}

                 {mediaFiles.length < 6 && (
                     <button onClick={() => fileInputRef.current?.click()} className="w-24 h-24 shrink-0 rounded-xl border-2 border-dashed border-white/10 hover:border-white/30 hover:bg-white/5 flex flex-col items-center justify-center text-gray-500 transition-colors">
                         <Layers size={20} className="mb-1" />
                         <span className="text-[10px] font-bold">Add More</span>
                     </button>
                 )}
              </div>
            )}

            {mediaFiles.length === 0 && !linkPreview && (
                <div className="mb-4 border border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center text-gray-500 hover:bg-white/5 hover:border-white/20 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="flex items-center gap-2 text-xs font-medium"><UploadCloud size={16} /><span>{t('post.drop')}</span></div>
                </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-white/5 relative">
              <div className="flex gap-1 items-center">
                <button onClick={() => fileInputRef.current?.click()} className="p-2.5 text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-colors group/btn relative" title="Upload Media"><Image size={20} /></button>
                <div className="relative">
                    <button onClick={() => setShowGifPicker(!showGifPicker)} className={`p-2.5 rounded-xl transition-colors ${showGifPicker ? 'bg-blue-500/20 text-white' : 'text-blue-400 hover:bg-blue-500/10'}`} title="GIF"><Film size={20} /></button>
                    {showGifPicker && (
                         <div className="absolute bottom-full left-0 mb-2 bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl p-2 w-64 z-50 animate-in zoom-in-95">
                             <div className="relative mb-2"><Search size={14} className="absolute left-2 top-2 text-gray-400"/><input type="text" placeholder="Search GIFs..." className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 pl-7 text-xs text-white focus:outline-none" value={gifSearch} onChange={(e) => setGifSearch(e.target.value)} /></div>
                             <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                                 {MOCK_GIFS.map((gif, i) => (<div key={i} className="aspect-video bg-black rounded overflow-hidden cursor-pointer hover:opacity-80" onClick={() => selectGif(gif)}><img src={gif} className="w-full h-full object-cover"/></div>))}
                             </div>
                         </div>
                    )}
                </div>
                
                <div className="relative">
                    <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2.5 text-yellow-400 hover:bg-yellow-500/10 rounded-xl transition-colors" title="Emoji"><Smile size={20} /></button>
                    {showEmojiPicker && (<div className="absolute bottom-full left-0 mb-2 bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl p-2 grid grid-cols-4 gap-1 w-48 z-50 animate-in zoom-in-95">{EMOJIS.map(e => (<button key={e} onClick={() => insertEmoji(e)} className="p-2 hover:bg-white/10 rounded text-xl">{e}</button>))}</div>)}
                </div>

                <button onClick={() => setShowPollCreator(!showPollCreator)} className={`p-2.5 rounded-xl transition-colors ${showPollCreator ? 'bg-blue-500/20 text-white' : 'text-cyan-400 hover:bg-cyan-500/10'}`} title="Create Poll"><BarChart2 size={20} /></button>
                <button onClick={toggleLocation} className={`p-2.5 rounded-xl transition-colors ${location ? 'text-green-400 bg-green-500/20' : 'text-emerald-400 hover:bg-emerald-500/10'}`} title="Location"><MapPin size={20} /></button>
                <button onClick={() => setShowScheduler(!showScheduler)} className={`p-2.5 rounded-xl transition-colors ${scheduledDate || showScheduler ? 'text-orange-400 bg-orange-500/10' : 'text-orange-400 hover:bg-orange-500/10'}`} title="Schedule"><Clock size={20} /></button>
                <button onClick={toggleListening} className={`p-2.5 rounded-xl transition-all duration-300 ${isListening ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 'text-pink-400 hover:bg-pink-500/10'}`} title="Voice Dictation">{isListening ? <StopCircle size={20} className="animate-pulse" /> : <Mic size={20} />}</button>
              </div>

              <div className="flex items-center gap-4">
                <div onClick={() => setIsMinting(!isMinting)} className={`flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg border transition-all ${isMinting ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400' : 'border-transparent hover:bg-white/5 text-gray-500'}`} title={`Mint this post as an NFT (${MINT_COST} NEX)`}>
                    <Gem size={16} className={isMinting ? 'animate-pulse' : ''} />
                    <span className="text-xs font-bold hidden sm:inline">{isMinting ? `${MINT_COST} NEX` : t('post.mint')}</span>
                </div>
                <div className="relative flex items-center justify-center w-8 h-8 hidden sm:flex">
                     <svg className="w-full h-full transform -rotate-90"><circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-gray-700" /><circle cx="16" cy="16" r="12" stroke={progressColor} strokeWidth="2" fill="transparent" strokeDasharray={75.36} strokeDashoffset={75.36 - (progressPercentage / 100) * 75.36} className="transition-all duration-300" /></svg>
                     {isNearLimit && <span className={`absolute text-[8px] font-bold ${isOverLimit ? 'text-rose-500' : 'text-gray-400'}`}>{MAX_CHARS - charCount}</span>}
                </div>
                <button onClick={handlePost} disabled={(!content && mediaFiles.length === 0 && !quotingPost && !showPollCreator) || content.length > MAX_CHARS} className="bg-white text-black hover:scale-105 px-6 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  {scheduledDate ? t('post.schedule') : t('post.button')} {scheduledDate ? <Calendar size={16} className="ml-0.5" /> : <Send size={16} className="ml-0.5" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <input type="file" hidden ref={fileInputRef} accept="image/*,video/*" multiple onChange={handleFileSelect} />
    </div>
    
    {/* Media Editor Modal */}
    {editingImage && (
        <MediaEditor 
            imageUrl={editingImage.url} 
            onSave={handleEditorSave} 
            onCancel={() => setEditingImage(null)} 
        />
    )}
    </>
  );
};

export default CreatePost;
