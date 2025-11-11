import { createRoutes } from '@/utils/routesUtils';
import ProductGroupOverview from './pages/ProductGroupOverview';

export const productGroupRoutes = createRoutes({
  PRODUCT_GROUP: {
    path: '/product_group',
    displayName: 'Grupos de Produto',
    element: <ProductGroupOverview />,
  },
});
