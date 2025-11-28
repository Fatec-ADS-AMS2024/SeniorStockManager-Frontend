import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useRouteError,
} from 'react-router-dom';
import { routes } from './routes';
import { AppLayout, HeaderFooterLayout } from '@/features/layout';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route
        path=''
        element={<AppLayout />}
        errorElement={<GlobalErrorBoundary />}
      >
        <Route {...routes.ADMIN_OVERVIEW} />
        <Route {...routes.REGISTRATIONS} />
        <Route {...routes.CARRIER} />
        <Route {...routes.CARRIER_REGISTRATION} />
        <Route {...routes.CARRIER_EDIT} />
        <Route {...routes.MANUFACTURER} />
        <Route {...routes.PRODUCT} />
        <Route {...routes.PRODUCT_REGISTRATION} />
        <Route {...routes.PRODUCT_EDIT} />
        <Route {...routes.PRODUCT_GROUP} />
        <Route {...routes.PRODUCT_TYPE} />
        <Route {...routes.USER} />
        <Route {...routes.USER_REGISTRATION} />
        <Route {...routes.USER_EDIT} />
        <Route {...routes.SUPPLIER} />
        <Route {...routes.SUPPLIER_REGISTRATION} />
        <Route {...routes.SUPPLIER_EDIT} />
        <Route {...routes.UNIT_OF_MEASURE} />
      </Route>
      <Route
        path=''
        element={<HeaderFooterLayout />}
        errorElement={<GlobalErrorBoundary />}
      >
        <Route {...routes.LOGIN} />
        <Route {...routes.ACCESSIBILITY} />
        <Route {...routes.LANDING} />
      </Route>
    </Route>
  )
);

/**
 * Componente exibido ao dar erro nas rotas
 */
function GlobalErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  return (
    <main className='min-h-screen w-screen p-4'>
      <h1 className='text-2xl text-red-500'>
        Erro ao tentar acessar a página!
      </h1>
    </main>
  );
}

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
