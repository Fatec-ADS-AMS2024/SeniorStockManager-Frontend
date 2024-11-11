import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useRouteError,
} from "react-router-dom";
import { routes } from "./routes";
import Layout from "../components/Layout";
import AcessibilityPage from "../pages/AcessibilityPage";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="" element={<Layout />} errorElement={<GlobalErrorBoundary />}>
      <Route path={routes.ACCESSIBILITY} element={<AcessibilityPage />} />
      <Route path={routes.LANDING} element={<LandingPage />} />
      <Route path={routes.LOGIN} element={<LoginPage />} />
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
    <main className="min-h-screen w-screen p-4">
      <h1 className="text-2xl text-red-500">
        Erro ao tentar acessar a página!
      </h1>
    </main>
  );
}

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
