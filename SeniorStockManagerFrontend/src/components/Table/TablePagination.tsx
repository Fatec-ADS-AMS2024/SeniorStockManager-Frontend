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
    <div
      className='flex items-center justify-end select-none gap-4 w-[50%]'
      role='navigation'
      aria-label='Paginação da tabela'
    >
      <button
        className={`px-4 py-2 border border-neutralDark text-textPrimary rounded hover:bg-hoverButton hover:border-neutralWhite hover:text-neutralWhite transition-colors disabled:invisible ${
          totalPages === 1 ? 'hidden' : ''
        }`}
        disabled={currentPage === 1}
        onClick={handlePrevious}
        aria-label='Página anterior'
      >
        Anterior
      </button>
      <span
        className='px-4 py-2 border border-neutralDark rounded'
        role='status'
        aria-live='polite'
      >
        Página {currentPage} de {totalPages}
      </span>
      <button
        className={`px-4 py-2 border border-neutralDark text-textPrimary rounded hover:bg-hoverButton hover:border-neutralWhite hover:text-neutralWhite transition-colors disabled:invisible ${
          totalPages === 1 ? 'hidden' : ''
        }`}
        disabled={currentPage === totalPages}
        onClick={handleNext}
        aria-label='Próxima página'
      >
        Próximo
      </button>
    </div>
  );
}
