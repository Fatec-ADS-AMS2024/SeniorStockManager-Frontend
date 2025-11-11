import { createRoutes } from '@/utils/routesUtils';
import LoginPage from './pages/LoginPage';

export const authRoutes = createRoutes({
  LOGIN: {
    path: '/login',
    displayName: 'Login',
    element: <LoginPage />,
  },
});
