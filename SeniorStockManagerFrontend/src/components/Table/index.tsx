import TableFooter from "./TableFooter";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import { JSX } from "react";

interface TableProps {
  columns: string[];
  data: {
    id: number;
  }[];
  actions?: JSX.Element;
}

export default function Table({ columns, data, actions }: TableProps) {
  return (
    <table className="w-full bg-neutralWhite rounded-lg shadow-md">
      {/* Cabeçalho da tabela */}
      <TableHeader columns={columns} actions={actions} />
      {/* Corpo da tabela */}
      <tbody>
        {data.map((row, rowIndex) => (
          <TableRow key={row.id} data={row} index={rowIndex} actions={actions} />
        ))}
      </tbody>
      <TableFooter />
    </table>
  );
}
