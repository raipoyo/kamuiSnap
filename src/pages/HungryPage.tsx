import React, { useState } from 'react';
import { UtensilsCrossed, Utensils } from 'lucide-react';

const HungryPage: React.FC = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleHungryClick = () => {
    setShowMessage(true);
    setClickCount(prev => prev + 1);
    console.log('お腹すいた');
    
    // Auto hide message after 3 seconds
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  const printToConsole = () => {
    console.log('お腹すいた');
    alert('「お腹すいた」をコンソールにプリントしました！');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-8 bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          お腹すいたシステム
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <div className="flex justify-center mb-6">
            <Utensils size={64} className="text-orange-500" />
          </div>
          
          <p className="text-gray-600 mb-6">
            お腹が空いた時にボタンを押してください
          </p>
          
          <button
            onClick={handleHungryClick}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 mb-4 text-lg"
          >
            <div className="flex items-center justify-center space-x-2">
              <UtensilsCrossed size={24} />
              <span>お腹すいた！</span>
            </div>
          </button>
          
          <button
            onClick={printToConsole}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 text-sm"
          >
            コンソールにプリント
          </button>
          
          {showMessage && (
            <div className="mt-6 p-4 bg-orange-100 border-l-4 border-orange-500 rounded">
              <p className="text-orange-700 font-bold text-lg text-center animate-pulse">
                🍽️ お腹すいた！🍽️
              </p>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              クリック回数: <span className="font-bold">{clickCount}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HungryPage;