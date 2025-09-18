import React, { useEffect, useState } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'; // スタイルシートをインポート
import { fetchUserAttributes } from 'aws-amplify/auth';
import logo from './logo.svg';
import './App.css';
import { useNavigate } from 'react-router-dom';

// withAuthenticatorにはsignOut関数とuser情報が渡される
function App({ signOut, user }: { signOut?: () => void; user?: any }) {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserAttributes = async () => {
      try {
        setLoading(true);
        // AWS Amplify v6の新しいAPIを使用
        const attributes = await fetchUserAttributes();
        
        if (attributes.email) {
          setUserEmail(attributes.email);
        }
      } catch (error) {
        console.error('Error fetching user attributes:', error);
      } finally {
        setLoading(false);
      }
    };

    getUserAttributes();
  }, []);

  // ユーザー名とemailを表示用に取得
  const displayName = user?.username || userEmail.split('@')[0] || 'ユーザー';
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
        
        <div style={{ margin: '20px 0' }}>
          <button 
            onClick={() => {
              console.log('ダッシュボードに遷移します。現在のEmail:', userEmail);
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
            onClick={signOut}
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
}

// AppコンポーネントをwithAuthenticatorでラップする
export default withAuthenticator(App);