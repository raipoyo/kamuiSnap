import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as IconUser, Camera, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';
import { getCurrentUser, updateUserProfile, checkUsernameAvailability } from '../services/userService';

const SettingsPage: React.FC = () => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  useEffect(() => {
    if (!authUser) {
      navigate('/auth');
      return;
    }

    loadUserProfile();
  }, [authUser, navigate]);

  const loadUserProfile = async () => {
    try {
      const userData = await getCurrentUser();
      if (userData) {
        setUser(userData);
        setUsername(userData.username || '');
        setDisplayName(userData.displayName || '');
        setAvatarUrl(userData.avatarUrl || '');
      }
    } catch (err) {
      setError('プロフィールの読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const validateUsername = async (value: string) => {
    if (!value) {
      setUsernameError('ユーザーネームは必須です');
      return false;
    }

    if (value === user?.username) {
      setUsernameError(null);
      return true;
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(value)) {
      setUsernameError('3~20文字の半角英数字とアンダースコアのみ使用可能です');
      return false;
    }

    try {
      const isAvailable = await checkUsernameAvailability(value);
      if (!isAvailable) {
        setUsernameError('このユーザーネームは既に使用されています');
        return false;
      }
      setUsernameError(null);
      return true;
    } catch (err) {
      setUsernameError('ユーザーネームの確認に失敗しました');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const isUsernameValid = await validateUsername(username);
    if (!isUsernameValid) return;

    try {
      setIsSaving(true);
      setError(null);
      
      const updatedUser = await updateUserProfile(user.id, {
        username,
        displayName,
        avatarUrl
      });

      setUser(updatedUser);
      setSuccessMessage('プロフィールを更新しました');
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError('プロフィールの更新に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">プロフィール設定</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6">
          {successMessage}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img
                src={avatarUrl || 'https://images.pexels.com/photos/6963944/pexels-photo-6963944.jpeg'}
                alt="プロフィール画像"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
              />
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-secondary text-white p-2 rounded-full shadow-lg hover:bg-secondary/90 transition-colors"
                onClick={() => {/* TODO: Implement avatar upload */}}
              >
                <Camera size={16} />
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
              ユーザーネーム
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={(e) => validateUsername(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent ${
                usernameError ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="ユーザーネームを入力"
            />
            {usernameError && (
              <p className="mt-2 text-sm text-red-600">{usernameError}</p>
            )}
          </div>

          <div>
            <label htmlFor="displayName" className="block text-gray-700 font-medium mb-2">
              表示名
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              placeholder="表示名を入力"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-secondary text-white py-3 rounded-xl hover:bg-secondary/90 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>更新中...</span>
              </>
            ) : (
              <>
                <IconUser size={20} />
                <span>プロフィールを更新</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SettingsPage;