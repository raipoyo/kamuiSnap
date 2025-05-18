/*
  # Add Twitter integration fields to users table

  1. Changes
    - Add twitter_handle column to users table
    - Add twitter_access_token column to users table
    - Add twitter_refresh_token column to users table
    - Add twitter_expires_at column to users table

  2. Security
    - Only authenticated users can read/update their own Twitter data
*/

-- Add Twitter-related columns to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS twitter_handle text,
ADD COLUMN IF NOT EXISTS twitter_access_token text,
ADD COLUMN IF NOT EXISTS twitter_refresh_token text,
ADD COLUMN IF NOT EXISTS twitter_expires_at timestamptz;

-- Create policy for reading Twitter data
CREATE POLICY "Users can read their own Twitter data"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Create policy for updating Twitter data
CREATE POLICY "Users can update their own Twitter data"
ON users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);