import React from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import logo from './logo.svg';
import './App.css';
import { useNavigate } from 'react-router-dom';

// withAuthenticatorにはsignOut関数とuser情報が渡される
function App({ signOut, user }: { signOut?: () => void; user?: any }) {
  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>こんにちは, {user?.username || user?.attributes?.email || 'ユーザー'} さん！</h1>
        <p>ログインに成功しました。</p>
        
        <div style={{ margin: '20px 0' }}>
          <button 
            onClick={() => navigate('/dashboard')}
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
