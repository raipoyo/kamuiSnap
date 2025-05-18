import React from 'react';
import { Heart, Play, Trash2 } from 'lucide-react';
import { Post } from '../types';
import { likePost, isPostLiked, deletePost } from '../services/postService';
import { formatDate } from '../utils/formatDate';

interface PostCardProps {
  post: Post;
  onLike: (updatedPost: Post) => void;
  onDelete: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onDelete }) => {
  const [liked, setLiked] = React.useState(isPostLiked(post.id));
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const handleLike = () => {
    if (liked) return;
    
    const updatedPost = likePost(post.id);
    if (updatedPost) {
      setLiked(true);
      onLike(updatedPost);
    }
  };

  const handleDelete = () => {
    deletePost(post.id);
    onDelete(post.id);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-1">
      <div className="relative aspect-[16/9]">
        {post.mediaType === 'image' ? (
          <img 
            src={post.mediaUrl} 
            alt={post.caption || '投稿画像'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="relative w-full h-full bg-gray-900">
            <video 
              src={post.mediaUrl}
              className="w-full h-full object-contain"
              controls
              poster={post.mediaUrl + '#t=0.1'}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Play 
                size={48} 
                className="text-white opacity-80"
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <p className="text-gray-800 line-clamp-2 mb-3">{post.caption}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">{formatDate(post.createdAt)}</span>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-1 transition-colors group ${
                liked ? 'text-accent cursor-default' : 'text-gray-600 hover:text-accent'
              }`}
              tabIndex={0}
              aria-pressed={liked}
              disabled={liked}
            >
              <Heart 
                size={20} 
                className={`transition-transform group-active:animate-scale-like ${
                  liked ? 'fill-accent' : ''
                }`}
              />
              <span>{post.likes}</span>
            </button>

            {showDeleteConfirm ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-600 text-sm font-medium"
                >
                  削除する
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-gray-500 hover:text-gray-600 text-sm"
                >
                  キャンセル
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label="投稿を削除"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;