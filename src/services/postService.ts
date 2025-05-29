import { supabase } from './supabaseClient';
import { Post, Recipe } from '../types';

const uploadMedia = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError, data } = await supabase.storage
    .from('media')
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('media')
    .getPublicUrl(filePath);

  return publicUrl;
};

export const getPosts = async (): Promise<Post[]> => {
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      id,
      user_id,
      media_url,
      media_type,
      category,
      caption,
      created_at,
      likes,
      likes:likes(id, user_id)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Fetch user data for each post
  const postsWithUsers = await Promise.all((posts || []).map(async (post) => {
    const { data: userData } = await supabase
      .from('users')
      .select('id, username, display_name, avatar_url')
      .eq('id', post.user_id)
      .single();

    return {
      ...post,
      user: userData
    };
  }));

  return postsWithUsers;
};

export const getRecipePosts = async (): Promise<Post[]> => {
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      id,
      user_id,
      media_url,
      media_type,
      category,
      caption,
      created_at,
      likes,
      likes:likes(id, user_id),
      recipes(
        id,
        post_id,
        title,
        description,
        ingredients,
        steps,
        cooking_time,
        servings,
        meal_type,
        storage_type,
        storage_days,
        difficulty,
        tags,
        created_at,
        updated_at
      )
    `)
    .eq('category', 'recipe')
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Fetch user data and format recipe data for each post
  const postsWithUsersAndRecipes = await Promise.all((posts || []).map(async (post) => {
    const { data: userData } = await supabase
      .from('users')
      .select('id, username, display_name, avatar_url')
      .eq('id', post.user_id)
      .single();

    const recipe = post.recipes?.[0] ? {
      id: post.recipes[0].id,
      postId: post.recipes[0].post_id,
      title: post.recipes[0].title,
      description: post.recipes[0].description,
      ingredients: post.recipes[0].ingredients,
      steps: post.recipes[0].steps,
      cookingTime: post.recipes[0].cooking_time,
      servings: post.recipes[0].servings,
      mealType: post.recipes[0].meal_type,
      storageType: post.recipes[0].storage_type,
      storageDays: post.recipes[0].storage_days,
      difficulty: post.recipes[0].difficulty,
      tags: post.recipes[0].tags,
      createdAt: post.recipes[0].created_at,
      updatedAt: post.recipes[0].updated_at,
    } : undefined;

    return {
      ...post,
      user: userData,
      recipe
    };
  }));

  return postsWithUsersAndRecipes;
};

export const addRecipePost = async (
  post: { 
    mediaFile: File; 
    mediaType: 'image' | 'video'; 
    caption: string 
  },
  recipe: Omit<Recipe, 'id' | 'postId' | 'createdAt' | 'updatedAt'>
): Promise<Post> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Upload media file to storage
  const mediaUrl = await uploadMedia(post.mediaFile);

  // Create post record
  const { data: postData, error: postError } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      media_url: mediaUrl,
      media_type: post.mediaType,
      category: 'recipe',
      caption: post.caption
    })
    .select()
    .single();

  if (postError) throw postError;

  // Create recipe record
  const { data: recipeData, error: recipeError } = await supabase
    .from('recipes')
    .insert({
      post_id: postData.id,
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      cooking_time: recipe.cookingTime,
      servings: recipe.servings,
      meal_type: recipe.mealType,
      storage_type: recipe.storageType,
      storage_days: recipe.storageDays,
      difficulty: recipe.difficulty,
      tags: recipe.tags
    })
    .select()
    .single();

  if (recipeError) throw recipeError;

  return {
    ...postData,
    recipe: {
      id: recipeData.id,
      postId: recipeData.post_id,
      title: recipeData.title,
      description: recipeData.description,
      ingredients: recipeData.ingredients,
      steps: recipeData.steps,
      cookingTime: recipeData.cooking_time,
      servings: recipeData.servings,
      mealType: recipeData.meal_type,
      storageType: recipeData.storage_type,
      storageDays: recipeData.storage_days,
      difficulty: recipeData.difficulty,
      tags: recipeData.tags,
      createdAt: recipeData.created_at,
      updatedAt: recipeData.updated_at,
    }
  };
};

export const getRecentPosts = async (): Promise<Post[]> => {
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      id,
      user_id,
      media_url,
      media_type,
      category,
      caption,
      created_at,
      likes,
      likes:likes(id, user_id)
    `)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw error;

  // Fetch user data for each post
  const postsWithUsers = await Promise.all((posts || []).map(async (post) => {
    const { data: userData } = await supabase
      .from('users')
      .select('id, username, display_name, avatar_url')
      .eq('id', post.user_id)
      .single();

    return {
      ...post,
      user: userData
    };
  }));

  return postsWithUsers;
};

export const getRecipePosts = async (): Promise<Post[]> => {
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      id,
      user_id,
      media_url,
      media_type,
      category,
      caption,
      created_at,
      likes,
      likes:likes(id, user_id),
      recipes(
        id,
        post_id,
        title,
        description,
        ingredients,
        steps,
        cooking_time,
        servings,
        meal_type,
        storage_type,
        storage_days,
        difficulty,
        tags,
        created_at,
        updated_at
      )
    `)
    .eq('category', 'recipe')
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Fetch user data and format recipe data for each post
  const postsWithUsersAndRecipes = await Promise.all((posts || []).map(async (post) => {
    const { data: userData } = await supabase
      .from('users')
      .select('id, username, display_name, avatar_url')
      .eq('id', post.user_id)
      .single();

    const recipe = post.recipes?.[0] ? {
      id: post.recipes[0].id,
      postId: post.recipes[0].post_id,
      title: post.recipes[0].title,
      description: post.recipes[0].description,
      ingredients: post.recipes[0].ingredients,
      steps: post.recipes[0].steps,
      cookingTime: post.recipes[0].cooking_time,
      servings: post.recipes[0].servings,
      mealType: post.recipes[0].meal_type,
      storageType: post.recipes[0].storage_type,
      storageDays: post.recipes[0].storage_days,
      difficulty: post.recipes[0].difficulty,
      tags: post.recipes[0].tags,
      createdAt: post.recipes[0].created_at,
      updatedAt: post.recipes[0].updated_at,
    } : undefined;

    return {
      ...post,
      user: userData,
      recipe
    };
  }));

  return postsWithUsersAndRecipes;
};

export const addRecipePost = async (
  post: { 
    mediaFile: File; 
    mediaType: 'image' | 'video'; 
    caption: string 
  },
  recipe: Omit<Recipe, 'id' | 'postId' | 'createdAt' | 'updatedAt'>
): Promise<Post> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Upload media file to storage
  const mediaUrl = await uploadMedia(post.mediaFile);

  // Create post record
  const { data: postData, error: postError } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      media_url: mediaUrl,
      media_type: post.mediaType,
      category: 'recipe',
      caption: post.caption
    })
    .select()
    .single();

  if (postError) throw postError;

  // Create recipe record
  const { data: recipeData, error: recipeError } = await supabase
    .from('recipes')
    .insert({
      post_id: postData.id,
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      cooking_time: recipe.cookingTime,
      servings: recipe.servings,
      meal_type: recipe.mealType,
      storage_type: recipe.storageType,
      storage_days: recipe.storageDays,
      difficulty: recipe.difficulty,
      tags: recipe.tags
    })
    .select()
    .single();

  if (recipeError) throw recipeError;

  return {
    ...postData,
    recipe: {
      id: recipeData.id,
      postId: recipeData.post_id,
      title: recipeData.title,
      description: recipeData.description,
      ingredients: recipeData.ingredients,
      steps: recipeData.steps,
      cookingTime: recipeData.cooking_time,
      servings: recipeData.servings,
      mealType: recipeData.meal_type,
      storageType: recipeData.storage_type,
      storageDays: recipeData.storage_days,
      difficulty: recipeData.difficulty,
      tags: recipeData.tags,
      createdAt: recipeData.created_at,
      updatedAt: recipeData.updated_at,
    }
  };
};

export const addPost = async (
  post: { mediaFile: File; mediaType: 'image' | 'video'; category: Post['category']; caption: string }
): Promise<Post> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Upload media file to storage
  const mediaUrl = await uploadMedia(post.mediaFile);

  // Create post record
  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      media_url: mediaUrl,
      media_type: post.mediaType,
      category: post.category,
      caption: post.caption
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deletePost = async (postId: string): Promise<void> => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);

  if (error) throw error;
};

export const likePost = async (postId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('likes')
    .insert({
      user_id: user.id,
      post_id: postId
    });

  if (error) throw error;
};

export const unlikePost = async (postId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', user.id);

  if (error) throw error;
};

export const isPostLiked = async (postId: string): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single();

  if (error) return false;
  return !!data;
};

export const getWeeklyPopularPosts = async (
  mediaType?: 'image' | 'video',
  category?: Post['category']
): Promise<Post[]> => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  let query = supabase
    .from('posts')
    .select(`
      id,
      user_id,
      media_url,
      media_type,
      category,
      caption,
      created_at,
      likes,
      likes:likes(id, user_id)
    `)
    .gte('created_at', sevenDaysAgo.toISOString());

  if (mediaType) {
    query = query.eq('media_type', mediaType);
  }

  if (category) {
    query = query.eq('category', category);
  }

  const { data: posts, error } = await query.order('likes', { ascending: false });

  if (error) throw error;

  // Fetch user data for each post
  const postsWithUsers = await Promise.all((posts || []).map(async (post) => {
    const { data: userData } = await supabase
      .from('users')
      .select('id, username, display_name, avatar_url')
      .eq('id', post.user_id)
      .single();

    return {
      ...post,
      user: userData
    };
  }));

  return postsWithUsers;
};

export const getRecipePosts = async (): Promise<Post[]> => {
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      id,
      user_id,
      media_url,
      media_type,
      category,
      caption,
      created_at,
      likes,
      likes:likes(id, user_id),
      recipes(
        id,
        post_id,
        title,
        description,
        ingredients,
        steps,
        cooking_time,
        servings,
        meal_type,
        storage_type,
        storage_days,
        difficulty,
        tags,
        created_at,
        updated_at
      )
    `)
    .eq('category', 'recipe')
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Fetch user data and format recipe data for each post
  const postsWithUsersAndRecipes = await Promise.all((posts || []).map(async (post) => {
    const { data: userData } = await supabase
      .from('users')
      .select('id, username, display_name, avatar_url')
      .eq('id', post.user_id)
      .single();

    const recipe = post.recipes?.[0] ? {
      id: post.recipes[0].id,
      postId: post.recipes[0].post_id,
      title: post.recipes[0].title,
      description: post.recipes[0].description,
      ingredients: post.recipes[0].ingredients,
      steps: post.recipes[0].steps,
      cookingTime: post.recipes[0].cooking_time,
      servings: post.recipes[0].servings,
      mealType: post.recipes[0].meal_type,
      storageType: post.recipes[0].storage_type,
      storageDays: post.recipes[0].storage_days,
      difficulty: post.recipes[0].difficulty,
      tags: post.recipes[0].tags,
      createdAt: post.recipes[0].created_at,
      updatedAt: post.recipes[0].updated_at,
    } : undefined;

    return {
      ...post,
      user: userData,
      recipe
    };
  }));

  return postsWithUsersAndRecipes;
};

export const addRecipePost = async (
  post: { 
    mediaFile: File; 
    mediaType: 'image' | 'video'; 
    caption: string 
  },
  recipe: Omit<Recipe, 'id' | 'postId' | 'createdAt' | 'updatedAt'>
): Promise<Post> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Upload media file to storage
  const mediaUrl = await uploadMedia(post.mediaFile);

  // Create post record
  const { data: postData, error: postError } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      media_url: mediaUrl,
      media_type: post.mediaType,
      category: 'recipe',
      caption: post.caption
    })
    .select()
    .single();

  if (postError) throw postError;

  // Create recipe record
  const { data: recipeData, error: recipeError } = await supabase
    .from('recipes')
    .insert({
      post_id: postData.id,
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      cooking_time: recipe.cookingTime,
      servings: recipe.servings,
      meal_type: recipe.mealType,
      storage_type: recipe.storageType,
      storage_days: recipe.storageDays,
      difficulty: recipe.difficulty,
      tags: recipe.tags
    })
    .select()
    .single();

  if (recipeError) throw recipeError;

  return {
    ...postData,
    recipe: {
      id: recipeData.id,
      postId: recipeData.post_id,
      title: recipeData.title,
      description: recipeData.description,
      ingredients: recipeData.ingredients,
      steps: recipeData.steps,
      cookingTime: recipeData.cooking_time,
      servings: recipeData.servings,
      mealType: recipeData.meal_type,
      storageType: recipeData.storage_type,
      storageDays: recipeData.storage_days,
      difficulty: recipeData.difficulty,
      tags: recipeData.tags,
      createdAt: recipeData.created_at,
      updatedAt: recipeData.updated_at,
    }
  };
};

export const getMonthlyPopularPosts = async (
  mediaType?: 'image' | 'video',
  category?: Post['category']
): Promise<Post[]> => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  let query = supabase
    .from('posts')
    .select(`
      id,
      user_id,
      media_url,
      media_type,
      category,
      caption,
      created_at,
      likes,
      likes:likes(id, user_id)
    `)
    .gte('created_at', thirtyDaysAgo.toISOString());

  if (mediaType) {
    query = query.eq('media_type', mediaType);
  }

  if (category) {
    query = query.eq('category', category);
  }

  const { data: posts, error } = await query.order('likes', { ascending: false });

  if (error) throw error;

  // Fetch user data for each post
  const postsWithUsers = await Promise.all((posts || []).map(async (post) => {
    const { data: userData } = await supabase
      .from('users')
      .select('id, username, display_name, avatar_url')
      .eq('id', post.user_id)
      .single();

    return {
      ...post,
      user: userData
    };
  }));

  return postsWithUsers;
};

export const getRecipePosts = async (): Promise<Post[]> => {
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      id,
      user_id,
      media_url,
      media_type,
      category,
      caption,
      created_at,
      likes,
      likes:likes(id, user_id),
      recipes(
        id,
        post_id,
        title,
        description,
        ingredients,
        steps,
        cooking_time,
        servings,
        meal_type,
        storage_type,
        storage_days,
        difficulty,
        tags,
        created_at,
        updated_at
      )
    `)
    .eq('category', 'recipe')
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Fetch user data and format recipe data for each post
  const postsWithUsersAndRecipes = await Promise.all((posts || []).map(async (post) => {
    const { data: userData } = await supabase
      .from('users')
      .select('id, username, display_name, avatar_url')
      .eq('id', post.user_id)
      .single();

    const recipe = post.recipes?.[0] ? {
      id: post.recipes[0].id,
      postId: post.recipes[0].post_id,
      title: post.recipes[0].title,
      description: post.recipes[0].description,
      ingredients: post.recipes[0].ingredients,
      steps: post.recipes[0].steps,
      cookingTime: post.recipes[0].cooking_time,
      servings: post.recipes[0].servings,
      mealType: post.recipes[0].meal_type,
      storageType: post.recipes[0].storage_type,
      storageDays: post.recipes[0].storage_days,
      difficulty: post.recipes[0].difficulty,
      tags: post.recipes[0].tags,
      createdAt: post.recipes[0].created_at,
      updatedAt: post.recipes[0].updated_at,
    } : undefined;

    return {
      ...post,
      user: userData,
      recipe
    };
  }));

  return postsWithUsersAndRecipes;
};

export const addRecipePost = async (
  post: { 
    mediaFile: File; 
    mediaType: 'image' | 'video'; 
    caption: string 
  },
  recipe: Omit<Recipe, 'id' | 'postId' | 'createdAt' | 'updatedAt'>
): Promise<Post> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Upload media file to storage
  const mediaUrl = await uploadMedia(post.mediaFile);

  // Create post record
  const { data: postData, error: postError } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      media_url: mediaUrl,
      media_type: post.mediaType,
      category: 'recipe',
      caption: post.caption
    })
    .select()
    .single();

  if (postError) throw postError;

  // Create recipe record
  const { data: recipeData, error: recipeError } = await supabase
    .from('recipes')
    .insert({
      post_id: postData.id,
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      cooking_time: recipe.cookingTime,
      servings: recipe.servings,
      meal_type: recipe.mealType,
      storage_type: recipe.storageType,
      storage_days: recipe.storageDays,
      difficulty: recipe.difficulty,
      tags: recipe.tags
    })
    .select()
    .single();

  if (recipeError) throw recipeError;

  return {
    ...postData,
    recipe: {
      id: recipeData.id,
      postId: recipeData.post_id,
      title: recipeData.title,
      description: recipeData.description,
      ingredients: recipeData.ingredients,
      steps: recipeData.steps,
      cookingTime: recipeData.cooking_time,
      servings: recipeData.servings,
      mealType: recipeData.meal_type,
      storageType: recipeData.storage_type,
      storageDays: recipeData.storage_days,
      difficulty: recipeData.difficulty,
      tags: recipeData.tags,
      createdAt: recipeData.created_at,
      updatedAt: recipeData.updated_at,
    }
  };
};