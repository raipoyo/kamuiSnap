import React, { useState, useEffect } from 'react';
import { getDevCatEpisodes, getDevCats, getDevCatRecipes } from '../services/devCatService';
import { DevCatEpisode, DevCat } from '../types/devCat';
import { Recipe } from '../types';
import DevCatCard from '../components/DevCatCard';
import EpisodeCard from '../components/EpisodeCard';
import DevCatRecipeCard from '../components/DevCatRecipeCard';
import { Code, Coffee, Heart, Bug, Zap } from 'lucide-react';

const DevCatStoryPage: React.FC = () => {
  const [episodes, setEpisodes] = useState<DevCatEpisode[]>([]);
  const [cats, setCats] = useState<DevCat[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'episodes' | 'characters' | 'recipes'>('episodes');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [episodeData, catData, recipeData] = await Promise.all([
          getDevCatEpisodes(),
          getDevCats(),
          getDevCatRecipes()
        ]);
        setEpisodes(episodeData);
        setCats(catData);
        setRecipes(recipeData);
      } catch (error) {
        console.error('Error fetching dev cat data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredEpisodes = selectedCat 
    ? episodes.filter(episode => episode.characters.includes(selectedCat))
    : episodes;

  const getHungerEmoji = (level: number) => {
    const emojis = ['😸', '😺', '😋', '🤤', '😿'];
    return emojis[level - 1];
  };

  const getEpisodeIcon = (type: string) => {
    switch (type) {
      case 'debugging': return <Bug className="w-4 h-4" />;
      case 'learning': return <Code className="w-4 h-4" />;
      case 'teamwork': return <Heart className="w-4 h-4" />;
      case 'adventure': return <Zap className="w-4 h-4" />;
      default: return <Coffee className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto"></div>
        <p className="text-gray-500 mt-4">開発猫の物語を読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          🐱‍💻 お腹空いた開発猫の物語
        </h1>
        <p className="text-gray-600 text-lg">
          プログラミングと料理を愛する開発猫たちの日常
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-6 py-3 font-medium text-sm ${
            activeTab === 'episodes'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('episodes')}
        >
          📖 エピソード
        </button>
        <button
          className={`px-6 py-3 font-medium text-sm ${
            activeTab === 'characters'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('characters')}
        >
          🐱 キャラクター
        </button>
        <button
          className={`px-6 py-3 font-medium text-sm ${
            activeTab === 'recipes'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('recipes')}
        >
          🍽️ 開発猫レシピ
        </button>
      </div>

      {activeTab === 'episodes' && (
        <div>
          {/* Cat Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">キャラクター別フィルター</h3>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedCat === null
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setSelectedCat(null)}
              >
                すべて
              </button>
              {cats.map((cat) => (
                <button
                  key={cat.id}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCat === cat.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => setSelectedCat(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Episodes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEpisodes.map((episode) => (
              <div
                key={episode.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getEpisodeIcon(episode.episodeType)}
                    <span className="text-sm text-gray-500 capitalize">
                      {episode.episodeType}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl">{getHungerEmoji(episode.hungerLevel)}</span>
                    <span className="text-sm text-gray-500">
                      お腹空きレベル {episode.hungerLevel}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2">{episode.title}</h3>
                <p className="text-gray-600 mb-4">{episode.description}</p>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-500 mb-1">技術スタック:</p>
                  <div className="flex flex-wrap gap-1">
                    {episode.techStack.map((tech, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">登場キャラ:</p>
                  <div className="flex flex-wrap gap-1">
                    {episode.characters.map((catId) => {
                      const cat = cats.find(c => c.id === catId);
                      return cat ? (
                        <span
                          key={catId}
                          className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                        >
                          {cat.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>

                <EpisodeCard episode={episode} />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'characters' && (
        <div>
          <h2 className="text-2xl font-bold mb-6">開発猫キャラクター図鑑</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cats.map((cat) => (
              <DevCatCard key={cat.id} cat={cat} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'recipes' && (
        <div>
          <h2 className="text-2xl font-bold mb-6">開発猫のお腹を満たすレシピ集</h2>
          <p className="text-gray-600 mb-6">
            開発猫たちが作った、プログラミング中に食べたくなる美味しいレシピたち。
            お腹が空いた時の強い味方です！
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recipes.map((recipe) => (
              <DevCatRecipeCard 
                key={recipe.id} 
                recipe={recipe}
                devCatName="開発猫チーム"
                hungerLevel={4}
                codingContext="コーディング中の栄養補給"
              />
            ))}
          </div>
        </div>
      )}

      {episodes.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🐱‍💻</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            物語はまだ始まったばかり...
          </h3>
          <p className="text-gray-500">
            開発猫たちの新しい冒険をお待ちください！
          </p>
        </div>
      )}
    </div>
  );
};

export default DevCatStoryPage;