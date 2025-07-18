import type { DataColumn } from "../types/data.type";

const getDefaultValueByType = (type: string) => {
  switch (type) {
    case "text":
    case "select":
    case "date":
    case "time":
      return "";
    case "number":
      return 0;
    case "checkbox":
      return false;
    default:
      return "";
  }
};

export const buildEmptyRow = (columns: DataColumn[]) => {
  const newRow: Record<string, any> = {};

  const handleColumn = (column: DataColumn) => {
    if (column.columns && column.columns.length > 0) {
      column.columns.forEach(handleColumn);
    } else {
      newRow[column.id] = getDefaultValueByType(column.type);
    }
  };

  columns.forEach(handleColumn);

  return newRow;
};
