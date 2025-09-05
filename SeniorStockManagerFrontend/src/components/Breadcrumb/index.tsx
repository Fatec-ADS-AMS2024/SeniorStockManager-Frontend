import { Link, useLocation } from "react-router-dom";
import { CaretRight } from "@phosphor-icons/react";

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Mapeamento para traduzir as rotas
  // ADICIONAR A ROTA DA SUA PÁGINA E COLOCAR EM PORTUGUÊS ENTRE ASPAS
  //EXEMPLO: REGISTER: "CADASTROS"
  const breadcrumbNameMap: { [key: string]: string } = {
    home: "Início",
    registrations: "Cadastros",
    unitofmeasure: "Unidade de Medida",
    product: "Produto",
  };

  return (
    <nav
      className="flex items-center space-x-2"
      aria-label="Breadcrumb"
    >
      <ul className="flex items-center space-x-1">
        {/* Primeiro item: Início */}
        <li className="flex items-center">
          <Link to="/" className="text-secondary hover:text-primary font-medium">
            Início
          </Link>
        </li>

        {/* Renderização dinâmica dos caminhos */}
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={to} className="flex items-center">
              {/* Seta entre os itens */}
              <CaretRight className="text-textSecondary h-5 w-5 mx-1" />
              {isLast ? (
                <span className="text-textSecondary font-medium">
                  {breadcrumbNameMap[value] || value}
                </span>
              ) : (
                <Link
                  to={to}
                  className="text-secondary hover:text-primary font-medium"
                >
                  {breadcrumbNameMap[value] || value}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
