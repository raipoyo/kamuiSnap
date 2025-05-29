import React, { useState } from 'react';

const HungryPage: React.FC = () => {
  const [showMessage, setShowMessage] = useState(false);

  const handleHungryClick = () => {
    setShowMessage(true);
    console.log('お腹すいた');
  };

  const handleReset = () => {
    setShowMessage(false);
  };

  return (
    <div className="text-center py-12">
      <h2 className="text-3xl font-bold mb-8">お腹すいたシステム</h2>
      
      <div className="max-w-md mx-auto">
        {!showMessage ? (
          <div>
            <p className="text-gray-600 mb-6">
              お腹が空いた時にボタンを押してください
            </p>
            <button
              onClick={handleHungryClick}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
            >
              お腹すいたボタン
            </button>
          </div>
        ) : (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8">
            <div className="text-6xl mb-4">🍚</div>
            <h3 className="text-4xl font-bold text-red-600 mb-4">
              お腹すいた
            </h3>
            <p className="text-gray-600 mb-6">
              コンソールにもメッセージが出力されました！
            </p>
            <button
              onClick={handleReset}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              リセット
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HungryPage;