import ProductBatchOverview from './pages/ProductBatchOverview';
import { createRoutes } from '@/utils/routesUtils';

export const productBatchRoutes = createRoutes({
  PRODUCT_BATCH: {
    path: '/product-batch',
    displayName: 'Lotes de Produto',
    element: <ProductBatchOverview />,
  },
});
