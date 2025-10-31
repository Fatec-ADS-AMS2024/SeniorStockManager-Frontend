import { createRoutes } from '@/utils/routesUtils';
import SupplierOverview from './pages/SupplierOverview';

export const supplierRoutes = createRoutes({
  SUPPLIER: {
    path: '/supplier',
    displayName: 'Fornecedores',
    element: <SupplierOverview />,
  },
});
