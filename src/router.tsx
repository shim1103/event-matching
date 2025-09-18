import { createBrowserRouter, Navigate } from 'react-router-dom';
import Recruiting from './pages/Recruiting/Recruiting';
import Proposal from './pages/Proposal/Proposal';
import App from './App';
import Register from './pages/register/Register';
import Dashboard from './pages/dashboard/Dashboard';

// ルート定義（カレンダー・登録機能は削除）
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,

  },
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
  {
    path: "*",
    element: <Navigate to="/" />,
  }
]);

export default router;
