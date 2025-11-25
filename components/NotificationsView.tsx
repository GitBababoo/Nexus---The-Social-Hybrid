
import React, { useState, useEffect } from 'react';
import { Heart, UserPlus, Star, Zap, AtSign, MessageSquare, CheckCircle, Calendar, DollarSign } from 'lucide-react';
import { db } from '../services/db';
import { Notification } from '../types';
import { useTranslation } from 'react-i18next';

const NotificationsView: React.FC = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'mentions' | 'system'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Periodically refresh notifications to catch new ones
  useEffect(() => {
      setNotifications(db.getNotifications());
      const interval = setInterval(() => {
          setNotifications(db.getNotifications());
      }, 3000);
      return () => clearInterval(interval);
  }, []);

  const markAllRead = () => {
      setNotifications(db.markAllRead());
  };

  const handleNotificationClick = (id: string) => {
      setNotifications(db.markRead(id));
  };

  const filtered = notifications.filter(n => filter === 'all' || n.category === filter || (filter === 'mentions' && n.type === 'reply'));
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
      switch(type) {
          case 'like': return { icon: Heart, color: 'text-pink-500', bg: 'bg-pink-500/10' };
          case 'follow': return { icon: UserPlus, color: 'text-indigo-500', bg: 'bg-indigo-500/10' };
          case 'mention': return { icon: AtSign, color: 'text-blue-400', bg: 'bg-blue-500/10' };
          case 'reply': return { icon: MessageSquare, color: 'text-green-400', bg: 'bg-green-500/10' };
          case 'event': return { icon: Calendar, color: 'text-orange-400', bg: 'bg-orange-500/10' };
          case 'star': return { icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
          case 'system': return { icon: Zap, color: 'text-rose-400', bg: 'bg-rose-500/10' };
          default: return { icon: Zap, color: 'text-white', bg: 'bg-white/10' };
      }
  };

  return (
    <div className="animate-enter mt-2 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 px-2 gap-4">
        <div>
            <h2 className="text-2xl font-bold text-white font-display flex items-center gap-3">
                {t('notif.title')}
                {unreadCount > 0 && <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount} {t('notif.new')}</span>}
            </h2>
        </div>
        
        <div className="flex gap-2">
            <div className="flex bg-white/5 rounded-lg p-1 gap-1">
            {['all', 'mentions', 'system'].map((f) => (
                <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filter === f ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                {t(`notif.${f}`)}
                </button>
            ))}
            </div>
            {unreadCount > 0 && (
                <button 
                    onClick={markAllRead}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-xs font-bold transition-colors border border-white/5"
                >
                    <CheckCircle size={14} /> {t('notif.markRead')}
                </button>
            )}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p>{t('notif.empty')}</p>
          </div>
        ) : (
          filtered.map((notif, i) => {
            const { icon: Icon, color, bg } = getIcon(notif.type);
            return (
                <div 
                key={notif.id} 
                onClick={() => handleNotificationClick(notif.id)}
                className={`glass-panel rounded-2xl p-4 flex items-center gap-4 transition-all cursor-pointer border border-white/5 animate-enter hover:scale-[1.01] ${!notif.read ? 'bg-white/[0.03] border-indigo-500/30' : 'hover:bg-white/5'}`}
                style={{ animationDelay: `${i * 50}ms` }}
                >
                <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center ${bg} relative`}>
                    <Icon size={20} className={color} fill={notif.type === 'like' || notif.type === 'star' ? 'currentColor' : 'none'} />
                    {notif.type === 'system' && <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full border-2 border-[#0f172a]"></span>}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 truncate">
                        <span className="font-bold text-white hover:underline">{notif.user}</span> {notif.text}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 font-medium">{notif.time}</p>
                </div>
                {!notif.read && (
                    <div className="w-2 h-2 bg-indigo-400 rounded-full shadow-[0_0_10px_#818cf8]"></div>
                )}
                </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationsView;
