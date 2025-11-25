
import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, ChevronRight } from 'lucide-react';
import { db } from '../services/db';
import { useTranslation } from 'react-i18next';

const TerminalView: React.FC = () => {
    const { t } = useTranslation();
    const [history, setHistory] = useState<string[]>(['Welcome to NexusOS v3.0.1', 'Type "help" for available commands.', '']);
    const [input, setInput] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const execute = (cmd: string) => {
        const args = cmd.trim().split(' ');
        const command = args[0].toLowerCase();
        let output = '';

        switch (command) {
            case 'help':
                output = 'Available commands: help, clear, status, whoami, date, nav [page], hack';
                break;
            case 'clear':
                setHistory([]);
                return;
            case 'status':
                output = 'SYSTEM ONLINE. Latency: 12ms. Integrity: 100%.';
                break;
            case 'whoami':
                const user = db.getUser();
                output = `User: ${user.name} | ID: ${user.id} | Role: ${user.roles.join(', ')}`;
                break;
            case 'date':
                output = new Date().toString();
                break;
            case 'hack':
                output = 'Access Denied. Nice try, netrunner.';
                break;
            case 'nav':
                output = `Navigating to ${args[1] || 'home'}... (Simulation)`;
                // In real implementation, we would use the router hook here
                break;
            default:
                output = `Command not found: ${command}`;
        }

        setHistory(prev => [...prev, `> ${cmd}`, output, '']);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            execute(input);
            setInput('');
        }
    };

    return (
        <div className="h-full bg-black p-6 font-mono text-green-500 text-sm overflow-hidden flex flex-col border border-white/10 rounded-3xl shadow-2xl relative">
            {/* CRT Effect Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_2px,3px_100%]"></div>
            <div className="absolute inset-0 pointer-events-none animate-scanlines bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.2)_50%,rgba(0,0,0,0.2))] bg-[length:100%_4px] opacity-10"></div>
            
            <div className="flex items-center gap-2 text-white/50 border-b border-white/10 pb-2 mb-4">
                <TerminalIcon size={16} />
                <span>TERMINAL_ACCESS</span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pb-4 relative z-10">
                {history.map((line, i) => (
                    <div key={i} className="mb-1 whitespace-pre-wrap">{line}</div>
                ))}
                <div ref={bottomRef}></div>
            </div>

            <div className="flex items-center gap-2 relative z-10 mt-2">
                <ChevronRight size={16} className="animate-pulse" />
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="bg-transparent border-none outline-none flex-1 text-green-400 focus:ring-0"
                    autoFocus
                    placeholder="_"
                />
            </div>
        </div>
    );
};

export default TerminalView;
