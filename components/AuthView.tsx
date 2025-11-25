
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Zap, Mail, Lock, User, ArrowRight, Loader2, AlertCircle, Eye, EyeOff, Globe, Fingerprint, Github, Twitter, ShieldCheck, HelpCircle, CheckCircle, Key, RefreshCcw, Phone, Smartphone, Shield } from 'lucide-react';
import { authService } from '../services/auth';
import { useTranslation } from 'react-i18next';

const SECURITY_QUESTIONS = [
    "What was the name of your first pet?",
    "What city were you born in?",
    "What is your mother's maiden name?",
    "What was the model of your first car?",
    "What is the name of your favorite teacher?"
];

const AuthView: React.FC = () => {
    const { t } = useTranslation();
    const { login, isLoading } = useAuth();
    
    // View State: 'login', 'register-step-1', 'register-step-2', 'register-success', 'forgot-password'
    const [view, setView] = useState<'login' | 'register-1' | 'register-2' | 'register-success' | 'forgot'>('login');
    
    // Login Data
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Register Data
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPhone, setRegPhone] = useState(''); // New Phone Field
    const [regPassword, setRegPassword] = useState('');
    const [regConfirmPassword, setRegConfirmPassword] = useState(''); // New Confirm Password
    const [regQuestion, setRegQuestion] = useState(SECURITY_QUESTIONS[0]);
    const [regAnswer, setRegAnswer] = useState('');
    const [generatedBackupCode, setGeneratedBackupCode] = useState<string | null>(null);

    // Forgot Password Data
    const [forgotEmail, setForgotEmail] = useState('');
    const [recoveryStep, setRecoveryStep] = useState<'email-input' | 'method-select' | 'verify' | 'reset'>('email-input');
    const [recoveryMethod, setRecoveryMethod] = useState<'backup_code' | 'security_question' | 'email' | 'phone'>('security_question');
    const [recoveryQuestion, setRecoveryQuestion] = useState('');
    const [recoveryProof, setRecoveryProof] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Parallax
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({
                x: (e.clientX / window.innerWidth) * 20 - 10,
                y: (e.clientY / window.innerHeight) * 20 - 10,
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(loginEmail, loginPassword);
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterStep1 = (e: React.FormEvent) => {
        e.preventDefault();
        if (regPassword !== regConfirmPassword) { setError("Passwords do not match"); return; }
        if(regPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
        if(regPhone.length < 9) { setError("Invalid phone number format"); return; }
        setError('');
        setView('register-2');
    };

    const handleRegisterFinal = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await authService.register(regEmail, regPassword, regName, regPhone, regQuestion, regAnswer);
            if (res.backupCode) {
                setGeneratedBackupCode(res.backupCode);
                setView('register-success');
            } else {
                await login(regEmail, regPassword);
            }
        } catch (err: any) {
            setError(err.message || 'Registration failed');
            if (err.message.includes("One ID")) setTimeout(() => setView('login'), 3000);
        } finally {
            setLoading(false);
        }
    };

    const finishRegistration = async () => {
        await login(regEmail, regPassword);
    };

    // --- Recovery Flow Handlers ---

    const handleForgotCheckEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const q = await authService.getSecurityQuestion(forgotEmail);
            setRecoveryQuestion(q);
            setRecoveryStep('method-select');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyRecovery = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (recoveryMethod === 'email') {
                setSuccessMsg(`Reset link sent to ${forgotEmail}. Check your console.`);
                console.log(`[SIMULATION] Reset Link: https://nexus.social/reset?token=simulated_token`);
                setTimeout(() => setRecoveryStep('reset'), 2000);
            } else if (recoveryMethod === 'phone') {
                setSuccessMsg(`SMS Code sent. Please check your mobile.`);
                // Basic simulation: Any code works for demo, but let's pretend we verify it
                if (recoveryProof.length < 4) throw new Error("Invalid SMS Code");
                setTimeout(() => setRecoveryStep('reset'), 1000);
            } else {
                const isValid = await authService.recoverAccount(forgotEmail, recoveryMethod, recoveryProof);
                if (isValid) setRecoveryStep('reset');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authService.recoverAccount(forgotEmail, recoveryMethod, recoveryProof, newPassword);
            setSuccessMsg("Password reset successfully. Logging in...");
            setTimeout(() => login(forgotEmail, newPassword), 1500);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // --- Sub-Components for Forms ---

    const renderLogin = () => (
        <form onSubmit={handleLogin} className="space-y-5 animate-in slide-in-from-right duration-500">
            <div className="group">
                <div className="relative transition-all duration-300 focus-within:scale-[1.02]">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                    </div>
                    <input type="text" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="block w-full pl-11 pr-4 py-4 bg-[#0f172a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-medium" placeholder="Email or Phone" />
                </div>
            </div>
            <div className="group">
                <div className="relative transition-all duration-300 focus-within:scale-[1.02]">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                    </div>
                    <input type={showPassword ? "text" : "password"} required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="block w-full pl-11 pr-12 py-4 bg-[#0f172a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-medium" placeholder="Password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
            </div>
            <div className="flex items-center justify-end">
                <button type="button" onClick={() => { setView('forgot'); setError(''); setSuccessMsg(''); }} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">Forgot Password?</button>
            </div>
            <button type="submit" disabled={loading || isLoading} className="relative w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] hover:bg-right transition-[background-position] duration-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 group overflow-hidden">
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><span className="relative z-10">INITIALIZE LINK</span><ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" /><div className="absolute inset-0 h-full w-full scale-0 rounded-full transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></div></>}
            </button>
        </form>
    );

    const renderRegisterStep1 = () => (
        <form onSubmit={handleRegisterStep1} className="space-y-4 animate-in slide-in-from-right duration-500">
            <div className="relative transition-all duration-300 focus-within:scale-[1.02]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User className="h-5 w-5 text-gray-500" /></div>
                <input type="text" required value={regName} onChange={(e) => setRegName(e.target.value)} className="block w-full pl-11 pr-4 py-3.5 bg-[#0f172a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all text-sm font-medium" placeholder="Display Name" />
            </div>
            <div className="relative transition-all duration-300 focus-within:scale-[1.02]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-500" /></div>
                <input type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="block w-full pl-11 pr-4 py-3.5 bg-[#0f172a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all text-sm font-medium" placeholder="Email Address" />
            </div>
            <div className="relative transition-all duration-300 focus-within:scale-[1.02]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Phone className="h-5 w-5 text-gray-500" /></div>
                <input type="tel" required value={regPhone} onChange={(e) => setRegPhone(e.target.value)} className="block w-full pl-11 pr-4 py-3.5 bg-[#0f172a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all text-sm font-medium" placeholder="Phone Number" />
            </div>
            <div className="relative transition-all duration-300 focus-within:scale-[1.02]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-500" /></div>
                <input type={showPassword ? "text" : "password"} required value={regPassword} onChange={(e) => setRegPassword(e.target.value)} className="block w-full pl-11 pr-12 py-3.5 bg-[#0f172a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all text-sm font-medium" placeholder="Password (Min 6 chars)" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
            <div className="relative transition-all duration-300 focus-within:scale-[1.02]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><CheckCircle className="h-5 w-5 text-gray-500" /></div>
                <input type={showPassword ? "text" : "password"} required value={regConfirmPassword} onChange={(e) => setRegConfirmPassword(e.target.value)} className="block w-full pl-11 pr-12 py-3.5 bg-[#0f172a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all text-sm font-medium" placeholder="Confirm Password" />
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-2">Next: Security <ArrowRight size={20} /></button>
        </form>
    );

    const renderRegisterStep2 = () => (
        <form onSubmit={handleRegisterFinal} className="space-y-5 animate-in slide-in-from-right duration-500">
            <div className="bg-indigo-900/20 p-4 rounded-xl border border-indigo-500/30 mb-4">
                <div className="flex items-center gap-2 text-indigo-400 font-bold mb-2"><ShieldCheck size={18}/> Account Security</div>
                <p className="text-xs text-gray-400">We use strict security measures. Please set a security question to recover your account if needed.</p>
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Security Question</label>
                <select value={regQuestion} onChange={(e) => setRegQuestion(e.target.value)} className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-indigo-500 outline-none">
                    {SECURITY_QUESTIONS.map((q,i) => <option key={i} value={q}>{q}</option>)}
                </select>
            </div>
            <div className="relative transition-all duration-300 focus-within:scale-[1.02]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><HelpCircle className="h-5 w-5 text-gray-500" /></div>
                <input type="text" required value={regAnswer} onChange={(e) => setRegAnswer(e.target.value)} className="block w-full pl-11 pr-4 py-4 bg-[#0f172a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all text-sm font-medium" placeholder="Your Answer (Case Insensitive)" />
            </div>
            <div className="flex gap-3">
                <button type="button" onClick={() => setView('register-1')} className="flex-1 bg-white/10 text-white font-bold py-4 rounded-xl hover:bg-white/20">Back</button>
                <button type="submit" disabled={loading} className="flex-[2] bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" size={20}/> : 'Complete Registration'}
                </button>
            </div>
        </form>
    );

    const renderRegisterSuccess = () => (
        <div className="text-center animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                <CheckCircle size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Registration Complete!</h2>
            <p className="text-gray-400 text-sm mb-6">Your digital identity has been forged.</p>
            
            <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl mb-6 text-left">
                <div className="flex items-center gap-2 text-yellow-400 font-bold mb-2"><Key size={18}/> EMERGENCY BACKUP CODE</div>
                <p className="text-xs text-gray-300 mb-3">Save this code immediately. It is the <strong>ONLY</strong> way to access your account if you lose your password and security answer.</p>
                <div className="bg-black/50 p-3 rounded-lg border border-white/10 text-center">
                    <span className="text-2xl font-mono font-black text-white tracking-widest">{generatedBackupCode}</span>
                </div>
            </div>

            <button onClick={finishRegistration} className="w-full bg-white text-black font-bold py-4 rounded-xl hover:scale-105 transition-transform shadow-lg">
                Enter Nexus
            </button>
        </div>
    );

    const renderForgotPassword = () => (
        <div className="animate-in slide-in-from-left duration-500">
            <div className="mb-6 flex items-center gap-2 text-gray-400 cursor-pointer hover:text-white" onClick={() => { setView('login'); setRecoveryStep('email-input'); setError(''); setSuccessMsg(''); }}>
                <ArrowRight className="rotate-180" size={16} /> Back to Login
            </div>
            
            {recoveryStep === 'email-input' && (
                <form onSubmit={handleForgotCheckEmail} className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Recover Account</h3>
                    <p className="text-sm text-gray-400 mb-4">Enter your email to find your identity.</p>
                    <input type="email" required value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className="w-full p-4 bg-[#0f172a] border border-white/10 rounded-xl text-white focus:border-indigo-500 outline-none" placeholder="Email Address" />
                    <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl flex justify-center">{loading ? <Loader2 className="animate-spin"/> : "Find Account"}</button>
                </form>
            )}

            {recoveryStep === 'method-select' && (
                <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white">Select Recovery Method</h3>
                    <div onClick={() => setRecoveryMethod('phone')} className={`p-4 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${recoveryMethod === 'phone' ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-[#0f172a] border-white/10 text-gray-400 hover:border-white/30'}`}>
                        <Smartphone size={20} />
                        <div><div className="font-bold text-sm">Phone Number (SMS)</div><div className="text-xs opacity-70">Receive a code to your mobile</div></div>
                    </div>
                    <div onClick={() => setRecoveryMethod('security_question')} className={`p-4 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${recoveryMethod === 'security_question' ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-[#0f172a] border-white/10 text-gray-400 hover:border-white/30'}`}>
                        <HelpCircle size={20} />
                        <div><div className="font-bold text-sm">Security Question</div><div className="text-xs opacity-70">Answer your secret question</div></div>
                    </div>
                    <div onClick={() => setRecoveryMethod('backup_code')} className={`p-4 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${recoveryMethod === 'backup_code' ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-[#0f172a] border-white/10 text-gray-400 hover:border-white/30'}`}>
                        <Key size={20} />
                        <div><div className="font-bold text-sm">Backup Code</div><div className="text-xs opacity-70">Use your 6-digit emergency code</div></div>
                    </div>
                    <div onClick={() => setRecoveryMethod('email')} className={`p-4 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${recoveryMethod === 'email' ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-[#0f172a] border-white/10 text-gray-400 hover:border-white/30'}`}>
                        <Mail size={20} />
                        <div><div className="font-bold text-sm">Email Link</div><div className="text-xs opacity-70">Send a reset link to {forgotEmail}</div></div>
                    </div>
                    <button onClick={() => setRecoveryStep('verify')} className="w-full bg-white text-black font-bold py-3 rounded-xl mt-2">Continue</button>
                </div>
            )}

            {recoveryStep === 'verify' && (
                <form onSubmit={handleVerifyRecovery} className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Verification</h3>
                    {recoveryMethod === 'email' && <p className="text-sm text-gray-400">We will simulate sending an email to <strong>{forgotEmail}</strong>.</p>}
                    {recoveryMethod === 'phone' && <p className="text-sm text-gray-400">We will simulate sending an SMS code. (Enter any 4+ digit code)</p>}
                    
                    {recoveryMethod === 'security_question' && (
                        <>
                            <p className="text-sm text-indigo-300 bg-indigo-500/10 p-3 rounded-lg border border-indigo-500/20">{recoveryQuestion}</p>
                            <input type="text" required value={recoveryProof} onChange={(e) => setRecoveryProof(e.target.value)} className="w-full p-4 bg-[#0f172a] border border-white/10 rounded-xl text-white focus:border-indigo-500 outline-none" placeholder="Your Answer" />
                        </>
                    )}
                    {(recoveryMethod === 'backup_code' || recoveryMethod === 'phone') && (
                        <>
                            <p className="text-sm text-gray-400">{recoveryMethod === 'phone' ? "Enter SMS Code" : "Enter the 6-digit code you saved during registration."}</p>
                            <input type="text" required value={recoveryProof} onChange={(e) => setRecoveryProof(e.target.value)} className="w-full p-4 bg-[#0f172a] border border-white/10 rounded-xl text-white focus:border-indigo-500 outline-none tracking-widest text-center font-mono text-xl" placeholder={recoveryMethod === 'phone' ? "123456" : "000000"} maxLength={6} />
                        </>
                    )}
                    <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl flex justify-center">{loading ? <Loader2 className="animate-spin"/> : "Verify"}</button>
                </form>
            )}

            {recoveryStep === 'reset' && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Set New Password</h3>
                    <div className="relative">
                        <Lock className="absolute left-4 top-4 text-gray-500" size={20} />
                        <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full pl-12 p-4 bg-[#0f172a] border border-white/10 rounded-xl text-white focus:border-indigo-500 outline-none" placeholder="New Password (Min 6 chars)" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl flex justify-center gap-2 items-center">{loading ? <Loader2 className="animate-spin"/> : <><RefreshCcw size={18}/> Reset Password</>}</button>
                </form>
            )}
        </div>
    );

    return (
        <div className="min-h-screen w-full bg-[#050b14] flex items-center justify-center relative overflow-hidden font-sans text-gray-100">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 w-full max-w-5xl h-[90vh] flex rounded-[40px] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.6)] border border-white/10 bg-[#0f172a]/40 backdrop-blur-2xl m-4">
                
                {/* Left Side: Art */}
                <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-indigo-900/80 via-[#050b14] to-purple-900/80">
                    <div className="absolute inset-0 bg-[url('https://cdn.dribbble.com/users/1325849/screenshots/15705868/media/623776f3c077a3cb722982030c29239e.png?resize=1600x1200&vertical=center')] bg-cover bg-center opacity-30 mix-blend-screen transition-transform duration-100 ease-out" style={{ transform: `translate(${mousePos.x * -2}px, ${mousePos.y * -2}px) scale(1.1)` }}></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]"><Zap size={24} className="text-indigo-600 fill-indigo-600" /></div>
                            <span className="text-2xl font-black tracking-tighter text-white font-display">NEXUS</span>
                        </div>
                        <h1 className="text-5xl font-bold leading-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-purple-200 drop-shadow-lg">One Identity.<br/>Infinite Reality.</h1>
                        <p className="text-lg text-gray-400 max-w-xs leading-relaxed">Secure, verifiable, and decentralized social connection.</p>
                    </div>
                    <div className="relative z-10 flex gap-8 border-t border-white/10 pt-8">
                        <div><p className="text-2xl font-bold text-white">1 ID</p><p className="text-xs text-indigo-300 uppercase tracking-wider">Per Person</p></div>
                        <div><p className="text-2xl font-bold text-white">AES</p><p className="text-xs text-purple-300 uppercase tracking-wider">Encryption</p></div>
                        <div><p className="text-2xl font-bold text-white">100%</p><p className="text-xs text-cyan-300 uppercase tracking-wider">Unique</p></div>
                    </div>
                </div>

                {/* Right Side: Forms */}
                <div className="w-full lg:w-1/2 relative bg-[#050b14]/60 flex flex-col justify-center p-8 md:p-12 lg:p-16">
                    <div className="max-w-sm mx-auto w-full">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2 font-display tracking-tight">
                                {view === 'login' ? 'Welcome Back' : view === 'forgot' ? 'Account Recovery' : 'Establish Identity'}
                            </h2>
                            <p className="text-gray-400 text-sm">
                                {view === 'login' ? 'Access your neural link.' : view === 'forgot' ? 'Retrieve access to your node.' : 'Strict verification active. One account per device.'}
                            </p>
                        </div>

                        {(error || successMsg) && (
                            <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm animate-in slide-in-from-left-2 ${error ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400' : 'bg-green-500/10 border border-green-500/20 text-green-400'}`}>
                                {error ? <AlertCircle size={18} className="mt-0.5 shrink-0" /> : <CheckCircle size={18} className="mt-0.5 shrink-0" />}
                                <span>{error || successMsg}</span>
                            </div>
                        )}

                        {/* Render Active View */}
                        {view === 'login' && renderLogin()}
                        {view === 'register-1' && renderRegisterStep1()}
                        {view === 'register-2' && renderRegisterStep2()}
                        {view === 'register-success' && renderRegisterSuccess()}
                        {view === 'forgot' && renderForgotPassword()}

                        {/* Switcher (Only show on login/register-1) */}
                        {(view === 'login' || view === 'register-1') && (
                            <>
                                <div className="relative my-8">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0a0f1c] px-4 text-gray-500">Identity Control</span></div>
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-500 text-sm">
                                        {view === 'login' ? "New entity?" : "Already verified?"}
                                        <button onClick={() => { setView(view === 'login' ? 'register-1' : 'login'); setError(''); }} className="ml-2 text-white font-bold hover:text-indigo-400 underline decoration-indigo-500/50 hover:decoration-indigo-500 underline-offset-4 transition-all">
                                            {view === 'login' ? 'Create ID' : 'Login'}
                                        </button>
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes pulse-slow { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.1); } }
                .animate-pulse-slow { animation: pulse-slow 8s infinite ease-in-out; }
            `}</style>
        </div>
    );
};

export default AuthView;
