import React from 'react';
import Header from '../Header';

interface LayoutProps {
  children: React.ReactNode;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  onSettingsClick, 
  onLogoutClick 
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSettingsClick={onSettingsClick}
        onLogoutClick={onLogoutClick}
      />
      <main className="pb-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;