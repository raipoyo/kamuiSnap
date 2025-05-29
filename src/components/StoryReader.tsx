import React, { useState } from 'react';
import { StoryEpisode, Character } from '../types/story';
import { ArrowLeft, Calendar, Code, Tag, User } from 'lucide-react';

interface StoryReaderProps {
  episode: StoryEpisode;
  character: Character;
  onBack: () => void;
}

const StoryReader: React.FC<StoryReaderProps> = ({ episode, character, onBack }) => {
  const [showEnglish, setShowEnglish] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content: string) => {
    // Handle code blocks
    const parts = content.split(/```(\w+)?\n([\s\S]*?)```/);
    return parts.map((part, index) => {
      if (index % 3 === 0) {
        // Regular text
        return part.split('\n').map((line, lineIndex) => (
          <p key={lineIndex} className="mb-4">{line}</p>
        ));
      } else if (index % 3 === 2) {
        // Code block
        const language = parts[index - 1] || 'javascript';
        return (
          <pre key={index} className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 overflow-x-auto">
            <code className={`language-${language}`}>
              {part}
            </code>
          </pre>
        );
      }
      return null;
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft size={20} />
          物語一覧に戻る
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-2">
                エピソード #{episode.episodeNumber}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {showEnglish ? episode.title : episode.titleJa}
              </h1>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <User size={16} />
                <span>{character.nameJa} ({character.name})</span>
              </div>
            </div>
            <div className="text-4xl">🐱</div>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{formatDate(episode.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Code size={16} />
              <span>{episode.technicalElements.length} 技術要素</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-wrap gap-2">
              {episode.tags.map((tag) => (
                <span 
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  <Tag size={12} />
                  {tag}
                </span>
              ))}
            </div>
            
            <button
              onClick={() => setShowEnglish(!showEnglish)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
            >
              {showEnglish ? '日本語' : 'English'}
            </button>
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="prose prose-lg max-w-none">
          {formatContent(showEnglish ? episode.content : episode.contentJa)}
        </div>
      </div>

      {/* Technical Elements */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Code size={24} />
          登場技術要素
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {episode.technicalElements.map((element, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg">
              <span className="font-mono text-sm text-gray-800">{element}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Character Info */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <User size={24} />
          キャラクター情報
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">スキル</h4>
            <div className="flex flex-wrap gap-2">
              {character.skills.map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">性格</h4>
            <div className="flex flex-wrap gap-2">
              {character.personality.map((trait, index) => (
                <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded">
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold text-gray-900 mb-2">必殺技</h4>
          <p className="text-gray-700">{character.specialMove}</p>
        </div>
      </div>
    </div>
  );
};

export default StoryReader;