import { useGridStore } from "../../store/useGrid";
import type { DataColumn } from "../../types/data.type";
import ChildHeaderCell from "../ChildHeaderCell";
import GroupHeaderCell from "../GroupHeaderCell";

export default function TableHead() {
  const { columns, setColumns } = useGridStore();
  const hasGroup = columns.some((column) => column.columns && column.columns.length);

  const updateColumnById = (columns: DataColumn[], columnId: string, newValue: string): DataColumn[] => {
    return columns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          ...(column.columns && column.columns.length > 0 ? { headerGroup: newValue } : { name: newValue }),
        };
      }

      if (column.columns && column.columns.length > 0) {
        return {
          ...column,
          columns: updateColumnById(column.columns, columnId, newValue),
        };
      }

      return column;
    });
  };

  const handleHeaderChange = (columnId: string, newValue: string) => {
    const newHeaderColumns = updateColumnById(columns, columnId, newValue);
    setColumns(newHeaderColumns);
  };

  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <GroupHeaderCell key={column.id} column={column} onChange={handleHeaderChange} />
        ))}
      </tr>

      {hasGroup && (
        <tr>
          {columns.flatMap((column) => {
            return column.columns && column.columns.length
              ? column.columns.map((child) => <ChildHeaderCell key={child.id} column={child} onChange={handleHeaderChange} />)
              : [];
          })}
        </tr>
      )}
    </thead>
  );
}
