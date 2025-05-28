import TableFooter from "./TableFooter";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import { JSX, useState } from "react";

interface TableProps {
  columns: string[];
  data: {
    id: number;
  }[];
  rowsPerPage?: number;
  actions?: (id: number) => JSX.Element;
}

export default function Table({
  columns,
  data,
  rowsPerPage = 10,
  actions,
}: TableProps) {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  const startIndex = (currentPage - 1) * rowsPerPage;
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleRowSelection = (rowId: number) => {
    setSelectedRows((prevSelectedRows) => {
      if (!prevSelectedRows) return [rowId];

      if (prevSelectedRows.includes(rowId)) {
        // Se a linha já estiver selecionada, desmarque
        return prevSelectedRows.filter((id) => id !== rowId);
      } else {
        // Caso contrário, adicione a linha aos selecionados
        return [...prevSelectedRows, rowId];
      }
    });
  };

  return (
    <table className="w-full bg-neutralWhite rounded-lg shadow-md overflow-hidden">
      {/* Cabeçalho da tabela */}
      <TableHeader columns={columns} actions={!!actions} />
      {/* Corpo da tabela */}
      <tbody>
        {paginatedData.map((row, rowIndex) => (
          <TableRow
            key={row.id}
            data={row}
            index={rowIndex}
            actions={actions ? actions(row.id) : undefined}
            onSelect={handleRowSelection}
            isSelected={selectedRows.includes(row.id)}
          />
        ))}
      </tbody>
      <TableFooter
        rowsSelected={selectedRows.length}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </table>
  );
}