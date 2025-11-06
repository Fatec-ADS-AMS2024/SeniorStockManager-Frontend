import { createRoutes } from '@/utils/routesUtils';
import SupplierOverview from './pages/SupplierOverview';
import SupplierForm from './pages/SupplierForm';

export const supplierRoutes = createRoutes({
  SUPPLIER: {
    path: '/supplier',
    displayName: 'Fornecedores',
    element: <SupplierOverview />,
  },
  SUPPLIER_REGISTRATION: {
    path: '/supplier/registration',
    displayName: 'Cadastrar Fornecedor',
    element: <SupplierForm />,
  },
  SUPPLIER_EDIT: {
    path: '/supplier/edit/:id',
    displayName: 'Editar Fornecedor',
    element: <SupplierForm />,
  },
});
