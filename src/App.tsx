import React, { useEffect, useState } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'; // スタイルシートをインポート
import { fetchUserAttributes } from 'aws-amplify/auth';
import { registerUser } from './services/api/client';
import logo from './logo.svg';
import './App.css';
import { useNavigate } from 'react-router-dom';

// withAuthenticatorにはsignOut関数とuser情報が渡される
function App({ signOut, user }: { signOut?: () => void; user?: any }) {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [registrationStatus, setRegistrationStatus] = useState<string>('');

  useEffect(() => {
    const getUserAttributesAndRegister = async () => {
      try {
        setLoading(true);
        // AWS Amplify v6の新しいAPIを使用
        const attributes = await fetchUserAttributes();
        
        if (attributes.email) {
          setUserEmail(attributes.email);
          
          // ユーザー登録 or 既存ユーザー返却を実行
          try {
            const userData = {
              name: user?.username || attributes.email?.split('@')[0] || 'ユーザー',
              email: attributes.email,
              password: 'temp_password', // 実際の運用では適切なパスワード処理が必要
              phone: 'あ', // 必要に応じて他の属性から取得
              address: 'い', // 必要に応じて他の属性から取得
              bio: 'う' // 必要に応じて他の属性から取得
            };

            const userResponse = await registerUser(userData);
            localStorage.setItem('userId', userResponse.id);
            console.log('ユーザー登録/取得成功:', userResponse);
            setRegistrationStatus(`ユーザーID: ${userResponse.id} で登録/取得されました`);
            
          } catch (registerError) {
            console.error('ユーザー登録/取得に失敗しました:', registerError);
            setRegistrationStatus('ユーザー登録/取得に失敗しました');
          }
        }
      } catch (error) {
        console.error('Error fetching user attributes:', error);
        setRegistrationStatus('ユーザー情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    getUserAttributesAndRegister();
  }, [user]);

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
        
        {/* 登録状況表示 */}
        {registrationStatus && (
          <p style={{ 
            color: registrationStatus.includes('失敗') ? '#dc3545' : '#28a745',
            fontSize: '14px',
            margin: '10px 0'
          }}>
            {registrationStatus}
          </p>
        )}
        
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
            onClick={() => {
              localStorage.removeItem('userId');
              signOut?.();
            }}
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