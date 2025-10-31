import { createRoutes } from '@/utils/routesUtils';
import CarrierOverview from './pages/CarrierOverview';
import CarrierForm from './pages/CarrierForm';

export const carrierRoutes = createRoutes({
  CARRIER: {
    path: '/carrier',
    displayName: 'Fornecedores',
    element: <CarrierOverview />,
  },
  CARRIER_REGISTRATION: {
    path: '/carrier/registration',
    displayName: 'Cadastrar Fornecedor',
    element: <CarrierForm />,
  },
  CARRIER_EDIT: {
    path: '/carrier/edit/:id',
    displayName: 'Editar Fornecedor',
    element: <CarrierForm />,
  },
});
