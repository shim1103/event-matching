import { createBrowserRouter, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import EventForm from './pages/EventForm/EventForm';
import Matching from './pages/Matching/Matching';
import Proposal from './pages/Proposal/Proposal';

// ルート定義
const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/form',
    element: <EventForm />,
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
    element: <Navigate to="/" />,
  }
]);

export default router;
