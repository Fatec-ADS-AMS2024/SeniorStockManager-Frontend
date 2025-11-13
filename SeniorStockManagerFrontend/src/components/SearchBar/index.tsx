import { useState } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import Button from '../Button';

interface SearchBarProps {
  placeholder?: string;
  action?: (searchTerm: string) => void;
}

export default function SearchBar({ placeholder, action }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (action) action(searchTerm);
  };

  return (
    <div className='flex w-full'>
      {/* Formulário de pesquisa acessível */}
      <form
        className='flex w-full max-w-2xl shadow-md'
        role='search'
        aria-label='Barra de pesquisa'
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        {/* Campo de entrada de texto */}
        <input
          type='text'
          placeholder={placeholder ? placeholder : 'Digite aqui...'}
          className='w-full py-2 pl-4 text-sm text-textPrimary rounded-l border-2 border-neutralWhite bg-neutralWhite focus:outline-none focus:border-neutralDarker'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label='Campo de busca'
        />

        {/* Botão de pesquisa */}
        <Button
          label=''
          icon={<MagnifyingGlass size={20} aria-hidden='true' />}
          color='neutralLight'
          onClick={handleSearch}
          type='submit'
          aria-label='Executar pesquisa'
        />
      </form>
    </div>
  );
}
