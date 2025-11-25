
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, X, Volume2, VolumeX } from 'lucide-react';

// Reliable test track (Elephant's Dream - The Wires)
const DEMO_TRACK_URL = "https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3"; 

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
      const audio = new Audio(DEMO_TRACK_URL);
      audio.loop = true;
      audio.volume = 0.5;
      audio.crossOrigin = "anonymous";
      audioRef.current = audio;
      
      const updateProgress = () => {
          if (audio.duration) {
              setProgress((audio.currentTime / audio.duration) * 100);
          }
      };

      const handleError = (e: Event) => {
        const target = e.target as HTMLAudioElement;
        if (target.error) {
             console.warn("Audio Error Code:", target.error.code);
             console.warn("Audio Error Message:", target.error.message);
        }
        setIsPlaying(false);
      };

      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('error', handleError);
      
      return () => {
        audio.removeEventListener('timeupdate', updateProgress);
        audio.removeEventListener('error', handleError);
        audio.pause();
        audio.src = ''; 
        audioRef.current = null;
      };
  }, []);

  useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      const handlePlayState = async () => {
          try {
              if (isPlaying) {
                  await audio.play();
              } else {
                  audio.pause();
              }
          } catch (error) {
              console.log("Playback prevented (autoplay policy). User interaction required.");
              setIsPlaying(false);
          }
      };

      handlePlayState();
  }, [isPlaying]);

  const toggleMute = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!audioRef.current) return;
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      audioRef.current.muted = newMuted;
  };

  return (
    <>
      {/* Desktop View */}
      <div className={`hidden md:block fixed bottom-8 right-8 z-50 transition-all duration-500 ease-out ${isExpanded ? 'w-80' : 'w-14 h-14 hover:scale-105'}`}>
        <div className={`glass-panel overflow-hidden shadow-2xl border-white/10 ${isExpanded ? 'rounded-3xl p-4' : 'rounded-full h-full flex items-center justify-center cursor-pointer bg-indigo-600/10 hover:bg-indigo-600/20'}`}>
          {!isExpanded ? (
            <Music size={24} className={`text-indigo-400 ${isPlaying ? 'animate-pulse' : ''}`} onClick={() => setIsExpanded(true)} />
          ) : (
            <div className="flex flex-col gap-4">
               <div className="flex gap-3 items-center">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-fuchsia-600 to-purple-600 flex items-center justify-center ${isPlaying ? 'animate-pulse' : ''}`}>
                      <Music size={20} className="text-white/50" />
                  </div>
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setIsExpanded(false)}>
                     <h4 className="text-white font-bold text-sm truncate">The Wires</h4>
                     <p className="text-indigo-300 text-xs truncate">Elephant's Dream</p>
                  </div>
                  <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors">
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <button onClick={() => setIsExpanded(false)}><X size={16} className="text-gray-400 hover:text-white" /></button>
               </div>
               
               {/* Progress Bar */}
               <div className="w-full bg-white/10 rounded-full h-1 cursor-pointer group">
                  <div className="bg-indigo-500 h-full rounded-full relative transition-all duration-100" style={{ width: `${progress}%` }}>
                     <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
               </div>

               <div className="flex justify-center items-center gap-6">
                  <SkipBack size={20} className="text-gray-400 hover:text-white cursor-pointer hover:scale-110 transition-transform" />
                  <button onClick={() => setIsPlaying(!isPlaying)} className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                     {isPlaying ? <Pause size={20} className="text-black fill-black" /> : <Play size={20} className="text-black fill-black ml-0.5" />}
                  </button>
                  <SkipForward size={20} className="text-gray-400 hover:text-white cursor-pointer hover:scale-110 transition-transform" />
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Mini Pill (Top Right) */}
      <div className="md:hidden fixed top-4 right-16 z-40">
        <div 
          className={`glass-panel rounded-full h-9 flex items-center transition-all duration-300 backdrop-blur-xl border border-white/10 ${isPlaying ? 'w-36 px-2 gap-2' : 'w-9 justify-center'}`}
          onClick={() => setIsPlaying(!isPlaying)}
        >
           {isPlaying ? (
             <>
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               <span className="text-[10px] font-bold text-white truncate flex-1">The Wires</span>
               <Pause size={12} className="text-white" />
             </>
           ) : (
             <Music size={16} className="text-indigo-400" />
           )}
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;
