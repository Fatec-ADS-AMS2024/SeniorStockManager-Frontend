import { createRoutes } from '@/utils/routesUtils';
import ProductTypeOverview from './pages/ProductTypeOverview';

export const productTypeRoutes = createRoutes({
  PRODUCT_TYPE: {
    path: '/product_type',
    displayName: 'Tipos de Produtos',
    element: <ProductTypeOverview />,
  },
});
