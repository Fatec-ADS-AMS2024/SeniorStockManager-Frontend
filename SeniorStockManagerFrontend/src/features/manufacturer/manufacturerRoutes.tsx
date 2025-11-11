import { createRoutes } from '@/utils/routesUtils';
import ManufacturerOverview from './pages/ManufacturerOverview';

export const manufacturerRoutes = createRoutes({
  MANUFACTURER: {
    path: '/manufacturer',
    displayName: 'Fabricantes',
    element: <ManufacturerOverview />,
  },
});
