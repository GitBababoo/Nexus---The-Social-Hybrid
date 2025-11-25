import React, { useState, useEffect } from 'react';
import { AppSettings, SupportedLanguage, User } from '../types';
import { 
  Monitor, Volume2, Eye, Shield, Bell, Smartphone, HelpCircle, 
  LogOut, Sun, EyeOff, Palette, ChevronRight, ArrowLeft, 
  Globe, Wallet, Lock, Users, Activity, Mic, 
  Wifi, VolumeX, SmartphoneCharging,
  MessageSquare, UserX, Trash2, Key, History, Download,
  Music, Camera, AlertOctagon, UserPlus, CreditCard,
  Languages, Radio, Layers, HardDrive, WifiOff,
  Speaker, Sliders, Cast, Fingerprint, FileCode,
  CheckCircle, Moon, Zap, Type
} from 'lucide-react';
import { soundEngine } from '../services/soundService';
import { useTranslation } from 'react-i18next';
import { db } from '../services/db';

interface SettingsViewProps {
  settings: AppSettings;
  updateSettings: (key: keyof AppSettings, value: any) => void;
}

type SettingsPage = 
  | 'main' 
  | 'account' | 'privacy' | 'security' | 'sessions'
  | 'language' | 'appearance' | 'accessibility' 
  | 'notifications' | 'media' 
  | 'wallet' 
  | 'about' | 'blocked_list' | 'activity_log';

const SettingsView: React.FC<SettingsViewProps> = ({ settings, updateSettings }) => {
  const { t, i18n } = useTranslation();
  const [page, setPage] = useState<SettingsPage>('main');
  const [history, setHistory] = useState<SettingsPage[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
      setAllUsers(db.getAllUsers());
  }, []);

  const handleLanguageChange = (lang: string) => {
      updateSettings('language', lang);
      // Optimistic update to ensure UI reflects change instantly
      i18n.changeLanguage(lang);
      soundEngine.playSuccess();
  };

  const navigateTo = (p: SettingsPage) => {
    soundEngine.playClick();
    setHistory([...history, page]);
    setPage(p);
  };

  const handleBack = () => {
    soundEngine.playClick();
    const newHistory = [...history];
    const prev = newHistory.pop();
    setHistory(newHistory);
    setPage(prev || 'main');
  };

  const handleExportData = () => {
      const dataStr = db.exportUserData();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nexus_data_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      soundEngine.playSuccess();
  };

  // --- UI COMPONENTS ---
  const SectionTitle = ({ title }: { title: string }) => (
    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 mt-6 px-4">{title}</h3>
  );

  const ToggleItem = ({ label, desc, checked, onChange, icon: Icon, color = 'text-gray-400' }: { label: string, desc?: string, checked: boolean, onChange: (val: boolean) => void, icon?: any, color?: string }) => (
    <div 
        className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border-b border-white/5 last:border-0 first:rounded-t-xl last:rounded-b-xl" 
        onClick={() => { onChange(!checked); soundEngine.playClick(); }}
    >
      <div className="flex items-center gap-4">
        {Icon && <div className={`p-2 rounded-lg bg-white/5 ${color}`}><Icon size={18} /></div>}
        <div>
            <h4 className="font-bold text-white text-sm">{label}</h4>
            {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
        </div>
      </div>
      <div className={`w-11 h-6 rounded-full relative transition-colors ${checked ? 'bg-[var(--nexus-accent)]' : 'bg-gray-700'}`}>
        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
    </div>
  );

  const NavItem = ({ label, icon: Icon, desc, onClick, color = 'text-gray-400', value }: { label: string, icon: any, desc?: string, onClick: () => void, color?: string, value?: string }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0 first:rounded-t-xl last:rounded-b-xl group text-left">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
          <Icon size={18} />
        </div>
        <div>
          <span className="font-bold text-white text-sm block">{label}</span>
          {desc && <span className="text-xs text-gray-500">{desc}</span>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-xs text-gray-500">{value}</span>}
        <ChevronRight size={16} className="text-gray-600 group-hover:text-white" />
      </div>
    </button>
  );

  const LangItem = ({ lang, label, active }: { lang: string, label: string, active: boolean }) => (
      <button 
        onClick={() => handleLanguageChange(lang)} 
        className={`w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0 first:rounded-t-xl last:rounded-b-xl ${active ? 'bg-white/[0.08]' : ''}`}
      >
          <span className={`text-sm font-bold ${active ? 'text-[var(--nexus-accent)]' : 'text-white'}`}>{label}</span>
          {active && <CheckCircle size={18} className="text-[var(--nexus-accent)]" />}
      </button>
  );

  // --- PAGES ---

  const renderLanguage = () => (
      <div className="animate-in slide-in-from-right duration-300">
          <div className="glass-panel rounded-xl overflow-hidden border border-white/10">
              <LangItem lang="en" label="English (US)" active={settings.language === 'en'} />
              <LangItem lang="th" label="ไทย (Thai)" active={settings.language === 'th'} />
              <LangItem lang="jp" label="日本語 (Japanese)" active={settings.language === 'jp'} />
              <LangItem lang="cn" label="中文 (Chinese)" active={settings.language === 'cn'} />
              <LangItem lang="es" label="Español (Spanish)" active={settings.language === 'es'} />
              <LangItem lang="fr" label="Français (French)" active={settings.language === 'fr'} />
          </div>
      </div>
  );

  const renderNotifications = () => (
      <div className="animate-in slide-in-from-right duration-300">
          <div className="glass-panel rounded-xl overflow-hidden border border-white/10 mb-6">
              <ToggleItem label={t('settings.push')} desc={t('settings.pushDesc')} checked={settings.pushNotifications} onChange={(v) => updateSettings('pushNotifications', v)} icon={Bell} color="text-rose-400" />
              <ToggleItem label={t('settings.email')} desc={t('settings.emailDesc')} checked={settings.emailNotifications} onChange={(v) => updateSettings('emailNotifications', v)} icon={MessageSquare} color="text-blue-400" />
          </div>
          <SectionTitle title={t('settings.categories')} />
          <div className="glass-panel rounded-xl overflow-hidden border border-white/10">
              <ToggleItem label={t('notif.all')} checked={settings.pushTypes?.likes ?? true} onChange={(v) => updateSettings('pushTypes', {...settings.pushTypes, likes: v})} icon={Activity} color="text-pink-400" />
              <ToggleItem label="Comments" checked={settings.pushTypes?.comments ?? true} onChange={(v) => updateSettings('pushTypes', {...settings.pushTypes, comments: v})} icon={MessageSquare} color="text-green-400" />
              <ToggleItem label="New Followers" checked={settings.pushTypes?.follows ?? true} onChange={(v) => updateSettings('pushTypes', {...settings.pushTypes, follows: v})} icon={UserPlus} color="text-indigo-400" />
              <ToggleItem label="Direct Messages" checked={settings.pushTypes?.messages ?? true} onChange={(v) => updateSettings('pushTypes', {...settings.pushTypes, messages: v})} icon={MessageSquare} color="text-cyan-400" />
          </div>
      </div>
  );

  const renderMedia = () => (
      <div className="animate-in slide-in-from-right duration-300">
          <SectionTitle title={t('settings.dataQuality')} />
          <div className="glass-panel rounded-xl overflow-hidden border border-white/10">
              <ToggleItem label={t('settings.autoPlay')} checked={settings.autoPlayVideo} onChange={(v) => updateSettings('autoPlayVideo', v)} icon={Cast} color="text-orange-400" />
              <ToggleItem label={t('settings.dataSaver')} desc={t('settings.dataSaverDesc')} checked={settings.dataSaver} onChange={(v) => updateSettings('dataSaver', v)} icon={WifiOff} color="text-red-400" />
              <ToggleItem label={t('settings.highQuality')} desc={t('settings.highQualityDesc')} checked={settings.highQualityUploads} onChange={(v) => updateSettings('highQualityUploads', v)} icon={HardDrive} color="text-green-400" />
          </div>
          
          <SectionTitle title={t('settings.mixer')} />
          <div className="glass-panel rounded-xl p-6 border border-white/10">
              <ToggleItem label={t('settings.sound')} desc={t('settings.soundDesc')} checked={settings.soundEnabled} onChange={(v) => { updateSettings('soundEnabled', v); soundEngine.setEnabled(v); }} icon={Volume2} color="text-purple-400" />
              {settings.soundEnabled && (
                  <div className="mt-4 space-y-4 px-2">
                      <div>
                          <div className="flex justify-between text-xs text-gray-400 mb-2"><span>{t('settings.volumeMaster')}</span><span>{settings.volumeMaster}%</span></div>
                          <input type="range" min="0" max="100" value={settings.volumeMaster} onChange={(e) => updateSettings('volumeMaster', parseInt(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--nexus-accent)]" />
                      </div>
                      <div>
                          <div className="flex justify-between text-xs text-gray-400 mb-2"><span>{t('settings.volumeEffects')}</span><span>{settings.volumeEffects}%</span></div>
                          <input type="range" min="0" max="100" value={settings.volumeEffects} onChange={(e) => updateSettings('volumeEffects', parseInt(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--nexus-accent)]" />
                      </div>
                  </div>
              )}
          </div>
      </div>
  );

  const renderAccount = () => (
    <div className="animate-in slide-in-from-right duration-300">
       <SectionTitle title={t('settings.security')} />
       <div className="glass-panel rounded-xl overflow-hidden border border-white/10">
           <NavItem label={t('settings.password')} icon={Key} onClick={() => {}} color="text-yellow-400" />
           <ToggleItem label={t('settings.2fa')} desc={t('settings.2faDesc')} checked={settings.twoFactorEnabled} onChange={(v) => updateSettings('twoFactorEnabled', v)} icon={Shield} color="text-green-400" />
           <NavItem label={t('settings.sessions')} desc={`${settings.activeSessions} active`} icon={Smartphone} onClick={() => navigateTo('sessions')} color="text-blue-400" />
       </div>
       
       <SectionTitle title={t('settings.data')} />
       <div className="glass-panel rounded-xl overflow-hidden border border-white/10">
           <NavItem label={t('settings.download')} icon={Download} onClick={handleExportData} color="text-indigo-400" />
           <NavItem label={t('settings.loginActivity')} icon={History} onClick={() => navigateTo('activity_log')} color="text-gray-400" />
       </div>
    </div>
  );

  const renderAppearance = () => (
    <div className="animate-in slide-in-from-right duration-300">
        <SectionTitle title={t('settings.theme')} />
        <div className="glass-panel rounded-xl p-4 border border-white/10 mb-4 flex justify-between gap-2">
            {['indigo', 'cyan', 'pink', 'emerald', 'amber'].map(c => (
                    <button 
                    key={c}
                    onClick={() => { updateSettings('themeColor', c); soundEngine.playClick(); }}
                    className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center relative ${settings.themeColor === c ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border-transparent opacity-50'}`}
                    style={{ backgroundColor: c === 'indigo' ? '#6366f1' : c === 'cyan' ? '#06b6d4' : c === 'pink' ? '#ec4899' : c === 'emerald' ? '#10b981' : '#f59e0b' }}
                    >
                        {settings.themeColor === c && <CheckCircle size={16} className="text-white" />}
                    </button>
            ))}
        </div>
        
        <div className="glass-panel rounded-xl overflow-hidden border border-white/10">
            <ToggleItem label={t('settings.dark')} icon={Moon} checked={settings.darkMode} onChange={(v) => updateSettings('darkMode', v)} color="text-indigo-400" />
            <ToggleItem label={t('settings.zen')} desc={t('settings.zenDesc')} checked={settings.zenMode} onChange={(v) => updateSettings('zenMode', v)} icon={Zap} color="text-yellow-400" />
            <NavItem label={t('settings.scale')} icon={Monitor} value={`${Math.round((settings.uiScale || 1) * 100)}%`} onClick={() => {}} color="text-cyan-400" />
        </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="animate-in slide-in-from-right duration-300">
       <SectionTitle title={t('settings.accountPrivacy')} />
       <div className="glass-panel rounded-xl overflow-hidden border border-white/10">
           <ToggleItem label={t('settings.privateAccount')} desc={t('settings.privateAccountDesc')} checked={settings.privateAccount} onChange={(v) => updateSettings('privateAccount', v)} icon={Lock} color="text-rose-400" />
           <ToggleItem label={t('settings.activityStatus')} desc={t('settings.activityStatusDesc')} checked={settings.activityStatus} onChange={(v) => updateSettings('activityStatus', v)} icon={Activity} color="text-green-400" />
           <ToggleItem label={t('settings.streamer')} desc={t('settings.streamerDesc')} checked={settings.streamerMode} onChange={(v) => updateSettings('streamerMode', v)} icon={Cast} color="text-purple-400" />
       </div>
       
       <SectionTitle title={t('settings.interactions')} />
       <div className="glass-panel rounded-xl overflow-hidden border border-white/10">
           <NavItem label={t('settings.blocked')} desc={`${(settings.blockedUsers || []).length} users`} icon={UserX} onClick={() => navigateTo('blocked_list')} color="text-red-400" />
           <ToggleItem label={t('settings.readReceipts')} checked={settings.readReceipts} onChange={(v) => updateSettings('readReceipts', v)} icon={CheckCircle} color="text-blue-400" />
       </div>
    </div>
  );

  const renderWalletSettings = () => (
      <div className="animate-in slide-in-from-right duration-300">
          <div className="glass-panel rounded-xl overflow-hidden border border-white/10">
              <NavItem label="Payment Methods" icon={CreditCard} onClick={() => {}} color="text-indigo-400" />
              <NavItem label={t('settings.currency')} value={settings.currency || 'NEX'} icon={Wallet} onClick={() => {}} color="text-green-400" />
              <ToggleItem label={t('settings.pin')} desc="For transactions > 100 NEX" checked={true} onChange={() => {}} icon={Lock} color="text-yellow-400" />
          </div>
      </div>
  );

  const renderActivityLog = () => {
      const logs = db.getSystemLogs();
      return (
          <div className="animate-in slide-in-from-right duration-300">
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 px-4">{t('settings.loginActivity')}</h3>
              {logs.length === 0 ? (
                  <p className="text-gray-500 text-center py-10">{t('common.empty')}</p>
              ) : (
                  <div className="space-y-2">
                      {logs.map(log => (
                          <div key={log.id} className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-start mx-2">
                              <div>
                                  <div className="text-sm font-bold text-white">{log.action}</div>
                                  <div className="text-xs text-gray-400">{log.details}</div>
                              </div>
                              <div className="text-[10px] text-gray-500">{log.timestamp}</div>
                          </div>
                      ))}
                  </div>
              )}
          </div>
      );
  }

  const renderBlockedList = () => {
      const blockedIds = settings.blockedUsers || [];
      const blockedUsers = allUsers.filter(u => blockedIds.includes(u.id));

      return (
          <div className="animate-in slide-in-from-right duration-300">
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 px-4">{t('settings.blocked')}</h3>
              {blockedIds.length === 0 ? (
                  <div className="text-center py-10 text-gray-500 bg-white/5 rounded-xl border border-white/5 border-dashed mx-2"><p>{t('common.empty')}</p></div>
              ) : (
                  <div className="space-y-2 px-2">
                      {blockedUsers.map(user => (
                          <div key={user.id} className="flex items-center justify-between p-4 glass-panel rounded-xl border border-white/5">
                              <div className="flex items-center gap-3">
                                  <img src={user.avatar} className="w-10 h-10 rounded-full bg-gray-800" />
                                  <div>
                                      <p className="text-sm font-bold text-white">{user.name}</p>
                                      <p className="text-xs text-gray-500">@{user.handle}</p>
                                  </div>
                              </div>
                              <button onClick={() => { soundEngine.playSuccess(); updateSettings('blockedUsers', (settings.blockedUsers || []).filter(id => id !== user.id)); }} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-white">{t('admin.unban')}</button>
                          </div>
                      ))}
                      {/* Handle IDs that might not have user records (deleted users) */}
                      {blockedIds.filter(id => !blockedUsers.find(u => u.id === id)).map(id => (
                           <div key={id} className="flex items-center justify-between p-4 glass-panel rounded-xl border border-white/5">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-500">?</div>
                                  <div>
                                      <p className="text-sm font-bold text-gray-400">Unknown User</p>
                                      <p className="text-xs text-gray-600">ID: {id}</p>
                                  </div>
                              </div>
                              <button onClick={() => { updateSettings('blockedUsers', (settings.blockedUsers || []).filter(uid => uid !== id)); }} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-white">{t('admin.unban')}</button>
                          </div>
                      ))}
                  </div>
              )}
          </div>
      );
  }

  // --- MAIN ROUTER ---
  return (
    <div className="animate-enter pb-24 max-w-2xl mx-auto">
       <div className="mb-6 px-2 flex items-center gap-3 pt-4">
         {page !== 'main' && (
             <button onClick={handleBack} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                 <ArrowLeft size={24} />
             </button>
         )}
         <div>
            <h2 className="text-2xl font-bold text-white font-display">
                {page === 'main' ? t('settings.title') : t(`settings.${page}` as any) || page.replace('_', ' ')}
            </h2>
         </div>
       </div>

       <div className="space-y-6">
          {page === 'main' && (
             <div className="animate-in slide-in-from-left duration-300 space-y-6">
                 
                 {/* User Card */}
                 <div className="bg-gradient-to-r from-[#1e293b] to-[#0f172a] p-4 rounded-2xl border border-white/10 flex items-center gap-4 cursor-pointer hover:border-white/20 transition-all shadow-lg group" onClick={() => navigateTo('account')}>
                    <div className="w-12 h-12 bg-[var(--nexus-accent)] rounded-full flex items-center justify-center text-white shadow-lg shadow-[var(--nexus-accent-glow)] group-hover:scale-110 transition-transform">
                        <Shield size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-white group-hover:text-[var(--nexus-accent)] transition-colors">{t('settings.account')}</h3>
                        <p className="text-xs text-gray-400">{t('settings.privacySecurity')}</p>
                    </div>
                    <ChevronRight size={20} className="text-gray-500 group-hover:text-white" />
                 </div>

                 <div>
                    <SectionTitle title="General" />
                    <div className="glass-panel rounded-xl overflow-hidden border border-white/10">
                        <NavItem 
                            label={t('settings.language')} 
                            icon={Languages} 
                            value={(settings.language || 'en').toUpperCase()} 
                            onClick={() => navigateTo('language')} 
                            color="text-blue-400" 
                        />
                        <NavItem label={t('settings.notifications')} icon={Bell} onClick={() => navigateTo('notifications')} color="text-rose-400" />
                        <NavItem label="Sound & Media" icon={Speaker} onClick={() => navigateTo('media')} color="text-yellow-400" />
                    </div>
                 </div>

                 <div>
                    <SectionTitle title={t('settings.experience')} />
                    <div className="glass-panel rounded-xl overflow-hidden border border-white/10">
                        <NavItem label={t('settings.appearance')} icon={Palette} onClick={() => navigateTo('appearance')} color="text-pink-400" />
                        <NavItem label="Accessibility" icon={Type} onClick={() => navigateTo('appearance')} color="text-purple-400" />
                    </div>
                 </div>

                 <div>
                    <SectionTitle title={t('settings.privacy') + " & Economy"} />
                    <div className="glass-panel rounded-xl overflow-hidden border border-white/10">
                        <NavItem label={t('settings.privacy')} icon={Lock} onClick={() => navigateTo('privacy')} color="text-emerald-400" />
                        <NavItem label={t('wallet.title')} icon={Wallet} onClick={() => navigateTo('wallet')} color="text-cyan-400" />
                        <NavItem label={t('settings.loginActivity')} icon={History} onClick={() => navigateTo('activity_log')} color="text-gray-400" />
                    </div>
                 </div>
                 
                 <div className="pt-6 border-t border-white/5">
                     <button className="w-full flex items-center justify-center gap-2 p-4 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors font-bold text-sm border border-transparent hover:border-rose-500/20">
                         <LogOut size={18} /> {t('settings.logout')}
                     </button>
                     <p className="text-center text-[10px] text-gray-600 mt-4">Nexus OS v2.6.0 (Build Global)</p>
                 </div>
             </div>
          )}

          {page === 'language' && renderLanguage()}
          {page === 'notifications' && renderNotifications()}
          {page === 'media' && renderMedia()}
          {page === 'account' && renderAccount()}
          {page === 'privacy' && renderPrivacy()}
          {page === 'appearance' && renderAppearance()}
          {page === 'wallet' && renderWalletSettings()}
          {page === 'blocked_list' && renderBlockedList()}
          {page === 'activity_log' && renderActivityLog()}
       </div>
    </div>
  );
};

export default SettingsView;