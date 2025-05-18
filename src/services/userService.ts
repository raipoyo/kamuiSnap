import { supabase } from './supabaseClient';
import { User } from '../types';

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return data;
};

export const updateUserProfile = async (
  userId: string, 
  updates: Partial<Pick<User, 'username' | 'displayName' | 'avatarUrl'>>
): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .update({
      username: updates.username,
      display_name: updates.displayName,
      avatar_url: updates.avatarUrl
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  const { count, error } = await supabase
    .from('users')
    .select('id', { count: 'exact' })
    .eq('username', username);

  if (error) throw error;
  return count === 0;
};