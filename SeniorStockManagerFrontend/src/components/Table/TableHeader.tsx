interface TableHeaderProps {
  columns: string[];
  actions?: boolean;
}

export default function TableHeader({ columns, actions }: TableHeaderProps) {
  return (
    <thead className="text-textPrimary bg-neutral">
      <tr className="h-12">
        {/* Coluna reservada para as checkbox */}
        <th className="w-10"></th>
        {columns.map((column, index) => (
          <th
            key={index}
            className="text-left"
          >
            {column}
          </th>
        ))}
        {actions && (
          <th className="text-center w-2/12">
            Ações
          </th>
        )}
      </tr>
    </thead>
  );
}