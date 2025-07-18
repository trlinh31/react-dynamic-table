export type Data = {
  tableId: string;
  tableName: string;
  schemaVersion: string;
  columns: DataColumn[];
  rows: DataRow[];
};

export type DataColumn = {
  id: string;
  name: string;
  type: "text" | "number" | "checkbox" | "select" | "date" | "time" | "percentage" | "lookup" | "formula" | "nested";
  required?: boolean;
  readOnly?: boolean;
  width: number;
  headerGroup: string;
  placeholder?: string;
  options?: Option[];
  formula?: string;
  isLookup?: boolean;
  lookupConfig?: LookupConfig;
  columns?: DataColumn[];
  parentId?: string;
};

export type LookupConfig = {
  endpoint: string;
  queryParam: string;
};

export type Option = {
  value: string;
  label: string;
};

export type DataRow = {
  [key: string]: any;
};
