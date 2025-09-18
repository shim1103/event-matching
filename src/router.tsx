import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/dashboard/Dashboard';
import Register from './pages/register/Register';

// ルート定義
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
    element: <Register />,
  },
  {
    path: '/matched',
    element: <App/>,
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  }
]);

export default router;
