import React, { useState } from 'react';
import { Plus, Minus, Upload, Clock, Users } from 'lucide-react';
import { Ingredient, Recipe } from '../types';
import { addRecipePost } from '../services/postService';

interface RecipeFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ onSuccess, onCancel }) => {
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [caption, setCaption] = useState('');
  
  // Recipe fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cookingTime, setCookingTime] = useState<number>(15);
  const [servings, setServings] = useState<number>(2);
  const [mealType, setMealType] = useState<'main' | 'side' | 'base'>('main');
  const [storageType, setStorageType] = useState<'refrigerator' | 'freezer'>('refrigerator');
  const [storageDays, setStorageDays] = useState<number>(3);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [tags, setTags] = useState<string>('');
  
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', amount: '', unit: '' }
  ]);
  const [steps, setSteps] = useState<string[]>(['']);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: '' }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const updated = ingredients.map((ingredient, i) => 
      i === index ? { ...ingredient, [field]: value } : ingredient
    );
    setIngredients(updated);
  };

  const addStep = () => {
    setSteps([...steps, '']);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const updateStep = (index: number, value: string) => {
    const updated = steps.map((step, i) => i === index ? value : step);
    setSteps(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mediaFile || !title || ingredients.some(ing => !ing.name) || steps.some(step => !step.trim())) {
      alert('必要な項目をすべて入力してください');
      return;
    }

    if (steps.length > 5) {
      alert('手順は5ステップ以内で入力してください');
      return;
    }

    setIsSubmitting(true);

    try {
      const recipe: Omit<Recipe, 'id' | 'postId' | 'createdAt' | 'updatedAt'> = {
        title,
        description,
        ingredients: ingredients.filter(ing => ing.name.trim()),
        steps: steps.filter(step => step.trim()),
        cookingTime,
        servings,
        mealType,
        storageType,
        storageDays,
        difficulty,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      await addRecipePost(
        { mediaFile, mediaType, caption },
        recipe
      );
      
      onSuccess();
    } catch (error) {
      console.error('Error creating recipe:', error);
      alert('レシピの投稿に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">新しいレシピを投稿</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Media Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            料理の写真・動画 *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            {mediaPreview ? (
              <div className="relative">
                {mediaType === 'image' ? (
                  <img src={mediaPreview} alt="Preview" className="max-h-64 mx-auto rounded" />
                ) : (
                  <video src={mediaPreview} controls className="max-h-64 mx-auto rounded" />
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMediaFile(null);
                    setMediaPreview('');
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <Minus size={16} />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center">
                <Upload className="h-12 w-12 text-gray-400 mb-2" />
                <span className="text-gray-600">クリックして画像・動画をアップロード</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Recipe Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                レシピ名 *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="例: 鶏の照り焼き作り置き"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                レシピの説明
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="このレシピのポイントや特徴を簡単に説明..."
              />
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock size={16} className="inline mr-1" />
                  調理時間 (分)
                </label>
                <input
                  type="number"
                  value={cookingTime}
                  onChange={(e) => setCookingTime(Number(e.target.value))}
                  min="1"
                  max="120"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Users size={16} className="inline mr-1" />
                  何人分
                </label>
                <input
                  type="number"
                  value={servings}
                  onChange={(e) => setServings(Number(e.target.value))}
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  料理タイプ
                </label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as 'main' | 'side' | 'base')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
                >
                  <option value="main">メイン</option>
                  <option value="side">副菜</option>
                  <option value="base">味のベース</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  難易度
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
                >
                  <option value="easy">簡単</option>
                  <option value="medium">普通</option>
                  <option value="hard">難しい</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  保存方法
                </label>
                <select
                  value={storageType}
                  onChange={(e) => setStorageType(e.target.value as 'refrigerator' | 'freezer')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
                >
                  <option value="refrigerator">冷蔵</option>
                  <option value="freezer">冷凍</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                保存期間 (日)
              </label>
              <input
                type="number"
                value={storageDays}
                onChange={(e) => setStorageDays(Number(e.target.value))}
                min="1"
                max="30"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                タグ (カンマ区切り)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="例: 鶏肉, 甘辛, 和食"
              />
            </div>

            {/* Caption */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                投稿キャプション
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="投稿に添えるメッセージ..."
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Ingredients */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  材料 *
                </label>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="flex items-center text-sm text-secondary hover:text-secondary/80"
                >
                  <Plus size={16} className="mr-1" />
                  追加
                </button>
              </div>
              <div className="space-y-2">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="材料名"
                      value={ingredient.name}
                      onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="分量"
                      value={ingredient.amount}
                      onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="単位"
                      value={ingredient.unit}
                      onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                      className="w-16 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
                    />
                    {ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="px-2 py-2 text-red-500 hover:text-red-700"
                      >
                        <Minus size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  作り方 * (最大5ステップ)
                </label>
                <button
                  type="button"
                  onClick={addStep}
                  disabled={steps.length >= 5}
                  className="flex items-center text-sm text-secondary hover:text-secondary/80 disabled:text-gray-400"
                >
                  <Plus size={16} className="mr-1" />
                  追加
                </button>
              </div>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="flex-shrink-0 w-8 h-10 bg-secondary text-white rounded flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <textarea
                      placeholder={`手順${index + 1}を入力...`}
                      value={step}
                      onChange={(e) => updateStep(index, e.target.value)}
                      rows={2}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
                    />
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="flex-shrink-0 px-2 py-2 text-red-500 hover:text-red-700"
                      >
                        <Minus size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? '投稿中...' : 'レシピを投稿'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;