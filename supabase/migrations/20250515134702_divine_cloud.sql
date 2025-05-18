/*
  # Create posts table with user relationships

  1. New Tables
    - `posts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `media_url` (text)
      - `media_type` (text)
      - `category` (text)
      - `caption` (text)
      - `created_at` (timestamp)
      - `likes` (integer)

  2. Security
    - Enable RLS on `posts` table
    - Add policies for CRUD operations
*/

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  media_url text NOT NULL,
  media_type text NOT NULL,
  category text NOT NULL,
  caption text NOT NULL,
  created_at timestamptz DEFAULT now(),
  likes integer DEFAULT 0
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all posts"
  ON posts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);