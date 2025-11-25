import React from 'react';
import { Heart, MessageCircle, Copy } from 'lucide-react';

const EXPLORE_ITEMS = Array.from({ length: 12 }).map((_, i) => ({
  id: i.toString(),
  image: `https://picsum.photos/seed/explore${i}/600/${i % 3 === 0 ? '800' : '600'}`, // Mixed aspect ratios
  likes: Math.floor(Math.random() * 1000),
  comments: Math.floor(Math.random() * 100),
  type: i % 3 === 0 ? 'video' : 'image'
}));

const ExploreGrid: React.FC = () => {
  return (
    <div className="mt-4 animate-enter">
      <div className="columns-2 md:columns-3 gap-4 space-y-4">
        {EXPLORE_ITEMS.map((item) => (
          <div key={item.id} className="relative group break-inside-avoid rounded-2xl overflow-hidden cursor-pointer">
             <img 
               src={item.image} 
               alt="Explore" 
               className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-110" 
             />
             
             {/* Overlay */}
             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6 backdrop-blur-sm">
                <div className="flex flex-col items-center text-white">
                   <Heart className="fill-white" size={24} />
                   <span className="font-bold text-sm">{item.likes}</span>
                </div>
                <div className="flex flex-col items-center text-white">
                   <MessageCircle className="fill-white" size={24} />
                   <span className="font-bold text-sm">{item.comments}</span>
                </div>
             </div>

             {/* Type Badge */}
             {item.type === 'video' && (
               <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md p-1.5 rounded-full">
                  <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-0.5"></div>
               </div>
             )}
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center">
         <button className="px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10 transition-all hover:scale-105">
            Load More Inspiration
         </button>
      </div>
    </div>
  );
};

export default ExploreGrid;