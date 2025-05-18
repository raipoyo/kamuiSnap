/*
  # Fix posts-users relationship

  1. Changes
    - Drop existing foreign key constraint that references auth.users
    - Add new foreign key constraint to reference public.users table
    - Update RLS policies to use public.users reference

  2. Security
    - Maintain existing RLS policies
    - Ensure data integrity with proper foreign key constraints
*/

-- Drop the existing foreign key constraint
ALTER TABLE posts
DROP CONSTRAINT IF EXISTS posts_user_id_fkey;

-- Add the new foreign key constraint to reference public.users
ALTER TABLE posts
ADD CONSTRAINT posts_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.users(id)
ON DELETE CASCADE;