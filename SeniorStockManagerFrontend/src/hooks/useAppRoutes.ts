import { routes } from '@/routes/routes';

// Esse hook é necessário para evitar erros de depêndencia circular do routes
export default function useAppRoutes() {
  return routes;
}
