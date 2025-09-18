import React, { useEffect, useState } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'; // スタイルシートをインポート
import { fetchUserAttributes } from 'aws-amplify/auth';
import { registerUser } from './services/api/client';
import logo from './logo.svg';
import './App.css';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';

// withAuthenticatorにはsignOut関数とuser情報が渡される
function App({ signOut, user }: { signOut?: () => void; user?: any }) {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [registrationStatus, setRegistrationStatus] = useState<string>('');

  // signOut関数をグローバルに保存
  useEffect(() => {
    console.log('App useEffect - signOut:', signOut);
    console.log('App useEffect - signOut type:', typeof signOut);
    console.log('App useEffect - signOut toString:', signOut?.toString());
    console.log('App useEffect - user:', user);

    if (signOut) {
      (window as any).globalSignOut = signOut;
      console.log('globalSignOut function set:', signOut);
      console.log('window.globalSignOut:', (window as any).globalSignOut);
    } else {
      console.log('signOut function not available');
    }
  }, [signOut, user]);

  useEffect(() => {
    const getUserAttributesAndRegister = async () => {
      try {
        setLoading(true);

        // ログアウト状態をチェック
        const isLoggedOut = localStorage.getItem('logoutRequested');
        if (isLoggedOut) {
          console.log('ログアウトが要求されています');
          localStorage.removeItem('logoutRequested');
          // 強制的にログアウト
          if (signOut) {
            await signOut();
          }
          return;
        }

        // AWS Amplify v6の新しいAPIを使用
        console.log('App fetchUserAttributes');
        const attributes = await fetchUserAttributes();
        console.log('App attributes', attributes);
        if (attributes.email) {
          setUserEmail(attributes.email);

          // ユーザー登録 or 既存ユーザー返却を実行
          try {
            const userData = {
              name: user?.username || attributes.email?.split('@')[0] || 'ユーザー',
              email: attributes.email,
              password: 'temp_password', // 実際の運用では適切なパスワード処理が必要
              phone: attributes.phone_number || '', // 電話番号が取得できない場合は空文字
              address: '', // 住所は空文字で初期化
              bio: '' // 自己紹介は空文字で初期化
            };

            const userResponse = await registerUser(userData);
            localStorage.setItem('userId', userResponse.id);
            console.log('ユーザー登録/取得成功:', userResponse);
            setRegistrationStatus(`ユーザーID: ${userResponse.id} で登録/取得されました`);

            // ログイン成功後、ダッシュボードにリダイレクト
            console.log('ログイン成功、ダッシュボードにリダイレクトします');
            navigate('/dashboard');

          } catch (registerError: any) {
            console.error('ユーザー登録/取得に失敗しました:', registerError);
            const errorMessage = registerError?.message || 'ユーザー登録/取得に失敗しました';
            setRegistrationStatus(`エラー: ${errorMessage}`);
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
  }, [user, navigate]);

  // 認証画面としての表示
  return (
    <div className="App">
      <LoadingScreen show={loading} message="読み込み中..." />
    </div>
  );
}

// AppコンポーネントをwithAuthenticatorでラップする
export default withAuthenticator(App);