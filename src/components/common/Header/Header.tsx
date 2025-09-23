import React, { useState, useEffect } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { APP_CONFIG, COLORS } from '../../../utils/constants';
import eventMatchingLogo from '../../../event-matching.svg';

interface HeaderProps {
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick, onLogoutClick }) => {
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const getUserName = async () => {
      try {
        // AWS Amplifyから認証されたユーザー情報を取得
        const user = await getCurrentUser();
        
        // user.usernameを取得して表示
        const displayName = user?.username || 'ユーザー';
        
        setUserName(displayName);
      } catch (error) {
        console.error('ユーザー情報の取得に失敗しました:', error);
        setUserName('ゲスト');
      }
    };

    getUserName();
  }, []);

  return (
    <header 
      className="flex items-center justify-between px-6 py-4 shadow-lg border-b-2"
      style={{ 
        borderBottomColor: COLORS.PRIMARY
      }}
    >
      {/* ロゴセクション */}
      <div className="flex items-center space-x-3">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
          style={{ 
            background: `linear-gradient(135deg, ${COLORS.PRIMARY} 0%, ${COLORS.SECONDARY} 100%)`
          }}
        >
          <span className="text-white font-bold text-lg">E</span>
        </div>
        <div>
          <h1 
            className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
          >
            {APP_CONFIG.APP_NAME}
          </h1>
        </div>
      </div>

      {/* アクションセクション */}
      <div className="flex items-center space-x-3">
        {/* ユーザー名表示 */}
        {userName && (
          <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200 shadow-md">
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ 
                background: `linear-gradient(135deg, ${COLORS.PRIMARY} 0%, ${COLORS.SECONDARY} 100%)`
              }}
            >
              <span className="text-white font-bold text-xs">👤</span>
            </div>
            <span className="text-sm font-semibold text-red-700 whitespace-nowrap">{userName}</span>
          </div>
        )}

        {/* 設定ボタン（コメントアウト中） */}
        {/* <button
          onClick={onSettingsClick}
          className="group relative p-3 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg border border-gray-200"
          aria-label="設定"
        >
          <div className="text-gray-600 group-hover:text-gray-800 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </button> */}
        
        {/* ログアウトボタン */}
        <button
          onClick={onLogoutClick}
          className="group relative px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          aria-label="ログアウト"
        >
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>ログアウト</span>
          </div>
          
          {/* ホバー時のツールチップ */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
            サインアウト
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;