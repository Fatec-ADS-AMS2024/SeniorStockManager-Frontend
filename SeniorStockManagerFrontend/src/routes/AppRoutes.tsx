import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useRouteError,
} from "react-router-dom";
import { routes } from "./routes";
import Layout from "../components/Layout";
import AccessibilityPage from "../pages/AccessibilityPage";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/Registrations";
import RegisterCarrier from "../pages/Registrations/RegisterCarrier";
import FormCarrier from "../pages/Registrations/FormCarrier";
import RegisterProduct from "../pages/Registrations/RegisterProduct";
import FormProduct from "../pages/Registrations/FormProduct";
import RegisterManufacturer from "../pages/Registrations/RegisterManufacturer";
import RegisterUnitOfMeasure from "../pages/Registrations/RegisterUnitOfMeasure";
import ProductTypeRegistration from "../pages/Registrations/RegisterProductType";
import ProductGroup from "../pages/Registrations/RegisterProductGroup";
import Supplier from "../pages/Registrations/RegisterSupplier";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="" element={<Layout />} errorElement={<GlobalErrorBoundary />}>
      <Route path={routes.ACCESSIBILITY} element={<AccessibilityPage />} />
      <Route path={routes.LANDING} element={<LandingPage />} />
      <Route path={routes.LOGIN} element={<LoginPage />} />
      <Route path={routes.REGISTER} element={<RegisterPage />} />
      <Route path={routes.REGISTER_UNIT_OF_MEASURE} element={<RegisterUnitOfMeasure />} />
      <Route path={routes.REGISTER_CARRIER} element={<RegisterCarrier />} />
      <Route path={routes.FORM_CARRIER} element={<FormCarrier />} />
      <Route path={routes.REGISTER_PRODUCT} element={<RegisterProduct />} />
      <Route path={routes.FORM_PRODUCT} element={<FormProduct />} />
      <Route path={routes.REGISTER_MANUFACTURER} element={<RegisterManufacturer />} />
      <Route path={routes.PRODUCT_GROUP} element={<ProductGroup/>} />
      <Route path={routes.SUPPLIER_NEW} element={<Supplier />} />
      <Route path={routes.SUPPLIER_EDIT} element={<Supplier />} />
      <Route path={routes.SUPPLIER} element={<Supplier/>} />
      <Route path={routes.REGISTER_PRODUCT_TYPE} element={<ProductTypeRegistration />} />
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
