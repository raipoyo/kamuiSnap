import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Film, Upload, Palette, Cat, Mountain, Loader2, AlertCircle } from 'lucide-react';
import { addPost } from '../services/postService';
import { Post } from '../types';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_VIDEO_DURATION = 180; // 3 minutes in seconds
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

const UploadPage: React.FC = () => {
  const [caption, setCaption] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [category, setCategory] = useState<Post['category']>('anime');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return 'ファイルサイズは50MB以下にしてください。';
    }

    if (file.type.startsWith('image/') && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return '対応していない画像形式です。JPEG、PNG、GIF、WebPのみ対応しています。';
    }

    if (file.type.startsWith('video/') && !ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return '対応していない動画形式です。MP4、WebM、QuickTimeのみ対応しています。';
    }

    return null;
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      if (file.type.startsWith('image/')) {
        setMediaType('image');
        const reader = new FileReader();
        reader.onload = () => {
          setMediaPreview(reader.result as string);
          setMediaFile(file);
          setIsProcessing(false);
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/')) {
        setMediaType('video');
        const url = URL.createObjectURL(file);
        
        // Create video element to check duration
        const video = document.createElement('video');
        video.preload = 'metadata';
        
        video.onloadedmetadata = () => {
          URL.revokeObjectURL(url);
          
          if (video.duration > MAX_VIDEO_DURATION) {
            setError('動画は3分以内にしてください。');
            setIsProcessing(false);
            return;
          }
          
          const reader = new FileReader();
          reader.onload = () => {
            setMediaPreview(reader.result as string);
            setMediaFile(file);
            setIsProcessing(false);
          };
          reader.readAsDataURL(file);
        };
        
        video.src = url;
      }
    } catch (err) {
      setError('ファイルの処理中にエラーが発生しました。');
      setIsProcessing(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mediaFile || !mediaType) {
      setError('ファイルを選択してください。');
      return;
    }
    
    if (!caption.trim()) {
      setError('キャプションを入力してください。');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await addPost({
        mediaFile,
        mediaType,
        category,
        caption: caption.trim()
      });
      
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/', { replace: true });
      }, 1500);
    } catch (err) {
      setError('アップロードに失敗しました。もう一度お試しください。');
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">新規投稿</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              メディアをアップロード
            </label>
            
            {!mediaPreview ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    const event = { target: { files: [file] } } as React.ChangeEvent<HTMLInputElement>;
                    handleFileChange(event);
                  }
                }}
              >
                {isProcessing ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 size={24} className="animate-spin text-secondary" />
                    <p className="text-gray-500">ファイルを処理中...</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center space-x-2 mb-3">
                      <Image size={24} className="text-gray-400" />
                      <Film size={24} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500">
                      クリックまたはドラッグ＆ドロップで<br />画像・動画をアップロード
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      対応形式: JPEG, PNG, GIF, WebP, MP4, WebM, QuickTime<br />
                      最大サイズ: 50MB, 動画は3分以内
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden">
                {mediaType === 'image' ? (
                  <img 
                    src={mediaPreview} 
                    alt="プレビュー" 
                    className="w-full aspect-[16/9] object-cover rounded-xl"
                  />
                ) : (
                  <video 
                    src={mediaPreview}
                    className="w-full aspect-[16/9] object-contain rounded-xl"
                    controls
                  />
                )}
                
                <button
                  type="button"
                  onClick={() => {
                    setMediaFile(null);
                    setMediaPreview(null);
                    setMediaType(null);
                  }}
                  className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept={[...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].join(',')}
              className="hidden"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              カテゴリー
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
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
                type="button"
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
                type="button"
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
          
          <div>
            <label htmlFor="caption" className="block text-gray-700 font-medium mb-2">
              キャプション
            </label>
            <textarea
              id="caption"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="キャプションを入力..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              rows={3}
            ></textarea>
          </div>
        </form>
      </div>
      
      <button
        onClick={handleSubmit}
        disabled={isSubmitting || isProcessing}
        className="fixed bottom-6 right-6 bg-secondary text-white h-14 px-6 rounded-full shadow-xl hover:bg-secondary/90 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <div className="flex items-center space-x-2">
            <Loader2 size={20} className="animate-spin" />
            <span>投稿中...</span>
          </div>
        ) : (
          <>
            <Upload size={20} />
            <span>投稿する</span>
          </>
        )}
      </button>

      {showToast && (
        <div className="fixed bottom-24 right-6 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg animate-fade-out">
          投稿が完了しました
        </div>
      )}
    </div>
  );
};

export default UploadPage;