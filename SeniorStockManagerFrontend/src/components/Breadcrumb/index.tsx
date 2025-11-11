import { Link } from 'react-router-dom';
import { CaretRight } from '@phosphor-icons/react';
import useBreadcrumbs from '@/hooks/useBreadcrumbs';

export default function Breadcrumb() {
  const breadcrumbs = useBreadcrumbs();

  return (
    <nav
      className='flex items-center space-x-2 capitalize'
      aria-label='Breadcrumb'
    >
      <ul className='flex items-center space-x-1'>
        {/* Renderização dinâmica dos caminhos */}
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const hasPath = !!crumb.path;

          const item =
            hasPath && !isLast && crumb.hasPage ? (
              <Link
                className='text-secondary hover:text-primary font-medium'
                to={crumb.path}
              >
                {crumb.name}
              </Link>
            ) : (
              <span className='text-textSecondary font-medium'>
                {crumb.name}
              </span>
            );

          const separator = !isLast && (
            <CaretRight className='text-textSecondary h-5 w-5 mx-1' />
          );

          return (
            <li key={crumb.path} className='flex items-center'>
              {item}
              {separator}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
