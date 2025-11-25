
import React, { useState, useEffect } from 'react';
import { Event } from '../types';
import { Calendar, MapPin, Users, Star, ArrowRight } from 'lucide-react';
import { db } from '../services/db';
import { soundEngine } from '../services/soundService';
import { useTranslation } from 'react-i18next';

interface EventsViewProps { searchTerm?: string; }

const EventsView: React.FC<EventsViewProps> = ({ searchTerm = '' }) => {
    const { t } = useTranslation();
    const [events, setEvents] = useState<Event[]>([]);
    
    useEffect(() => {
        setEvents(db.getEvents());
        const interval = setInterval(() => setEvents(db.getEvents()), 2000);
        return () => clearInterval(interval);
    }, []);

    const toggleInterest = (id: string) => {
        const updated = db.toggleEventInterest(id);
        const event = updated.find(e => e.id === id);
        if (event?.isInterested) soundEngine.playSuccess(); else soundEngine.playClick();
        setEvents(updated);
    };

    const filtered = events.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="animate-enter pb-24">
             <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white font-display flex items-center gap-3">
                        <Calendar size={32} className="text-indigo-400" />
                        {t('events.title')}
                    </h2>
                    <p className="text-gray-400 mt-1">{t('events.subtitle')}</p>
                </div>
             </div>

             {/* Categories */}
             <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8 pb-2">
                {['all', 'social', 'gaming', 'tech', 'music', 'education'].map(cat => (
                    <button key={cat} className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap capitalize">
                        {t(`events.cat.${cat}` as any)}
                    </button>
                ))}
             </div>

             <div className="space-y-6">
                 {filtered.map((event, idx) => (
                     <div key={event.id} className="glass-panel rounded-3xl overflow-hidden group border border-white/5 hover:border-indigo-500/30 transition-all">
                         <div className="relative h-48 overflow-hidden">
                             <img src={event.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                             <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-bold border border-white/10">
                                 {event.category}
                             </div>
                             <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                                 <h3 className="text-2xl font-bold text-white">{event.title}</h3>
                             </div>
                         </div>
                         <div className="p-6">
                             <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
                                 <div className="flex items-center gap-3 text-gray-300">
                                     <div className="p-2 bg-white/5 rounded-lg"><Calendar size={20} className="text-indigo-400"/></div>
                                     <span className="text-sm font-medium">{event.date}</span>
                                 </div>
                                 <div className="flex items-center gap-3 text-gray-300">
                                     <div className="p-2 bg-white/5 rounded-lg"><MapPin size={20} className="text-rose-400"/></div>
                                     <span className="text-sm font-medium">{event.location}</span>
                                 </div>
                                 <div className="flex items-center gap-3 text-gray-300">
                                     <div className="p-2 bg-white/5 rounded-lg"><Users size={20} className="text-green-400"/></div>
                                     <span className="text-sm font-medium">{event.attendees} {t('events.going')}</span>
                                 </div>
                             </div>
                             
                             <p className="text-gray-400 text-sm mb-6 leading-relaxed">{event.description}</p>
                             
                             <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                 <div className="flex items-center gap-2">
                                     <span className="text-xs text-gray-500">{t('events.hostedBy')}</span>
                                     <span className="text-sm font-bold text-white">@{event.host.handle}</span>
                                 </div>
                                 <div className="flex gap-3">
                                      <button 
                                        onClick={() => toggleInterest(event.id)}
                                        className={`px-4 py-2 rounded-xl border text-sm font-bold transition-colors ${event.isInterested ? 'bg-indigo-600 text-white border-indigo-600' : 'border-white/10 text-white hover:bg-white/5'}`}
                                      >
                                          {event.isInterested ? t('events.interested') : t('events.interested') + '?'}
                                      </button>
                                      <button className="px-6 py-2 rounded-xl bg-white text-black hover:scale-105 text-sm font-bold transition-transform shadow-lg flex items-center gap-2">
                                          {t('events.join')} <ArrowRight size={16} />
                                      </button>
                                 </div>
                             </div>
                         </div>
                     </div>
                 ))}
             </div>
        </div>
    );
};

export default EventsView;
