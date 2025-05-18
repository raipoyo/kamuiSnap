import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Image, Film, Palette, Cat, Mountain } from 'lucide-react';
import { getWeeklyPopularPosts, getMonthlyPopularPosts } from '../services/postService';
import { Post } from '../types';
import PostGrid from '../components/PostGrid';

const RankingPage: React.FC = () => {
  const { period } = useParams<{ period: string }>();
  const navigate = useNavigate();
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [category, setCategory] = useState<Post['category']>('anime');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        let data: Post[];
        
        if (period === 'weekly') {
          data = await getWeeklyPopularPosts(mediaType, category);
        } else if (period === 'monthly') {
          data = await getMonthlyPopularPosts(mediaType, category);
        } else {
          throw new Error('Invalid period');
        }
        
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [period, mediaType, category]);
  
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
  
  const title = period === 'weekly' ? '週間人気投稿' : '月間人気投稿';
  const description = period === 'weekly' 
    ? '過去7日間で最も「いいね」された投稿' 
    : '過去30日間で最も「いいね」された投稿';
  
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-500">{description}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm mb-8">
        <div className="flex border-b">
          <button
            onClick={() => navigate('/ranking/weekly')}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              period === 'weekly'
                ? 'text-secondary border-b-2 border-secondary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            週間ランキング
          </button>
          <button
            onClick={() => navigate('/ranking/monthly')}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              period === 'monthly'
                ? 'text-secondary border-b-2 border-secondary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            月間ランキング
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setMediaType('image')}
            className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
              mediaType === 'image'
                ? 'bg-secondary/10 text-secondary'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Image size={20} />
            <span>画像部門</span>
          </button>
          <button
            onClick={() => setMediaType('video')}
            className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
              mediaType === 'video'
                ? 'bg-secondary/10 text-secondary'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Film size={20} />
            <span>動画部門</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => setCategory('anime')}
            className={`py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
              category === 'anime'
                ? 'bg-secondary/10 text-secondary'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Palette size={20} />
            <span>アニメ</span>
          </button>
          <button
            onClick={() => setCategory('animals')}
            className={`py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
              category === 'animals'
                ? 'bg-secondary/10 text-secondary'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Cat size={20} />
            <span>動物</span>
          </button>
          <button
            onClick={() => setCategory('landscape')}
            className={`py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
              category === 'landscape'
                ? 'bg-secondary/10 text-secondary'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Mountain size={20} />
            <span>風景</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading posts...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
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

export default RankingPage;