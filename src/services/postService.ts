import { supabase } from './supabaseClient';
import { Post } from '../types';

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