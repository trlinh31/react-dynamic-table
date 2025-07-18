import type { DataColumn } from "../types/data.type";

export const getFlattenColumns = (columns: DataColumn[]) => {
  return columns.flatMap((column) => (column.columns?.length ? column.columns.map((child) => ({ ...child, parentId: column.id })) : [column]));
};
