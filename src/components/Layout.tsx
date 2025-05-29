import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Camera, Home, Trophy, Settings, LogOut, BookOpen, Cat } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-base flex">
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-6 space-y-6 fixed h-full">
        <h1 className="text-xl font-bold text-secondary">KamuiSnap</h1>
        
        <div className="flex flex-col space-y-4">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive ? 'bg-secondary/10 text-secondary' : 'text-gray-700 hover:bg-gray-50'
              }`
            }
            end
          >
            <Home size={24} />
            <span>ホーム</span>
          </NavLink>
          
          <NavLink 
            to="/recipe-book" 
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive ? 'bg-secondary/10 text-secondary' : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <BookOpen size={24} />
            <span>料理本</span>
          </NavLink>

          <NavLink 
            to="/dev-cat-story" 
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive ? 'bg-secondary/10 text-secondary' : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <Cat size={24} />
            <span>開発猫物語</span>
          </NavLink>
          
          <NavLink 
            to="/upload" 
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive ? 'bg-secondary/10 text-secondary' : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <Camera size={24} />
            <span>投稿</span>
          </NavLink>
          
          <NavLink 
            to="/ranking/weekly" 
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive || location.pathname.includes('/ranking') 
                  ? 'bg-secondary/10 text-secondary' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <Trophy size={24} />
            <span>ランキング</span>
          </NavLink>

          {user && (
            <NavLink 
              to="/settings" 
              className={({ isActive }) => 
                `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive ? 'bg-secondary/10 text-secondary' : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <Settings size={24} />
              <span>設定</span>
            </NavLink>
          )}
        </div>

        {user && (
          <div className="mt-auto">
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors w-full"
            >
              <LogOut size={24} />
              <span>ログアウト</span>
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex flex-col items-center py-3 px-6 ${
                isActive ? 'text-secondary' : 'text-gray-700'
              }`
            }
            end
          >
            <Home size={24} />
            <span className="text-xs mt-1">ホーム</span>
          </NavLink>
          
          <NavLink 
            to="/recipe-book" 
            className={({ isActive }) => 
              `flex flex-col items-center py-3 px-4 ${
                isActive ? 'text-secondary' : 'text-gray-700'
              }`
            }
          >
            <BookOpen size={20} />
            <span className="text-xs mt-1">料理本</span>
          </NavLink>

          <NavLink 
            to="/dev-cat-story" 
            className={({ isActive }) => 
              `flex flex-col items-center py-3 px-4 ${
                isActive ? 'text-secondary' : 'text-gray-700'
              }`
            }
          >
            <Cat size={20} />
            <span className="text-xs mt-1">開発猫</span>
          </NavLink>
          
          <NavLink 
            to="/upload" 
            className={({ isActive }) => 
              `flex flex-col items-center py-3 px-4 ${
                isActive ? 'text-secondary' : 'text-gray-700'
              }`
            }
          >
            <Camera size={20} />
            <span className="text-xs mt-1">投稿</span>
          </NavLink>
          
          <NavLink 
            to="/ranking/weekly" 
            className={({ isActive }) => 
              `flex flex-col items-center py-3 px-6 ${
                isActive || location.pathname.includes('/ranking') 
                  ? 'text-secondary' 
                  : 'text-gray-700'
              }`
            }
          >
            <Trophy size={24} />
            <span className="text-xs mt-1">ランキング</span>
          </NavLink>

          {user && (
            <NavLink 
              to="/settings" 
              className={({ isActive }) => 
                `flex flex-col items-center py-3 px-6 ${
                  isActive ? 'text-secondary' : 'text-gray-700'
                }`
              }
            >
              <Settings size={24} />
              <span className="text-xs mt-1">設定</span>
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;