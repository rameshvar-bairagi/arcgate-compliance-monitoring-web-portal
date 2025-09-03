/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";
import type { CellMetaSettings } from "datatables.net";

export type ColumnConfig<T = any> = {
  title: string;
  data?: Extract<keyof T, string | number> | null; // <- important: exclude symbol
  render?: (
    data: any,
    type: any,
    row: T,
    meta: CellMetaSettings
  ) => ReactNode;
  orderable?: boolean;
  width?: string | number;
  defaultContent?: string;
};

export type ServerDataTableProps = {
  id: string;
  columns: ColumnConfig[];
  data: any; // TableRow[]; // strongly type it
  page: number;
  size: number;
  totalElements: number;
  onPageChange: (newPage: number) => void;
  onSort?: (columnIndex: number, direction: 'asc' | 'desc') => void;
  searching?: boolean;
  order?: number;
  columnDefs?: any[];
  exportButtons?: string[];
  domLayout?: string;
}