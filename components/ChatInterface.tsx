import React, { useState, useRef, useEffect } from 'react';
import { ChatContact, ChatMessage } from '../types';
import { Search, Phone, Video, Send, Smile, ArrowLeft, MessageSquarePlus, CheckCheck, ChevronLeft, Plus, SidebarClose, SidebarOpen, Info, Image as ImageIcon, Mic, X, Sparkles } from 'lucide-react';
import { db } from '../services/db';
import { useTranslation } from 'react-i18next';
import { soundEngine } from '../services/soundService';

interface ChatInterfaceProps { 
    onBack?: () => void; 
    onVideoCall?: (user: any) => void; 
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onBack, onVideoCall }) => {
  const { t } = useTranslation();
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Load Contacts
  useEffect(() => {
      const realContacts = db.getContacts();
      const aiContact: ChatContact = {
          id: 'nexus_ai',
          user: db.getAllUsers().find(u => u.id === 'nexus_ai') || { id:'nexus_ai', name:'Nexus AI', handle:'gemini', avatar:'', roles:['admin'], hasCompletedOnboarding:true},
          lastMessage: 'System Online.',
          unread: 0
      };
      setContacts([aiContact, ...realContacts]);
  }, []);

  // Load History
  useEffect(() => {
    if (activeContactId) {
        setMessages(db.getChatHistory(activeContactId));
        setMobileView('chat');
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } else {
        setMobileView('list');
    }
  }, [activeContactId]);

  // Auto-scroll
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() && !fileInputRef.current?.files?.length) return;
    if (!activeContactId) return;
    
    soundEngine.playClick();
    
    const userMsg: ChatMessage = { 
        id: Date.now().toString(), senderId: 'me', text: newMessage, 
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), 
        isMe: true, read: false
    };
    
    setMessages(prev => [...prev, userMsg]);
    db.saveMessage(activeContactId, userMsg);
    setNewMessage('');

    // AI Response (Now Simulated)
    if (activeContactId === 'nexus_ai') {
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            const replies = [
                "My core functions are operating within normal parameters.",
                "Query processed. Result: affirmative.",
                "I am a simulated intelligence. My connection to the global network has been severed.",
                "Your request has been logged.",
                "Analyzing... Please stand by."
            ];
            const reply = replies[Math.floor(Math.random() * replies.length)];
            const botMsg: ChatMessage = { 
                id: (Date.now()+1).toString(), senderId: 'nexus_ai', text: reply, 
                timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), 
                isMe: false, read: true
            };
            setMessages(prev => [...prev, botMsg]);
            db.saveMessage(activeContactId, botMsg);
            soundEngine.playNotification();
        }, 1500); // Simulate thinking
    } else {
        // Simulated Human Response
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            const replies = ["Interesting...", "Can you send more info?", "Haha totally!", "Busy rn, brb.", "Nexus 4 life!"];
            const reply = replies[Math.floor(Math.random() * replies.length)];
            const humanMsg: ChatMessage = {
                id: Date.now().toString(), senderId: activeContactId, text: reply,
                timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                isMe: false, read: true
            };
            if (activeContactId === activeContactId) setMessages(prev => [...prev, humanMsg]);
            db.saveMessage(activeContactId, humanMsg);
            soundEngine.playNotification();
        }, 3000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && activeContactId) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const imgMsg: ChatMessage = {
                  id: Date.now().toString(), senderId: 'me', text: '', type: 'image', mediaUrl: reader.result as string,
                  timestamp: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}), isMe: true
              };
              setMessages(prev => [...prev, imgMsg]);
              db.saveMessage(activeContactId, imgMsg);
          };
          reader.readAsDataURL(file);
      }
  };

  const activeContact = contacts.find(c => c.id === activeContactId);

  return (
    <div className="flex h-full w-full bg-[#0b0e14] overflow-hidden absolute inset-0 text-gray-100">
        {/* Sidebar */}
        <div className={`flex flex-col h-full bg-[#0f1219] border-r border-white/5 transition-all absolute md:relative z-20 ${mobileView === 'list' ? 'w-full' : 'w-0 opacity-0 md:w-80 md:opacity-100'}`}>
            <div className="h-16 px-4 flex items-center justify-between border-b border-white/5">
                <button onClick={onBack}><ArrowLeft className="text-gray-400"/></button>
                <h2 className="font-bold">{t('chat.title')}</h2>
                <button><MessageSquarePlus className="text-indigo-500"/></button>
            </div>
            <div className="p-2 overflow-y-auto flex-1">
                {contacts.map(c => (
                    <div key={c.id} onClick={() => setActiveContactId(c.id)} className={`p-3 flex gap-3 rounded-xl cursor-pointer ${activeContactId === c.id ? 'bg-indigo-600/20' : 'hover:bg-white/5'}`}>
                        <img src={c.user.avatar} className="w-12 h-12 rounded-full bg-gray-800 object-cover" />
                        <div>
                            <h4 className="font-bold text-sm">{c.user.name}</h4>
                            <p className="text-xs text-gray-500 truncate w-40">{c.lastMessage}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col bg-[#0b0e14] relative transition-transform ${mobileView === 'chat' ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
            {activeContact ? (
                <>
                    <div className="h-16 border-b border-white/5 flex items-center justify-between px-4 bg-[#0b0e14]/90 backdrop-blur z-10">
                        <div className="flex items-center gap-3">
                            <button className="md:hidden" onClick={() => setMobileView('list')}><ChevronLeft/></button>
                            <img src={activeContact.user.avatar} className="w-9 h-9 rounded-full"/>
                            <div>
                                <h3 className="font-bold text-sm">{activeContact.user.name}</h3>
                                <p className="text-[10px] text-green-400">Online</p>
                            </div>
                        </div>
                        <div className="flex gap-4 text-gray-400">
                            <Phone size={20} className="cursor-pointer hover:text-white" onClick={() => onVideoCall?.(activeContact.user)}/>
                            <Video size={20} className="cursor-pointer hover:text-white" onClick={() => onVideoCall?.(activeContact.user)}/>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map(m => (
                            <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${m.isMe ? 'bg-indigo-600' : 'bg-[#1e222b]'}`}>
                                    {m.type === 'image' ? <img src={m.mediaUrl} className="rounded-lg max-h-60"/> : <p>{m.text}</p>}
                                    <span className="text-[10px] opacity-50 block text-right mt-1">{m.timestamp}</span>
                                </div>
                            </div>
                        ))}
                        {isTyping && <div className="text-xs text-gray-500 ml-4 animate-pulse">Typing...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} className="p-3 border-t border-white/5 flex gap-2 items-center bg-[#0b0e14]">
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-400 hover:text-white"><ImageIcon size={20}/></button>
                        <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileUpload} />
                        <input value={newMessage} onChange={e => setNewMessage(e.target.value)} className="flex-1 bg-[#1a1d24] rounded-full px-4 py-2 text-white focus:outline-none" placeholder="Message..." />
                        <button type="submit" className="p-2 bg-indigo-600 rounded-full text-white"><Send size={18}/></button>
                    </form>
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">Select a chat</div>
            )}
        </div>
    </div>
  );
};

export default ChatInterface;