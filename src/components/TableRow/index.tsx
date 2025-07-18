import { useGridStore } from "../../store/useGrid";
import { evaluateFormula } from "../../utils/evaluateFormula";
import { getFlattenColumns } from "../../utils/flattenColumns";
import TableCell from "../TableCell";

export default function TableRow() {
  const { rows, columns, setRows } = useGridStore();
  const flatColumns = getFlattenColumns(columns);

  const handleCellChange = (rowIndex: number, columnId: string, newValue: any, parentId?: string) => {
    const updatedRows = [...rows];
    const row = { ...updatedRows[rowIndex] };

    if (parentId) {
      row[parentId] = { ...row[parentId], [columnId]: newValue };
    } else {
      row[columnId] = newValue;
    }

    const formulaColumns = columns.filter((col) => col.type === "formula" && col.formula);
    formulaColumns.forEach((col) => {
      row[col.id] = evaluateFormula(col.formula!, row);
    });

    updatedRows[rowIndex] = row;
    setRows(updatedRows);
  };

  return (
    <tbody>
      {rows.map((row, rowIndex) => (
        <tr key={rowIndex} className='border'>
          {flatColumns.map((column) => {
            let value;
            if (column.parentId) {
              value = row[column.parentId]?.[column.id];
            } else {
              value = row[column.id];
            }
            const type = column.type;
            return <TableCell key={column.id} value={value} type={type} column={column} rowIndex={rowIndex} onChange={handleCellChange} />;
          })}
        </tr>
      ))}
    </tbody>
  );
}
