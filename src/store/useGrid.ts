import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { DataColumn, DataRow } from "../types/data.type";
import data from "../mocks/data.json";
import { buildEmptyRow } from "../utils/buildEmptyRow";

type GridState = {
  columns: DataColumn[];
  rows: DataRow[];
  setColumns: (columns: DataColumn[]) => void;
  setRows: (rows: DataRow[]) => void;
  addRow: () => void;
};

export const useGridStore = create<GridState>()(
  devtools((set) => ({
    columns: data.columns as DataColumn[],
    rows: data.rows as DataRow[],
    setColumns: (columns: DataColumn[]) => set({ columns }, false, "setColumns"),
    setRows: (rows: DataRow[]) => set({ rows }, false, "setRows"),
    addRow: () => set((state) => ({ rows: [...state.rows, buildEmptyRow(state.columns)] }), false, "addRow"),
  }))
);
