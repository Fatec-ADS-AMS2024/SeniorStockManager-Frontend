import { createRoutes } from '@/utils/routesUtils';
import ProductOverview from './pages/ProductOverview';
import ProductForm from './pages/ProductForm';

export const productRoutes = createRoutes({
  PRODUCT: {
    path: '/product',
    displayName: 'Produtos',
    element: <ProductOverview />,
  },
  PRODUCT_REGISTRATION: {
    path: '/product/registration',
    displayName: 'Cadastrar Produto',
    element: <ProductForm />,
  },
  PRODUCT_EDIT: {
    path: '/product/edit/:id',
    displayName: 'Editar Produto',
    element: <ProductForm />,
  },
});
