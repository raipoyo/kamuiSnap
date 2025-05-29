export interface Post {
  id: string;
  userId: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  category: 'anime' | 'animals' | 'landscape' | 'recipe';
  caption: string;
  createdAt: string;
  likes: number;
  user?: User;
  recipe?: Recipe;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Like {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
}

export interface Recipe {
  id: string;
  postId: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  steps: string[];
  cookingTime: number;
  servings: number;
  mealType: 'main' | 'side' | 'base';
  storageType: 'refrigerator' | 'freezer';
  storageDays: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}