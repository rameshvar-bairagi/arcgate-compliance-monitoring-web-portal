"use client";

// components/DynamicTable.tsx
import React from 'react';
import { DataTableWrapper } from './DataTableWrapper';

interface DynamicTableProps {
  tableId?: string;
  className?: string;
  columns: string[];
  data: (string | number)[][];
  showFooter?: boolean;
}

const DynamicTable: React.FC<DynamicTableProps> = ({ 
  tableId,
  className,
  columns,
  data,
  showFooter = false,
}) => {
  return (
    <>
      <table id={tableId} className={className}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, cellIdx) => (
                <td key={cellIdx}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
        {showFooter && (
          <tfoot>
              <tr>
              {columns.map((col, idx) => (
                <th key={idx}>{col}</th>
              ))}
              </tr>
          </tfoot>
        )}
      </table>
      <DataTableWrapper id={tableId ? tableId : ''} />
    </>
  );
};

export default DynamicTable;