import TablePagination from './TablePagination';

interface TableFooterProps {
  rowsSelected: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function TableFooter({
  rowsSelected,
  totalPages,
  currentPage,
  onPageChange,
}: TableFooterProps) {
  return (
    <tfoot className='text-textPrimary bg-neutral'>
      {/* Parte de paginação */}
      <tr className='h-12'>
        <td colSpan={99}>
          <div className='flex items-center px-4 justify-between h-12 text-textPrimary'>
            <p className='w-[50%]'>Linhas selecionadas: {rowsSelected}</p>
            <TablePagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
          </div>
        </td>
      </tr>
    </tfoot>
  );
}
