import React from 'react';
import { Recipe } from '../types';
import { Clock, Users, ChefHat, Cat } from 'lucide-react';

interface DevCatRecipeCardProps {
  recipe: Recipe;
  devCatName?: string;
  hungerLevel?: number;
  codingContext?: string;
}

const DevCatRecipeCard: React.FC<DevCatRecipeCardProps> = ({ 
  recipe, 
  devCatName, 
  hungerLevel,
  codingContext 
}) => {
  const getHungerEmoji = (level?: number) => {
    if (!level) return '😸';
    const emojis = ['😸', '😺', '😋', '🤤', '😿'];
    return emojis[level - 1];
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '簡単';
      case 'medium': return '普通';
      case 'hard': return '難しい';
      default: return difficulty;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500">
      {/* Developer Cat Context Header */}
      {(devCatName || hungerLevel || codingContext) && (
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Cat className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-800">
              {devCatName ? `${devCatName}の` : '開発猫の'}レシピ
            </span>
            {hungerLevel && (
              <span className="text-2xl ml-auto">{getHungerEmoji(hungerLevel)}</span>
            )}
          </div>
          {codingContext && (
            <p className="text-blue-700 text-sm">
              💻 開発シーン: {codingContext}
            </p>
          )}
        </div>
      )}

      {/* Recipe Content */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{recipe.title}</h3>
        <p className="text-gray-600 text-sm">{recipe.description}</p>
      </div>

      {/* Recipe Stats */}
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{recipe.cookingTime}分</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{recipe.servings}人分</span>
        </div>
        <div className="flex items-center gap-1">
          <ChefHat className="w-4 h-4" />
          <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
            {getDifficultyLabel(recipe.difficulty)}
          </span>
        </div>
      </div>

      {/* Ingredients */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-700 mb-2">材料 ({recipe.servings}人分)</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          {recipe.ingredients.map((ingredient, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-600">{ingredient.name}</span>
              <span className="text-gray-800 font-medium">
                {ingredient.amount} {ingredient.unit}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Cooking Steps */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-700 mb-2">作り方</h4>
        <ol className="space-y-2">
          {recipe.steps.map((step, index) => (
            <li key={index} className="flex text-sm">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-0.5">
                {index + 1}
              </span>
              <span className="text-gray-700">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Tags */}
      {recipe.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {recipe.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Storage Info */}
      <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
        <span className="font-medium">保存:</span> {recipe.storageType === 'refrigerator' ? '冷蔵' : '冷凍'} 
        {recipe.storageDays}日間
      </div>
    </div>
  );
};

export default DevCatRecipeCard;