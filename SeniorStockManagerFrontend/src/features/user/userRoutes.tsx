import { createRoutes } from '@/utils/routesUtils';
import UserOverview from './pages/UserOverview';
import UserForm from './pages/UserForm';

export const userRoutes = createRoutes({
  USER: {
    path: '/user',
    displayName: 'Usuários',
    element: <UserOverview />,
  },
  USER_REGISTRATION: {
    path: '/user/registration',
    displayName: 'Cadastrar Usuário',
    element: <UserForm />,
  },
  USER_EDIT: {
    path: '/user/edit/:id',
    displayName: 'Editar Usuário',
    element: <UserForm />,
  },
});
