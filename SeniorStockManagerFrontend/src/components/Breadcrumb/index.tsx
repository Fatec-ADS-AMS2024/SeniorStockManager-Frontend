import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname
    .split("/")
    .filter((x) => x && x.toLowerCase() !== "home"); // Remove a primeira ocorrência de "home"

  return (
    <nav className="flex items- p-4 space-x-4" aria-label="Breadcrumb">

      <ul className="flex">
        {/* Adiciona "Home" manualmente como o primeiro item */}
        <li className="flex items-center">
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Home
          </Link>
          {pathnames.length > 0 && (
            <svg
              className="h-5 w-5 text-gray-400 mx-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L11.586 9 7.293 4.707a1 1 0 011.414-1.414l4.586 4.586a1 1 0 010 1.414l-4.586 4.586a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </li>

        {/* Processa as partes da URL */}
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`; // Reconstrói a URL para cada nível.
          const isLast = index === pathnames.length - 1; // Verifica se é o último item.
          return (
            <li key={to} className="flex items-center">
              {isLast ? (
                // Último item não é clicável
                <span className="text-gray-500">{value}</span>
              ) : (
                <Link to={to} className="text-blue-600 hover:text-blue-800">
                  {value}
                </Link>
              )}
              {!isLast && (
                <svg
                  className="h-5 w-5 text-gray-400 mx-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L11.586 9 7.293 4.707a1 1 0 011.414-1.414l4.586 4.586a1 1 0 010 1.414l-4.586 4.586a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
