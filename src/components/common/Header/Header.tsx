import React from 'react';
import { APP_CONFIG, COLORS } from '../../../utils/constants';

interface HeaderProps {
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick, onLogoutClick }) => {
  return (
    <header 
      className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200"
      style={{ borderBottomColor: COLORS.SECONDARY }}
    >
      {/* ロゴ */}
      <div className="flex items-center">
        <h1 
          className="text-xl font-bold"
          style={{ color: COLORS.PRIMARY }}
        >
          {APP_CONFIG.APP_NAME}
        </h1>
      </div>

      {/* アクションアイコン */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onSettingsClick}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-lg"
          aria-label="設定"
          style={{ color: COLORS.TEXT }}
        >
          ⚙️
        </button>
        
        <button
          onClick={onLogoutClick}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-lg"
          aria-label="ログアウト"
          style={{ color: COLORS.TEXT }}
        >
          🚪
        </button>
      </div>
    </header>
  );
};

export default Header;