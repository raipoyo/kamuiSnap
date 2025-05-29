import React, { useState } from 'react';
import { Book, User, Sparkles } from 'lucide-react';
import { episodes, mainCharacter, storyMetadata } from '../data/devCatStory';
import StoryCard from '../components/StoryCard';
import StoryReader from '../components/StoryReader';
import { StoryEpisode } from '../types/story';

const StoryPage: React.FC = () => {
  const [selectedEpisode, setSelectedEpisode] = useState<StoryEpisode | null>(null);

  if (selectedEpisode) {
    return (
      <StoryReader
        episode={selectedEpisode}
        character={mainCharacter}
        onBack={() => setSelectedEpisode(null)}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">🐱</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {storyMetadata.titleJa}
        </h1>
        <h2 className="text-xl text-gray-600 mb-6">
          {storyMetadata.title}
        </h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          {storyMetadata.descriptionJa}
        </p>
      </div>

      {/* Character Profile */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <User size={28} />
          メインキャラクター
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="text-center mb-6">
              <div className="text-8xl mb-4">🐱</div>
              <h4 className="text-2xl font-bold text-gray-900">
                {mainCharacter.nameJa}
              </h4>
              <p className="text-gray-600">({mainCharacter.name})</p>
            </div>
            
            <div className="mb-6">
              <h5 className="font-semibold text-gray-900 mb-2">必殺技</h5>
              <p className="text-gray-700 bg-yellow-50 p-3 rounded-lg">
                {mainCharacter.specialMove}
              </p>
            </div>
          </div>
          
          <div>
            <div className="mb-6">
              <h5 className="font-semibold text-gray-900 mb-3">スキル</h5>
              <div className="grid grid-cols-2 gap-2">
                {mainCharacter.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-2 bg-blue-100 text-blue-800 text-sm rounded-lg text-center"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">性格</h5>
              <div className="space-y-2">
                {mainCharacter.personality.map((trait, index) => (
                  <div 
                    key={index}
                    className="px-3 py-2 bg-purple-100 text-purple-800 text-sm rounded-lg"
                  >
                    {trait}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Episodes */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Book size={28} />
          エピソード一覧
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {episodes.map((episode) => (
            <StoryCard
              key={episode.id}
              episode={episode}
              onClick={() => setSelectedEpisode(episode)}
            />
          ))}
        </div>
      </div>

      {/* Coming Soon */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center">
        <div className="text-4xl mb-4">✨</div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
          <Sparkles size={24} />
          続きをお楽しみに！
        </h3>
        <p className="text-gray-700">
          カムイの新しい冒険は開発中です。お腹を空かせた開発猫の次なる挑戦をお待ちください。
        </p>
      </div>
    </div>
  );
};

export default StoryPage;