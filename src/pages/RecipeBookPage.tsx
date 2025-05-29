import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, ChefHat, Calendar, Filter, Search } from 'lucide-react';
import { Post, Recipe } from '../types';
import { getRecipePosts } from '../services/postService';
import { useAuth } from '../hooks/useAuth';

const RecipeBookPage: React.FC = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const recipePosts = await getRecipePosts();
      setRecipes(recipePosts);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipes = recipes.filter((post) => {
    const recipe = post.recipe;
    if (!recipe) return false;

    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMealType = selectedMealType === 'all' || recipe.mealType === selectedMealType;
    const matchesDifficulty = selectedDifficulty === 'all' || recipe.difficulty === selectedDifficulty;

    return matchesSearch && matchesMealType && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '簡単';
      case 'medium': return '普通';
      case 'hard': return '難しい';
      default: return difficulty;
    }
  };

  const getMealTypeText = (mealType: string) => {
    switch (mealType) {
      case 'main': return 'メイン';
      case 'side': return '副菜';
      case 'base': return '味のベース';
      default: return mealType;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">レシピを読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">料理本</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          週末の2時間で、平日の夕食が楽になる作り置きレシピ集
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <ChefHat size={16} />
            <span>5ステップ以内のシンプルレシピ</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>保存期間表示</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>時短調理</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="レシピを検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">フィルター:</span>
          </div>
          
          <select
            value={selectedMealType}
            onChange={(e) => setSelectedMealType(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-secondary focus:border-transparent"
          >
            <option value="all">すべての料理</option>
            <option value="main">メイン</option>
            <option value="side">副菜</option>
            <option value="base">味のベース</option>
          </select>
          
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-secondary focus:border-transparent"
          >
            <option value="all">すべての難易度</option>
            <option value="easy">簡単</option>
            <option value="medium">普通</option>
            <option value="hard">難しい</option>
          </select>
        </div>
      </div>

      {/* Recipe Grid */}
      {filteredRecipes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            {searchTerm || selectedMealType !== 'all' || selectedDifficulty !== 'all'
              ? '条件に合うレシピが見つかりませんでした'
              : 'まだレシピが投稿されていません'}
          </div>
          {user && (
            <Link
              to="/upload"
              className="inline-flex items-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
            >
              <ChefHat size={16} className="mr-2" />
              最初のレシピを投稿する
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((post) => {
            const recipe = post.recipe!;
            return (
              <div key={post.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={post.mediaUrl}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                      {getDifficultyText(recipe.difficulty)}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-lg text-gray-900 truncate">
                    {recipe.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm h-10 overflow-hidden">
                    {recipe.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{recipe.cookingTime}分</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span>{recipe.servings}人分</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                      {getMealTypeText(recipe.mealType)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {recipe.storageType === 'refrigerator' ? '冷蔵' : '冷凍'} {recipe.storageDays}日保存
                    </span>
                  </div>
                  
                  {recipe.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {recipe.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs">
                          #{tag}
                        </span>
                      ))}
                      {recipe.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{recipe.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Call to Action */}
      {user && filteredRecipes.length > 0 && (
        <div className="text-center py-8">
          <Link
            to="/upload"
            className="inline-flex items-center px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
          >
            <ChefHat size={20} className="mr-2" />
            新しいレシピを投稿する
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecipeBookPage;