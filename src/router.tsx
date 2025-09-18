import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import Recruiting from './pages/Recruiting/Recruiting';
import Proposal from './pages/Proposal/Proposal';
import App from './App';
import Register from './pages/register/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Layout from './components/common/Layout';

// 認証されたレイアウトコンポーネント
const AuthenticatedLayout = () => {
  const handleLogout = async () => {
    if(!window.confirm('ログアウトしますか？')) {
      return;
    }
    
    console.log('handleLogout called');
    console.log('window object:', window);
    console.log('window.globalSignOut:', (window as any).globalSignOut);
    
    localStorage.removeItem('userId');
    // ログアウト要求フラグを設定
    localStorage.setItem('logoutRequested', 'true');
    
    // AWS AmplifyのsignOut関数を呼び出し
    const globalSignOut = (window as any).globalSignOut;
    console.log('globalSignOut function:', globalSignOut);
    
    if (globalSignOut) {
      console.log('Calling globalSignOut...');
      try {
        const result = await globalSignOut();
        console.log('globalSignOut result:', result);
        console.log('Logout completed successfully');
        
        // ログアウト完了後、認証画面に遷移
        console.log('Redirecting to authentication page...');
        // 完全にページをリロードして認証フローを最初から開始
        window.location.reload();
      } catch (error) {
        console.error('globalSignOut error:', error);
        // エラーの場合もページをリロード
        window.location.reload();
      }
    } else {
      console.log('globalSignOut function not found, reloading page...');
      // globalSignOut関数が存在しない場合はページをリロード
      window.location.reload();
    }
  };

  return (
    <Layout onLogoutClick={handleLogout}>
      <Outlet />
    </Layout>
  );
};

// ルート定義（カレンダー・登録機能は削除）
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    element: <AuthenticatedLayout />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '/recruiting',
        element: <Recruiting />,
      },
      {
        path: '/proposal',
        element: <Proposal />,
      },
    ]
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  }
]);

export default router;
