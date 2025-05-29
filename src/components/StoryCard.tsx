import React from 'react';
import { StoryEpisode } from '../types/story';
import { Calendar, Code, Tag } from 'lucide-react';

interface StoryCardProps {
  episode: StoryEpisode;
  onClick: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ episode, onClick }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6 border border-gray-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="text-sm text-gray-500 mb-2">
            エピソード #{episode.episodeNumber}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {episode.titleJa}
          </h3>
          <h4 className="text-md text-gray-600 mb-3">
            {episode.title}
          </h4>
        </div>
        <div className="text-2xl">🐱</div>
      </div>

      <div className="text-gray-700 mb-4 line-clamp-3">
        {episode.contentJa.substring(0, 150)}...
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <Calendar size={16} />
          <span>{formatDate(episode.publishedAt)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Code size={16} />
          <span>{episode.technicalElements.length} 技術要素</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {episode.tags.slice(0, 3).map((tag) => (
          <span 
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
          >
            <Tag size={12} />
            {tag}
          </span>
        ))}
        {episode.tags.length > 3 && (
          <span className="text-xs text-gray-500">
            +{episode.tags.length - 3} more
          </span>
        )}
      </div>
    </div>
  );
};

export default StoryCard;