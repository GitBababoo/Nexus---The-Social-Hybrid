
import React from 'react';
import { Plus, Compass } from 'lucide-react';
import { Server } from '../types';

interface ServerRailProps {
    activeServerId: string | null;
    onServerSelect: (id: string | null) => void;
}

const servers: Server[] = [
  { id: '1', name: 'Nexus Hub', icon: 'https://picsum.photos/seed/nexus/50', hasNotification: true },
  { id: '2', name: 'Dev Community', icon: 'https://picsum.photos/seed/dev/50' },
  { id: '3', name: 'Gaming Lounge', icon: 'https://picsum.photos/seed/game/50', hasNotification: true },
  { id: '4', name: 'Art Space', icon: 'https://picsum.photos/seed/art/50' },
  { id: '5', name: 'Music Vibe', icon: 'https://picsum.photos/seed/music/50' },
];

const ServerRail: React.FC<ServerRailProps> = ({ activeServerId, onServerSelect }) => {
  return (
    <div className="hidden md:flex flex-col items-center w-[72px] bg-[#050b14]/80 backdrop-blur-xl py-4 space-y-3 border-r border-white/5 h-full z-50 overflow-y-auto no-scrollbar shadow-2xl pt-safe">
      {/* Home Button (Resets to Main Feed) */}
      <div className="group relative">
         {activeServerId === null && (
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-r-full transition-all shadow-[0_0_10px_white]" />
         )}
        <div 
            onClick={() => onServerSelect(null)}
            className={`h-12 w-12 rounded-[24px] transition-all duration-300 flex items-center justify-center cursor-pointer shadow-lg overflow-hidden ${activeServerId === null ? 'bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[16px]' : 'bg-white/10 hover:rounded-[16px] hover:bg-indigo-600 group-hover:text-white text-gray-200'}`}
        >
            {activeServerId === null ? (
                 <img src="https://picsum.photos/seed/nexus-logo/50" alt="Home" className="w-full h-full object-cover opacity-80 hover:opacity-100" />
            ) : (
                <span className="font-bold text-lg font-display">N</span>
            )}
        </div>
      </div>

      <div className="w-8 h-[2px] bg-white/10 rounded-full mx-auto my-2" />

      {/* Server List */}
      {servers.map((server) => {
        const isActive = activeServerId === server.id;
        return (
            <div key={server.id} className="group relative w-full flex justify-center">
            {(server.hasNotification && !isActive) && (
                 <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2 bg-white rounded-r-full group-hover:h-5 transition-all" />
            )}
            {isActive && (
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-white rounded-r-full transition-all shadow-[0_0_10px_white]" />
            )}
            
            <img 
                src={server.icon} 
                alt={server.name}
                onClick={() => onServerSelect(server.id)}
                className={`h-12 w-12 transition-all duration-300 cursor-pointer object-cover ${isActive ? 'rounded-[16px] ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#050b14]' : 'rounded-[24px] group-hover:rounded-[16px] opacity-75 hover:opacity-100 hover:bg-white/10'}`}
            />
            
            {/* Tooltip */}
            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-black/90 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl backdrop-blur-md">
                {server.name}
                {/* Triangle */}
                <div className="absolute top-1/2 -translate-y-1/2 -left-1 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-white/10"></div>
            </div>
            </div>
        );
      })}

      {/* Actions */}
      <div className="mt-auto flex flex-col gap-3 pb-4">
        <div className="group h-12 w-12 bg-white/5 hover:bg-green-600 text-green-500 hover:text-white rounded-[24px] hover:rounded-[16px] transition-all duration-300 flex items-center justify-center cursor-pointer" title="Add Server">
            <Plus size={24} />
        </div>
        <div className="group h-12 w-12 bg-white/5 hover:bg-indigo-600 text-indigo-500 hover:text-white rounded-[24px] hover:rounded-[16px] transition-all duration-300 flex items-center justify-center cursor-pointer" title="Explore Public Servers">
            <Compass size={24} />
        </div>
      </div>
    </div>
  );
};

export default ServerRail;
