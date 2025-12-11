import { Link } from 'react-router-dom';
import { CaretRight } from '@phosphor-icons/react';
import useBreadcrumbs from '@/hooks/useBreadcrumbs';

export default function Breadcrumb() {
  const breadcrumbs = useBreadcrumbs();

  return (
    <nav
      className='flex items-center space-x-2 capitalize'
      aria-label='Navegação atual' 
    >
      {/* Adicionei role="list" ao ul para melhor compatibilidade, embora nav/ul/li seja inerentemente uma lista */}
      <ul className='flex items-center space-x-1' role='list'>
        {/* Renderização dinâmica dos caminhos */}
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const hasPath = !!crumb.path;

          const item =
            hasPath && !isLast && crumb.hasPage ? (
              <Link
                className='text-secondary hover:text-primary font-medium'
                to={crumb.path}
                aria-current={isLast ? 'page' : undefined}
              >
                {crumb.name}
              </Link>
            ) : (
              <span
                className='text-textSecondary font-medium'
                aria-current={isLast ? 'page' : undefined}
              >
                {crumb.name}
              </span>
            );

          const separator = !isLast && (
            <CaretRight
              className='text-textSecondary h-5 w-5 mx-1'
              aria-hidden='true'
              focusable='false'
            />
          );

          return (
            // Adicionei role="listitem" ao li.
            <li key={crumb.path} className='flex items-center' role='listitem'>
              {item}
              {separator}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
