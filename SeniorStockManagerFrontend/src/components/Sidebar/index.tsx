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

const buttons = [
  { id: 'home', label: 'Visão Geral', icon: <HouseLine className="size-7 shrink-0" weight="fill" />, route: '/generalAdministrator' },
  { id: 'professionals', label: 'Profissionais', icon: <UserCheck className="size-7 shrink-0" weight="fill" />, route: '/professionals' },
  { id: 'elderly', label: 'Idosos', icon: <Users className="size-7 shrink-0" weight="fill" />, route: '/elderly' },
  { id: 'calendar', label: 'Calendário', icon: <CalendarDots className="size-7 shrink-0" weight="fill" />, route: '/calendar' },
  { id: 'careProvided', label: 'Cuidados Prestados', icon: <HandHeart className="size-7 shrink-0" weight="fill" />, route: '/careProvided' },
  { id: 'registrations', label: 'Cadastros', icon: <UserCirclePlus className="size-7 shrink-0" weight="fill" />, route: '/register' },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Obtém a rota atual

  return (
    <div
      className={`flex flex-col ${
        isOpen ? 'w-72' : 'w-16'
      } h-full bg-surface shadow-lg transition-all duration-500 overflow-hidden`}
    >
      {/* Botão de Menu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-center h-16 text-primary hover:bg-[#F3F3F3] border-x-4 border-x-transparent hover:border-r-primary relative "
      >
        {isOpen ? <X className="size-6 absolute right-4" /> : <List className="size-8" />}
      </button>

      {/* Botões do Sidebar */}
      <div className="flex flex-col">
        {buttons.map((button) => (
          <button
            key={button.id}
            onClick={() => navigate(button.route)}
            className={`flex items-center gap-2 h-14 whitespace-nowrap border-x-transparent border-x-4 ${isOpen ? 'px-4' : 'justify-center'} ${
              location.pathname === button.route
                ? 'bg-secondary text-surface' // Estilo para a página ativa
                : 'text-primary hover:bg-[#F3F3F3] hover:border-r-primary'
            }`}
          >
            {button.icon}
            {isOpen && <span className="text-sm">{button.label}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
