import { TableColumn } from './types';

interface TableRowProps<T extends { id: number }> {
  data: T;
  columns: TableColumn<T>[];
  index: number;
  actions?: JSX.Element;
  onSelect: (rowId: number) => void;
  isSelected: boolean;
}

export default function TableRow<T extends { id: number }>({
  data,
  columns,
  index,
  actions,
  onSelect,
  isSelected,
}: TableRowProps<T>) {
  const handleClick = () => {
    onSelect(data.id);
  };

  return (
    <tr
      className={`border-y text-textSecondary h-12 ${
        index % 2 === 1 ? 'bg-neutralWhite' : 'bg-neutralLighter'
      }`}
    >
      {/* Célula da checkbox */}
      <td>
        <div className='h-full flex items-center justify-center'>
          <input
            type='checkbox'
            className='cursor-pointer'
            checked={isSelected}
            onChange={handleClick}
          />
        </div>
      </td>

      {/* Conteúdo */}
      {columns.map((column, index) => {
        const value = data[column.attribute];
        const displayValue = column.render
          ? column.render(value, data)
          : String(value);
        return <td key={index}>{displayValue}</td>;
      })}

      {/* Célula dos botões */}
      {actions && (
        <td className='px-4 text-center border-l-2 h-full'>
          <div className='flex h-full justify-evenly items-center'>
            {actions}
          </div>
        </td>
      )}
    </tr>
  );
}
