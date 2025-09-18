import { createBrowserRouter, Navigate } from 'react-router-dom';
import Matching from './pages/Matching/Matching';
import Proposal from './pages/Proposal/Proposal';

// ルート定義（カレンダー・登録機能は削除）
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/matching" />, // デフォルトでマッチング画面へ
  },
  {
    path: '/matching',
    element: <Matching />,
  },
  {
    path: '/proposal',
    element: <Proposal />,
  },
  {
    path: "*",
    element: <Navigate to="/matching" />,
  }
]);

export default router;
