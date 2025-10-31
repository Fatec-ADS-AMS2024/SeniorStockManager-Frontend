import { createRoutes } from '@/utils/routesUtils';
import UnitOfMeasureOverview from './pages/UnitOfMeasureOverview';

export const unitOfMeasureRoutes = createRoutes({
  UNIT_OF_MEASURE: {
    path: '/unit_of_measure',
    displayName: 'Unidades de Medida',
    element: <UnitOfMeasureOverview />,
  },
});
