interface TablePaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function TablePagination({
  totalPages,
  currentPage,
  onPageChange,
}: TablePaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className='flex items-center justify-end select-none gap-4 w-[50%]'>
      {/* Botão Anterior */}
      <button
        className={`px-4 py-2 border border-neutralDark text-textPrimary rounded hover:bg-hoverButton hover:border-neutralWhite hover:text-neutralWhite transition-colors disabled:invisible ${
          totalPages === 1 ? 'hidden' : ''
        }`}
        disabled={currentPage === 1}
        onClick={handlePrevious}
      >
        Anterior
      </button>

      {/* Dropdown de seleção de página */}
      <span className='px-4 py-2 border border-neutralDark rounded'>
        Página {currentPage} de {totalPages}
      </span>

      {/* Botão Próximo */}
      <button
        className={`px-4 py-2 border border-neutralDark text-textPrimary rounded hover:bg-hoverButton hover:border-neutralWhite hover:text-neutralWhite transition-colors disabled:invisible ${
          totalPages === 1 ? 'hidden' : ''
        }`}
        disabled={currentPage === totalPages}
        onClick={handleNext}
      >
        Próximo
      </button>
    </div>
  );
}
