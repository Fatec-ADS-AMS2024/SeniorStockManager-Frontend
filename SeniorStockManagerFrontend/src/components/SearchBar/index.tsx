import { useState } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';

// Parametros da barra de pesquisa
interface SearchBarProps {
  placeholder?: string;
  action?: (searchTerm: string) => void;
}

// Componente de barra de pesquisa
export default function SearchBar({ placeholder, action }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Função para lidar com a ação de pesquisa
  const handleSearch = () => {
    if (typeof action === 'function') {
      action(searchTerm);
    } else { 
    console.log(searchTerm);
    };
  };

  return (
    <div className="flex w-full ">
      {/* Search bar */}
      {/* Formulário de pesquisa */}
      <form className="flex w-full max-w-2xl shadow-md">
      {/* Input para entrada de dados com atualização do termo da pesquisa */}
      <input
        type="text"
        placeholder={placeholder ? placeholder : 'Digite aqui...'}
        className="w-full py-2 pl-4 text-sm text-textPrimary rounded-l border-2 border-neutralWhite bg-neutralWhite focus:outline-none focus:border-neutralDarker"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
        {/* Botão pra envio do formulário com a ação de pesquisa */}
        <button
          type="button"
          className="py-1 px-5 text-xl text-textSecondary rounded-r bg-neutralDarker hover:bg-neutralDark focus:outline-none"
          onClick={handleSearch}
        >
          {/* Icone da barra de pesquisa */}
          <MagnifyingGlass size={27} /> 
        </button>
      </form>
    </div>
  );
}