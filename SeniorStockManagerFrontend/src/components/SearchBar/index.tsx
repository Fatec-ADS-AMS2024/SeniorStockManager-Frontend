import { useState } from 'react';
import SearchIcon from '../../assets/icons/search-icon.png';

// Parametros da barra de pesquisa
interface SearchBarProps {
  placeholder?: string;
  icon?: string;
  action?: (searchTerm: string) => void;
}

// Componente de barra de pesquisa
export default function SearchBar({ placeholder, icon, action }: SearchBarProps) {
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
        className="w-full py-2 pl-4 text-sm text-gray-600 rounded-l border-2 border-white bg-white focus:outline-none focus:border-gray-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
        {/* Botão pra envio do formulário com a ação de pesquisa */}
        <button
          type="button"
          className="py-1 px-5 text-xl text-white rounded-r bg-gray-300 hover:bg-gray-400 focus:outline-none"
          onClick={handleSearch}
        >
          {/* Icone da barra de pesquisa */}
          {
            icon? <img className="w-5 h-5" src={icon}/> : <img className="w-5 h-5" src={SearchIcon}/> 
          }
        </button>
      </form>
    </div>
  );
}