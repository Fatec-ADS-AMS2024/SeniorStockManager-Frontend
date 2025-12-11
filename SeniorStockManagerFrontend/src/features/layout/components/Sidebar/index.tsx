import { useState } from 'react';
import {
  HouseLine,
  UserCheck,
  Users,
  CalendarDots,
  HandHeart,
  UserCirclePlus,
  X,
  List,
} from '@phosphor-icons/react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAppRoutes from '@/hooks/useAppRoutes';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const routes = useAppRoutes();
  const navigate = useNavigate();
  const location = useLocation(); // Obtém a rota atual

  const buttons = [
    {
      id: 'home',
      label: routes.ADMIN_OVERVIEW.displayName,
      icon: <HouseLine className='size-7 shrink-0' weight='fill' />,
      route: routes.ADMIN_OVERVIEW.path,
    },
    {
      id: 'professionals',
      label: 'Profissionais',
      icon: <UserCheck className='size-7 shrink-0' weight='fill' />,
      route: '#',
    },
    {
      id: 'elderly',
      label: 'Idosos',
      icon: <Users className='size-7 shrink-0' weight='fill' />,
      route: '#',
    },
    {
      id: 'calendar',
      label: 'Calendário',
      icon: <CalendarDots className='size-7 shrink-0' weight='fill' />,
      route: '#',
    },
    {
      id: 'careProvided',
      label: 'Cuidados Prestados',
      icon: <HandHeart className='size-7 shrink-0' weight='fill' />,
      route: '#',
    },
    {
      id: 'registrations',
      label: routes.REGISTRATIONS.displayName,
      icon: <UserCirclePlus className='size-7 shrink-0' weight='fill' />,
      route: routes.REGISTRATIONS.path,
    },
  ];

  return (
    <nav
      className={`flex flex-col z-10 ${
        isOpen ? 'w-72' : 'w-16'
      } h-[calc(100vh-64px-96px)] bg-neutralWhite transition-all duration-500 overflow-hidden sticky left-0 top-24 bottom-0`}
      role='navigation'
      aria-label='Menu principal'
    >
      {/* Botão de Menu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex w-full items-center justify-center h-16 text-primary hover:bg-neutralLighter border-x-4 border-x-transparent hover:border-r-primary relative '
        aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className='size-6 absolute right-4' aria-hidden='true' />
        ) : (
          <List className='size-8' aria-hidden='true' />
        )}
      </button>

      {/* Botões do Sidebar */}
      <div className='flex flex-col' role='menubar'>
        {buttons.map((button) => (
          <button
            key={button.id}
            onClick={() => navigate(button.route)}
            className={`flex items-center gap-2 h-14 whitespace-nowrap border-x-transparent border-x-4 ${
              isOpen ? 'px-4' : 'justify-center'
            } ${
              location.pathname === button.route
                ? 'bg-secondary text-neutralWhite border-r-primary' // Estilo para a página ativa
                : 'text-primary hover:bg-neutralLighter hover:border-r-primary'
            }`}
            role='menuitem'
            aria-label={button.label}
            aria-current={location.pathname === button.route ? 'page' : undefined}
          >
            <span aria-hidden='true'>{button.icon}</span>
            {isOpen && <span className='text-sm'>{button.label}</span>}
          </button>
        ))}
      </div>
    </nav>
  );
}
