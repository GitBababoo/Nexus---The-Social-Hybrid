
import React, { useCallback, useRef, useState } from 'react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import PostCard from './PostCard';
import { Post } from '../types';
import { useAppStore } from '../store/useAppStore';
import { Sparkles, RefreshCw, ArrowUp, Download } from 'lucide-react';

interface FeedProps {
  onUserClick: (user: any) => void;
  onQuote: (post: Post) => void;
  onTagClick: (tag: string) => void;
}

const Feed: React.FC<FeedProps> = ({ onUserClick, onQuote, onTagClick }) => {
  const { feed, toggleLikePost, refreshFeed, isFeedRefreshing, hasNewPosts } = useAppStore();
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [isAtTop, setIsAtTop] = useState(true);

  const handleInteraction = useCallback((type: string, postId: string) => {
    if (type === 'like') toggleLikePost(postId);
  }, []);

  const scrollToTop = () => {
      virtuosoRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      // Immediately refresh if user clicks floating pill
      refreshFeed();
  };

  const Header = () => (
    <div className="flex flex-col pt-4 pb-2 px-2 md:px-0">
       <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="text-xl font-black text-white font-display tracking-tight flex items-center gap-2">
                Your Feed <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            </h3>
            <button onClick={() => refreshFeed()} className={`p-2 rounded-full hover:bg-white/10 text-gray-400 ${isFeedRefreshing ? 'animate-spin text-indigo-400' : ''}`}>
                <RefreshCw size={18} />
            </button>
       </div>
       {/* Inline Load Button (Only if at Top) */}
       {hasNewPosts && isAtTop && (
           <button onClick={() => refreshFeed()} className="w-full py-3 mb-4 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-bold rounded-xl border border-indigo-500/20 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
               <Download size={16} /> New updates available
           </button>
       )}
    </div>
  );

  return (
    <div className="relative h-full min-h-screen">
        {/* Floating Pill (Only if NOT at Top) */}
        <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-40 transition-all duration-500 ease-out ${hasNewPosts && !isAtTop ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'}`}>
            <button onClick={scrollToTop} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-full shadow-lg font-bold text-xs hover:scale-105 active:scale-95 border border-white/10">
                <ArrowUp size={14} /> New Posts
            </button>
        </div>

        {feed.length === 0 && !isFeedRefreshing ? (
            <div className="h-[50vh] flex flex-col items-center justify-center text-center opacity-60">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse"><Sparkles className="text-indigo-500" size={32} /></div>
                <p className="text-gray-300 font-bold text-lg">The void is silent.</p>
                <button onClick={() => refreshFeed()} className="mt-4 text-indigo-400 text-sm hover:text-white">Refresh Signal</button>
            </div>
        ) : (
            <Virtuoso
                ref={virtuosoRef}
                useWindowScroll
                data={feed}
                atTopStateChange={setIsAtTop}
                overscan={1000} 
                components={{ Header, Footer: () => <div className="h-32 text-center py-8 opacity-50 text-xs text-gray-600">End of Line</div> }}
                itemContent={(index, post) => (
                    <div className="pb-6 md:pb-8 px-2 md:px-0 animate-enter">
                        <PostCard post={post} onUserClick={onUserClick} onInteraction={(t) => handleInteraction(t, post.id)} onQuote={onQuote} onTagClick={onTagClick} />
                    </div>
                )}
            />
        )}
    </div>
  );
};

export default Feed;
