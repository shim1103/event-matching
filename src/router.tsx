import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';

// ルート定義
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/note',
    element: <App />,
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  }
]);

export default router;
