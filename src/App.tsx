import React from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { UserProvider, useUser } from './contexts/UserContext';
import logo from './logo.svg';
import './App.css';
import { useNavigate } from 'react-router-dom';

// 内部コンポーネント（UserProviderの中で使用）
const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const { userId, userEmail, loading, error } = useUser();

  const displayName = userEmail?.split('@')[0] || 'ユーザー';
  const displayEmail = userEmail;

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
        {loading ? (
          <h1>読み込み中...</h1>
        ) : (
          <h1>こんにちは, {displayName} ({displayEmail})さん！</h1>
        )}
        
        <p>ログインに成功しました。</p>
        
        {/* 登録状況表示 */}
        {error ? (
          <p style={{ color: '#dc3545', fontSize: '14px', margin: '10px 0' }}>
            {error}
          </p>
        ) : userId ? (
          <p style={{ color: '#28a745', fontSize: '14px', margin: '10px 0' }}>
            ユーザーID: {userId} で登録/取得されました
          </p>
        ) : null}
        
        <div style={{ margin: '20px 0' }}>
          <button 
            onClick={() => {
              console.log('ダッシュボードに遷移します。UserID:', userId, 'Email:', userEmail);
              navigate('/dashboard');
            }}
            style={{ 
              margin: '10px', 
              padding: '10px 20px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            ダッシュボードへ
          </button>
          
          <button 
            onClick={() => {/* signOut will be passed from parent */}}
            style={{ 
              margin: '10px', 
              padding: '10px 20px', 
              backgroundColor: '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            サインアウト
          </button>
        </div>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

// メインのAppコンポーネント
function App({ signOut, user }: { signOut?: () => void; user?: any }) {
  return (
    <UserProvider user={user}>
      <AppContent />
    </UserProvider>
  );
}

export default withAuthenticator(App);