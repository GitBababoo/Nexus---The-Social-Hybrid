import React, { useState, useEffect } from 'react';
import { Shield, Users, Activity, Database, Lock, Search, Trash2, CheckCircle, AlertTriangle, RefreshCw, ChevronUp, UserX, UserCheck, FileText, Terminal, Gavel, AlertCircle, DollarSign, Edit3, ArrowLeft, Monitor, Cpu, HardDrive, LogOut } from 'lucide-react';
import { db } from '../services/db';
import { User, Post, Report, SystemLog } from '../types';
import { soundEngine } from '../services/soundService';
import { useTranslation } from 'react-i18next';

interface AdminDashboardProps {
    onExit?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExit }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'content' | 'system' | 'database'>('overview');
    const [users, setUsers] = useState<User[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [logs, setLogs] = useState<SystemLog[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [balanceEdit, setBalanceEdit] = useState('');

    useEffect(() => {
        const currentUser = db.getUser();
        if (currentUser && currentUser.roles.includes('admin')) {
            setIsAuthorized(true);
            refreshData();
            // Poll for logs and reports
            const interval = setInterval(refreshData, 5000);
            return () => clearInterval(interval);
        }
    }, []);

    const refreshData = () => {
        setUsers(db.getAllUsers());
        setPosts(db.getPosts());
        setReports(db.getReports());
        setLogs(db.getSystemLogs());
    };

    // Actions
    const handleBan = (id: string) => { db.toggleBanUser(id); refreshData(); soundEngine.playClick(); };
    const handleVerify = (id: string) => { db.toggleVerifyUser(id); refreshData(); soundEngine.playSuccess(); };
    const handlePromote = (id: string) => { db.promoteUser(id); refreshData(); soundEngine.playSuccess(); };
    const handleResolveReport = (id: string) => { db.resolveReport(id, 'resolved'); refreshData(); soundEngine.playSuccess(); };
    const handleDismissReport = (id: string) => { db.resolveReport(id, 'dismissed'); refreshData(); soundEngine.playClick(); };
    const handleNuke = () => { if (confirm("WARNING: THIS WILL DELETE ALL DATA. ARE YOU SURE?")) { db.nuke(); } };
    
    const handleDeletePost = (id: string) => {
        if(confirm("Delete this post?")) {
            db.deletePost(id);
            refreshData();
            soundEngine.playError();
        }
    };

    if (!isAuthorized) {
        return (
            <div className="h-full w-full bg-[#050b14] flex flex-col items-center justify-center text-center p-8 z-50 absolute inset-0">
                <div className="relative">
                    <Lock size={64} className="text-rose-500 mb-4 animate-pulse" />
                    <div className="absolute inset-0 bg-rose-500 blur-3xl opacity-20"></div>
                </div>
                <h1 className="text-4xl font-black text-white mb-2 font-display tracking-wider">{t('admin.accessDenied')}</h1>
                <p className="text-gray-400 font-mono">{t('admin.authRequired')}</p>
                {onExit && (
                    <button onClick={onExit} className="mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all">
                        {t('admin.returnSafety')}
                    </button>
                )}
            </div>
        );
    }

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const pendingReports = reports.filter(r => r.status === 'pending');

    return (
        <div className="fixed inset-0 bg-[#050b14] text-gray-200 z-[100] flex flex-col font-sans overflow-hidden">
            {/* Top Bar */}
            <header className="h-16 bg-[#0f172a] border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-20 shadow-lg">
                <div className="flex items-center gap-6">
                    {onExit && (
                        <button onClick={onExit} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                            <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 border border-white/5 transition-all">
                                <ArrowLeft size={18} />
                            </div>
                            <span className="text-sm font-bold hidden md:inline">{t('admin.exit')}</span>
                        </button>
                    )}
                    <div className="h-8 w-px bg-white/10 hidden md:block"></div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(225,29,72,0.5)]">
                            <Shield size={18} className="text-white fill-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-white font-display tracking-tight leading-none">NEXUS <span className="text-rose-500">ADMIN</span></h1>
                            <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">{t('admin.systemControl')} // v2.5.0</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-black/30 rounded-full border border-white/5">
                        <div className="flex items-center gap-2 text-xs font-mono text-green-400">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            {t('admin.systemOptimal')}
                        </div>
                        <span className="text-white/10">|</span>
                        <div className="text-xs font-mono text-blue-400">
                            {t('admin.latency')}: 12ms
                        </div>
                    </div>
                    <img src="https://picsum.photos/seed/admin/50" className="w-9 h-9 rounded-full border-2 border-rose-500/50" alt="Admin" />
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <nav className="w-20 md:w-64 bg-[#0a0f1c] border-r border-white/5 flex flex-col py-6 gap-2 shrink-0">
                    {[
                        { id: 'overview', icon: Activity, label: t('admin.overview') },
                        { id: 'users', icon: Users, label: t('admin.users') },
                        { id: 'content', icon: Gavel, label: t('admin.content'), badge: pendingReports.length },
                        { id: 'system', icon: Terminal, label: t('admin.system') },
                        { id: 'database', icon: Database, label: t('admin.db') },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            className={`relative flex items-center gap-4 px-6 py-3 mx-3 rounded-xl transition-all group overflow-hidden ${activeTab === item.id ? 'bg-white/5 text-white border border-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]' : 'text-gray-500 hover:bg-white/[0.02] hover:text-gray-300'}`}
                        >
                            {activeTab === item.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 shadow-[0_0_10px_#f43f5e]"></div>}
                            <item.icon size={20} className={activeTab === item.id ? 'text-rose-500' : ''} />
                            <span className="font-bold text-sm hidden md:block flex-1 text-left">{item.label}</span>
                            {item.badge ? <span className="hidden md:flex bg-rose-600 text-white text-[10px] px-1.5 py-0.5 rounded font-black">{item.badge}</span> : null}
                        </button>
                    ))}
                </nav>

                {/* Main View */}
                <main className="flex-1 bg-[#050b14] overflow-y-auto custom-scrollbar p-4 md:p-8 relative">
                    {/* Background Grid */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                    {activeTab === 'overview' && (
                        <div className="space-y-8 max-w-7xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-rose-500/30 transition-colors">
                                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Users size={80} /></div>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">{t('admin.totalUsers')}</p>
                                    <h3 className="text-4xl font-black text-white tracking-tight">{users.length.toLocaleString()}</h3>
                                    <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[75%]"></div></div>
                                </div>
                                <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-rose-500/30 transition-colors">
                                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><FileText size={80} /></div>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">{t('admin.totalPosts')}</p>
                                    <h3 className="text-4xl font-black text-white tracking-tight">{posts.length.toLocaleString()}</h3>
                                    <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-purple-500 w-[45%]"></div></div>
                                </div>
                                <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-rose-500/30 transition-colors">
                                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><AlertTriangle size={80} /></div>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">{t('admin.reportsPending')}</p>
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="text-4xl font-black text-white tracking-tight">{pendingReports.length}</h3>
                                        <span className="text-xs font-bold text-rose-500 uppercase">Pending</span>
                                    </div>
                                    <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-rose-500" style={{ width: `${Math.min(100, pendingReports.length * 10)}%` }}></div></div>
                                </div>
                                <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-rose-500/30 transition-colors">
                                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Cpu size={80} /></div>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">{t('admin.serverLoad')}</p>
                                    <h3 className="text-4xl font-black text-green-400 tracking-tight">4%</h3>
                                    <div className="mt-4 flex gap-1">
                                        {[1,2,3,4,5,6,7,8,9,10].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i < 2 ? 'bg-green-500' : 'bg-white/10'}`}></div>)}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 bg-[#0f172a] rounded-2xl border border-white/5 p-6 flex flex-col">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-bold text-white flex items-center gap-2"><Activity size={18} className="text-rose-500"/> {t('admin.liveLogs')}</h3>
                                        <div className="flex gap-2 text-[10px] font-mono">
                                            <span className="px-2 py-1 bg-white/5 rounded text-gray-400">FILTER: ALL</span>
                                            <span className="px-2 py-1 bg-white/5 rounded text-gray-400">SORT: NEWEST</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-black/50 rounded-xl p-4 font-mono text-xs overflow-y-auto custom-scrollbar border border-white/5 h-[400px]">
                                        {logs.slice(0, 50).map(log => {
                                            if (!log) return null; // Defensive check for null logs
                                            // Fix: Safe timestamp parsing
                                            const timestampStr = String(log.timestamp || '');
                                            const parts = timestampStr.split(',');
                                            let timeDisplay = timestampStr;
                                            // Ensure parts[1] is a string before trimming
                                            if (parts.length > 1 && typeof parts[1] === 'string') {
                                                timeDisplay = parts[1].trim();
                                            }
                                            
                                            return (
                                                <div key={log.id} className="mb-2 flex gap-3 hover:bg-white/5 p-1 rounded transition-colors">
                                                    <span className="text-gray-600 shrink-0 w-32 opacity-50">[{timeDisplay}]</span>
                                                    <span className={`font-bold uppercase w-24 shrink-0 text-right ${log.severity === 'error' || log.severity === 'critical' ? 'text-rose-500' : log.severity === 'warning' ? 'text-yellow-500' : 'text-blue-400'}`}>{log.action}</span>
                                                    <span className="text-gray-300 break-all">{log.details}</span>
                                                </div>
                                            );
                                        })}
                                        <div className="text-green-500 animate-pulse mt-2">_</div>
                                    </div>
                                </div>

                                <div className="bg-[#0f172a] rounded-2xl border border-white/5 p-6">
                                    <h3 className="font-bold text-white mb-6 flex items-center gap-2"><HardDrive size={18} className="text-blue-500"/> {t('admin.storage')}</h3>
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between text-xs font-bold text-gray-400 mb-2"><span>DATABASE</span><span>1.2 GB / 5 GB</span></div>
                                            <div className="h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[24%]"></div></div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs font-bold text-gray-400 mb-2"><span>MEDIA ASSETS</span><span>45 GB / 100 GB</span></div>
                                            <div className="h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-purple-500 w-[45%]"></div></div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs font-bold text-gray-400 mb-2"><span>LOGS</span><span>120 MB / 1 GB</span></div>
                                            <div className="h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-yellow-500 w-[12%]"></div></div>
                                        </div>
                                    </div>
                                    <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/5">
                                        <h4 className="text-xs font-bold text-gray-300 mb-2 uppercase">{t('admin.quickActions')}</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button className="py-2 bg-black/30 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg text-xs font-bold transition-colors">{t('admin.clearCache')}</button>
                                            <button className="py-2 bg-black/30 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg text-xs font-bold transition-colors">{t('admin.backupDb')}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#0f172a] p-4 rounded-2xl border border-white/5">
                                <h2 className="text-xl font-bold text-white hidden md:block">{t('admin.users')}</h2>
                                <div className="flex gap-4 w-full md:w-auto">
                                    <div className="relative flex-1 md:w-80">
                                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
                                        <input 
                                            type="text" 
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Search name, handle, email..." 
                                            className="w-full bg-[#050b14] border border-white/10 rounded-xl py-2.5 pl-10 text-sm text-white focus:border-rose-500/50 focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <button className="p-2.5 bg-white/5 rounded-xl hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white transition-colors"><RefreshCw size={20} onClick={refreshData}/></button>
                                </div>
                            </div>

                            <div className="bg-[#0f172a] rounded-2xl overflow-hidden border border-white/5 shadow-xl">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-black/20 text-gray-400 text-xs uppercase font-bold tracking-wider border-b border-white/5">
                                            <tr>
                                                <th className="p-5">User Identity</th>
                                                <th className="p-5">Role & Permissions</th>
                                                <th className="p-5">Stats</th>
                                                <th className="p-5">Status</th>
                                                <th className="p-5 text-right">Controls</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {filteredUsers.map(user => (
                                                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                                    <td className="p-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative">
                                                                <img src={user.avatar} className="w-10 h-10 rounded-xl bg-gray-800 object-cover" />
                                                                {user.isVerified && <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full"><CheckCircle size={10} /></div>}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-white text-base">{user.name}</div>
                                                                <div className="text-xs text-gray-500 font-mono">@{user.handle}</div>
                                                                <div className="text-[10px] text-gray-600 mt-0.5">{user.email || 'No Email'}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-5">
                                                        <div className="flex gap-2 flex-wrap">
                                                            {user.roles.map(r => {
                                                                const color = r === 'admin' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : r === 'moderator' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-white/5 text-gray-400 border-white/10';
                                                                return <span key={r} className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold border ${color}`}>{r}</span>
                                                            })}
                                                        </div>
                                                    </td>
                                                    <td className="p-5">
                                                        <div className="flex flex-col gap-1 text-xs">
                                                            <span className="text-white font-bold">Lvl {user.stats?.level}</span>
                                                            <span className="text-gray-500">{user.stats?.posts} posts</span>
                                                            <span className="text-gray-500">{user.stats?.followers} followers</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-5">
                                                        {user.isBanned ? (
                                                            <span className="inline-flex items-center gap-1.5 text-rose-500 font-bold text-xs bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
                                                                <Lock size={12}/> BANNED
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 text-green-500 font-bold text-xs bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
                                                                <Activity size={12}/> ACTIVE
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="p-5 text-right">
                                                        <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => handleVerify(user.id)} className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors" title="Toggle Verify"><CheckCircle size={16}/></button>
                                                            <button onClick={() => handlePromote(user.id)} className="p-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded-lg transition-colors" title="Promote/Demote"><Shield size={16}/></button>
                                                            <button onClick={() => handleBan(user.id)} className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors" title="Ban/Unban">{user.isBanned ? <UserCheck size={16}/> : <UserX size={16}/>}</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'content' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5 mb-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-3"><Gavel className="text-rose-500"/> {t('admin.content')}</h2>
                                <p className="text-gray-400 text-sm mt-1">Review reported content and take action.</p>
                            </div>

                            {pendingReports.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-32 bg-[#0f172a] rounded-3xl border border-white/5 border-dashed">
                                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle size={40} className="text-green-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{t('admin.allClear')}</h3>
                                    <p className="text-gray-500">{t('admin.noPending')}</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6">
                                    {pendingReports.map(report => {
                                        const reportedPost = posts.find(p => p.id === report.targetId);
                                        const reporter = users.find(u => u.id === report.reporterId);
                                        
                                        return (
                                            <div key={report.id} className="bg-[#0f172a] p-6 rounded-2xl border border-rose-500/20 shadow-lg flex flex-col md:flex-row gap-8 relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                                                
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <span className="bg-rose-500/20 text-rose-400 text-xs font-bold px-3 py-1 rounded-lg border border-rose-500/20 uppercase tracking-wider">Report #{report.id.slice(-4)}</span>
                                                        <span className="text-gray-500 text-xs font-mono">{report.timestamp}</span>
                                                    </div>
                                                    
                                                    <div className="mb-6">
                                                        <h4 className="text-gray-400 text-xs font-bold uppercase mb-1">{t('admin.reason')}</h4>
                                                        <p className="text-white font-bold text-lg">{report.reason}</p>
                                                        <p className="text-gray-500 text-xs mt-1">{t('admin.reportedBy')} <span className="text-indigo-400">@{reporter?.handle || 'Unknown'}</span></p>
                                                    </div>
                                                    
                                                    <div className="bg-black/40 p-5 rounded-xl border border-white/10">
                                                        <h4 className="text-gray-500 text-xs font-bold uppercase mb-3">{t('admin.contentPreview')}</h4>
                                                        {reportedPost ? (
                                                            <div>
                                                                <div className="flex items-center gap-3 mb-3">
                                                                    <img src={reportedPost.user.avatar} className="w-8 h-8 rounded-lg" />
                                                                    <div>
                                                                        <span className="text-sm font-bold text-white block">{reportedPost.user.name}</span>
                                                                        <span className="text-xs text-gray-500">@{reportedPost.user.handle}</span>
                                                                    </div>
                                                                </div>
                                                                <p className="text-gray-200 text-sm leading-relaxed pl-4 border-l-2 border-white/10">"{reportedPost.content}"</p>
                                                                {reportedPost.image && <img src={reportedPost.image} className="mt-4 h-48 w-full object-cover rounded-lg border border-white/10" />}
                                                            </div>
                                                        ) : (
                                                            <div className="text-gray-500 italic flex items-center gap-2"><AlertTriangle size={16}/> Content deleted or unavailable.</div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col justify-center gap-3 w-full md:w-48 shrink-0">
                                                    <button onClick={() => handleResolveReport(report.id)} className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-600/20">
                                                        <CheckCircle size={16}/> {t('admin.keep')}
                                                    </button>
                                                    <button onClick={() => { reportedPost && handleDeletePost(reportedPost.id); handleResolveReport(report.id); }} className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-600/20">
                                                        <Trash2 size={16}/> {t('admin.nukeResolve')}
                                                    </button>
                                                    <button onClick={() => handleDismissReport(report.id)} className="w-full py-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl font-bold text-xs transition-all border border-white/5">
                                                        {t('admin.dismiss')}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'database' && (
                        <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-300">
                            <div className="bg-rose-900/20 border border-rose-500/30 rounded-3xl p-8 mb-8 relative overflow-hidden">
                                <div className="absolute -right-10 -top-10 opacity-10"><AlertTriangle size={200} /></div>
                                <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-3"><AlertTriangle size={32} className="text-rose-500"/> DANGER ZONE</h3>
                                <p className="text-gray-300 mb-8 max-w-lg">{t('admin.nukeDesc')} This action cannot be undone. All user data, posts, and configurations will be erased.</p>
                                <button onClick={handleNuke} className="px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl flex items-center gap-3 shadow-xl shadow-rose-600/20 transition-all transform hover:scale-[1.02]">
                                    <Trash2 size={24}/> {t('admin.nuke')}
                                </button>
                            </div>

                            <div className="bg-[#0f172a] rounded-3xl p-8 border border-white/5">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Database size={24} className="text-blue-400"/> {t('admin.db')} Management</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-black/30 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors cursor-pointer" onClick={() => { /* logic */ }}>
                                        <h4 className="font-bold text-white mb-1 flex items-center gap-2"><FileText size={16}/> {t('admin.export')}</h4>
                                        <p className="text-xs text-gray-500">Download full DB dump</p>
                                    </div>
                                    <div className="p-4 bg-black/30 rounded-xl border border-white/5 hover:border-green-500/30 transition-colors cursor-pointer" onClick={() => window.location.reload()}>
                                        <h4 className="font-bold text-white mb-1 flex items-center gap-2"><RefreshCw size={16}/> Reboot System</h4>
                                        <p className="text-xs text-gray-500">Reload application state</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
