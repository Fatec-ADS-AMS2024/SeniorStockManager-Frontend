import { createRoutes } from '@/utils/routesUtils';
import PositionOverview from './pages/PositionOverview';

export const positionRoutes = createRoutes({
  POSITION: { // MUDANÇA
    path: '/position', // MUDANÇA
    displayName: 'Posições', // MUDANÇA
    element: <PositionOverview />, // MUDANÇA
  },
});