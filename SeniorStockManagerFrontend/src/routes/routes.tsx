import { authRoutes } from '@/features/auth';
import { carrierRoutes } from '@/features/carrier';
import { manufacturerRoutes } from '@/features/manufacturer';
import { productRoutes } from '@/features/product';
import { productGroupRoutes } from '@/features/productGroup';
import { productTypeRoutes } from '@/features/productType';
import { supplierRoutes } from '@/features/supplier';
import { unitOfMeasureRoutes } from '@/features/unitOfMeasure';
import { positionRoutes } from '@/features/position/positionRoutes'; // <--- LINHA ADICIONADA
import AccessibilityPage from '@/pages/AccessibilityPage';
import AdminOverview from '@/pages/Admin/AdminOverview';
import LandingPage from '@/pages/LandingPage';
import Registrations from '@/pages/Registrations';
import { createRoutes } from '@/utils/routesUtils';

const appRoutes = createRoutes({
  ACCESSIBILITY: {
    path: '/accessibility',
    displayName: 'Acessibilidade',
    element: <AccessibilityPage />,
  },
  LANDING: {
    displayName: 'Página Inicial',
    element: <LandingPage />,
    index: true,
    path: '/',
  },
  ADMIN_OVERVIEW: {
    path: '/admin',
    displayName: 'Visão Geral',
    element: <AdminOverview />,
  },
  REGISTRATIONS: {
    path: '/registrations',
    displayName: 'Cadastros',
    element: <Registrations />,
  },
}); 

// É a união de todas as definições de rotas da aplicação
export const routes = {
  ...appRoutes,
  ...authRoutes,
  ...carrierRoutes,
  ...manufacturerRoutes,
  ...productRoutes,
  ...productGroupRoutes,
  ...productTypeRoutes,
  ...supplierRoutes,
  ...unitOfMeasureRoutes,
  ...positionRoutes, // <--- LINHA ADICIONADA
} as const;