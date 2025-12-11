import { TableColumn } from './types';

interface TableHeaderProps<T> {
  columns: TableColumn<T>[];
  actions?: boolean;
}

export default function TableHeader<T>({
  columns,
  actions,
}: TableHeaderProps<T>) {
  return (
    <thead className='text-textPrimary bg-neutral' role='rowgroup'>
      <tr className='h-12' role='row'>
        {/* Coluna reservada para as checkbox */}
        <th className='w-10' role='columnheader' aria-label='Seleção'></th>
        {columns.map((column, index) => (
          <th key={index} className='text-left' role='columnheader' aria-label={`Coluna ${column.label}`}>
            {column.label}
          </th>
        ))}
        {actions && <th className='text-center w-2/12' role='columnheader' aria-label='Coluna de ações'>Ações</th>}
      </tr>
    </thead>
  );
}
