import { matchPath, useLocation } from 'react-router-dom';
import { routes } from '@/routes/routes';

interface BreadcrumbItem {
  name: string;
  path: string;
  hasPage: boolean;
}

export default function useBreadcrumbs() {
  const { pathname } = useLocation();
  const pathnames = pathname.split('/').filter((x) => x);

  const routePatterns = Object.values(routes).map((route) => route.path);
  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = '';

  // Incluindo a rota raiz padrão
  breadcrumbs.push({
    name: routes.ADMIN_OVERVIEW.displayName,
    path: routes.ADMIN_OVERVIEW.path,
    hasPage: !!routes.ADMIN_OVERVIEW.element,
  });

  // Determina o nome a ser mostrado e o caminho da url de cada segmento
  pathnames.forEach((value, index) => {
    if (`/${value}` === routes.ADMIN_OVERVIEW.path) return;

    currentPath += `/${value}`;
    const previousSegment = index > 0 ? pathnames[index - 1] : '';

    const matchingPattern = routePatterns.find((pattern) =>
      matchPath(pattern, currentPath)
    );

    const routeDefinition = Object.values(routes).find(
      (route) => route.path === matchingPattern
    );

    if (!routeDefinition) return;

    let name = '';
    const hasPage = !!routeDefinition.element;
    if (matchingPattern?.includes('/:')) {
      // É uma rota dinâmica
      if (!previousSegment) name = routeDefinition.displayName;

      name = `Detalhes de ${previousSegment}`;
    } else {
      // É uma rota estática
      name = routeDefinition.displayName;
    }

    if (name) {
      breadcrumbs.push({
        name: name,
        path: currentPath,
        hasPage,
      });
    }
  });

  return breadcrumbs;
}
