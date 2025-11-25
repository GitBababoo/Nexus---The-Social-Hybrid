
import React from 'react';
import { Plus } from 'lucide-react';
import { Story } from '../types';
import { useAppStore } from '../store/useAppStore';

interface StoriesProps {
    onStoryClick: (storyId: string) => void;
    onCreateStory: () => void;
}

const Stories: React.FC<StoriesProps> = ({ onStoryClick, onCreateStory }) => {
  const { currentUser } = useAppStore();
  
  const stories = [
    { id: 'user1', name: 'Sarah', img: 'https://picsum.photos/seed/sarah/100' },
    { id: 'user2', name: 'Mike', img: 'https://picsum.photos/seed/mike/100' },
    { id: 'user3', name: 'Jessica', img: 'https://picsum.photos/seed/jessica/100' },
    { id: 'user4', name: 'Devon', img: 'https://picsum.photos/seed/devon/100' },
    { id: 'user5', name: 'Arin', img: 'https://picsum.photos/seed/arin/100' },
    { id: 'user6', name: 'Techie', img: 'https://picsum.photos/seed/tech/100' },
    { id: 'user7', name: 'Gamer', img: 'https://picsum.photos/seed/gamer/100' },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 pt-2">
      {/* My Story (Create) */}
      <div className="flex flex-col items-center min-w-[72px] cursor-pointer group" onClick={onCreateStory}>
        <div className="relative w-[68px] h-[68px]">
          <img 
            src={currentUser?.avatar || "https://picsum.photos/seed/me/100"} 
            className="w-full h-full rounded-2xl border-2 border-gray-800 object-cover group-hover:opacity-80 transition-opacity"
            alt="My Story"
          />
          <div className="absolute -bottom-2 -right-2 bg-indigo-600 rounded-full p-1 border-2 border-gray-900 shadow-lg group-hover:scale-110 transition-transform">
            <Plus size={14} className="text-white" />
          </div>
        </div>
        <span className="text-xs text-gray-400 mt-2">Your Story</span>
      </div>

      {/* Other Stories */}
      {stories.map((story, i) => (
        <div key={story.id} className="flex flex-col items-center min-w-[72px] cursor-pointer group" onClick={() => onStoryClick(story.id)}>
          <div className="w-[72px] h-[72px] rounded-2xl bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[2px] group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-[14px] border-2 border-gray-900 bg-gray-900 overflow-hidden relative">
               <img src={story.img} alt={story.name} className="w-full h-full object-cover" />
               {i === 2 && (
                   <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-[8px] text-white font-bold text-center py-0.5">LIVE</div>
               )}
            </div>
          </div>
          <span className="text-xs text-gray-300 mt-2">{story.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Stories;
