import React from "react";

interface LoadingScreenProps {
  show: boolean;
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  show, 
  message = "処理中…" 
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-white/30 to-pink-200/30 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
      {/* ローディングスピナー */}
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-red-500"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-ping border-t-red-300"></div>
      </div>
      
      {/* メッセージ */}
      <div className="mt-4 text-center">
        <p className="text-sm font-medium text-gray-700">
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;