import React from 'react';
import { Post } from '../types';
import PostCard from './PostCard';

interface PostGridProps {
  posts: Post[];
  onPostUpdate: (updatedPost: Post) => void;
  onPostDelete: (postId: string) => void;
}

const PostGrid: React.FC<PostGridProps> = ({ posts, onPostUpdate, onPostDelete }) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">投稿がありません。</p>
        <p className="text-gray-400">最初の投稿者になりましょう！</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {posts.map(post => (
        <PostCard 
          key={post.id} 
          post={post} 
          onLike={onPostUpdate}
          onDelete={onPostDelete}
        />
      ))}
    </div>
  );
};

export default PostGrid;