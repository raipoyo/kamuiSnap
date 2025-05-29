import React, { useState } from 'react';
import { DevCatEpisode } from '../types/devCat';
import { ChevronDown, ChevronUp, Code, BookOpen, Lightbulb } from 'lucide-react';

interface EpisodeCardProps {
  episode: DevCatEpisode;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          <span className="font-medium">詳細を見る</span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          {episode.scenarios.map((scenario, index) => (
            <div key={scenario.id} className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-lg mb-2">
                シナリオ {index + 1}: {scenario.title}
              </h4>
              
              <div className="space-y-3 text-sm">
                <div>
                  <h5 className="font-medium text-gray-700 mb-1">状況:</h5>
                  <p className="text-gray-600">{scenario.situation}</p>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-700 mb-1">チャレンジ:</h5>
                  <p className="text-gray-600">{scenario.challenge}</p>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-700 mb-1">解決方法:</h5>
                  <p className="text-gray-600">{scenario.solution}</p>
                </div>
                
                {scenario.codeExample && (
                  <div>
                    <h5 className="font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Code className="w-4 h-4" />
                      コード例:
                    </h5>
                    <pre className="bg-gray-800 text-green-400 p-3 rounded-lg text-xs overflow-x-auto">
                      <code>{scenario.codeExample}</code>
                    </pre>
                  </div>
                )}
                
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <h5 className="font-medium text-yellow-800 mb-1 flex items-center gap-1">
                    <Lightbulb className="w-4 h-4" />
                    学び:
                  </h5>
                  <p className="text-yellow-700 text-sm">{scenario.lesson}</p>
                </div>
                
                <div className="bg-pink-50 p-3 rounded-lg">
                  <h5 className="font-medium text-pink-800 mb-1">😸 おもしろエピソード:</h5>
                  <p className="text-pink-700 text-sm">{scenario.funnyMoment}</p>
                </div>
              </div>
            </div>
          ))}

          {episode.relatedRecipes.length > 0 && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">
                🍽️ 関連レシピ ({episode.relatedRecipes.length}件)
              </h4>
              <p className="text-green-700 text-sm">
                このエピソードで開発猫たちが作った料理のレシピが見つかりました！
                レシピブックページで詳細をチェックしてみてください。
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EpisodeCard;