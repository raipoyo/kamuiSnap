import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getRecentPosts } from '../services/postService';
import { Post } from '../types';
import PostGrid from '../components/PostGrid';

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const recentPosts = await getRecentPosts();
        setPosts(recentPosts);
      } catch (error) {
        console.error('Error fetching recent posts:', error);
        setError('投稿の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [location.key]); // Refetch when navigation occurs
  
  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  const handlePostDelete = (postId: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">最新の投稿</h2>
      
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto"></div>
          <p className="text-gray-500 mt-4">投稿を読み込み中...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {!loading && !error && (
        <PostGrid 
          posts={posts} 
          onPostUpdate={handlePostUpdate}
          onPostDelete={handlePostDelete}
        />
      )}
    </div>
  );
};

export default HomePage;