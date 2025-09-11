/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Key, useEffect, useRef } from "react";
import $ from "jquery";
import "datatables.net-bs4";
import "datatables.net-responsive-bs4";
import "datatables.net-buttons-bs4";
import "datatables.net-buttons/js/buttons.html5.min";
import "datatables.net-buttons/js/buttons.print.min";
import "datatables.net-buttons/js/buttons.colVis.min";

import jszip from "jszip";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { CustomPagination } from "../Pagination/CustomPagination";
import { ServerDataTableProps } from "@/types/server-data-table";

declare global {
  interface Window {
    JSZip: typeof jszip;
  }
}

(pdfMake as any).vfs = (pdfFonts as any).vfs;
window.JSZip = jszip;


export const ServerDataTable: React.FC<ServerDataTableProps> = ({
  id,
  columns,
  data,
  page,
  size,
  totalElements,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  // pageSizeOptions = [10, 25, 50, 100, "All"],
  onSort,
  searching = true,
  order = 0, // this is which column default desc order. pass prop 0, 1, 2, 3, 4 etc
  columnDefs = [{ orderable: false, targets: "_all" }], // default and specific disable { orderable: false, targets: [0, 2] }, 
  exportButtons = ["csv", "excel", "pdf", "print"], // {["csv", "excel", "pdf", "print"]}
  domLayout = "Bfrtip", // Bfrtip, Brtip
}) => {
  // console.log(page, 'pagepagepagepagepage');
  const initialized = useRef(false);
  const tableRef = useRef<any>(null);
  // const tableRef = useRef<JQuery<HTMLElement>>(null);

  // Init DataTable
  useEffect(() => {
    // console.log(columns,'columnscolumnscolumns');
    // console.log(data,'datadatadatadata');
    if (!initialized.current) {
      const table = $(`#${id}`).DataTable({
        // rowId: "_rowId",
        data: [], // Empty data to prevent client-side processing
        columns: columns.map(col => ({
          title: col.title,
          data: col.data ?? null,
          render: col.render,
          defaultContent: col.defaultContent ?? "",
          orderable: col.orderable ?? false,
        })),
        paging: false,
        info: false,
        responsive: true,
        lengthChange: false,
        autoWidth: false,
        processing: true,
        searching: searching,
        ordering: !!onSort, // Enable ordering only if onSort callback is provided
        // order: [[order, "desc"]],
        columnDefs: columnDefs,
        buttons: exportButtons,
        dom: domLayout,
        scrollY: "450px",
        scrollCollapse: true,
      });

      // Fix shrink on first load
      table.on("init.dt", function () {
        setTimeout(() => {
          table.columns.adjust().draw(false);
        }, 0);
      });

      // Keep adjusting on every redraw
      table.on("draw.dt", function () {
        setTimeout(() => {
          table.columns.adjust().draw(false);
        }, 0);
      });

      tableRef.current = table;
      initialized.current = true;
    }

    // // Cleanup on unmount
    // return () => {
    //   if (initialized.current && tableRef.current) {
    //     tableRef.current.destroy(true);
    //     initialized.current = false;
    //   }
    // };
  }, [id, columns, searching, onSort, columnDefs, exportButtons, domLayout]);

  // Only attach sort event listener once after DataTable is initialized
  useEffect(() => {
    if (initialized.current && tableRef.current && onSort) {
      const table = tableRef.current;

      const handleSort = function (e: any, settings: any, details: any) {
        const sortInfo = details?.[0];
        if (sortInfo) {
          const columnIndex = sortInfo.col;
          const direction = sortInfo.dir === 'asc' ? 'asc' : 'desc';
          onSort(columnIndex, direction);
        }
      };

      table.on('order.dt', handleSort);

      // Cleanup to prevent stacking multiple listeners
      return () => {
        table.off('order.dt', handleSort);
      };
    }
  }, [onSort]);

  // Update table when data changes
  useEffect(() => {
    if (initialized.current && tableRef.current) {
      tableRef.current.clear();
      const buttonsContainer = tableRef.current.buttons().container?.();
      if (data && data.length > 0) {
        tableRef.current.rows.add(data).draw(false);
        exportButtons?.length > 0 ? buttonsContainer.show() : buttonsContainer.hide();
      } else {
        tableRef.current.draw(false);
        buttonsContainer.hide();
      }
      // console.log("Rows added:", tableRef.current.rows().count());

      // setTimeout(() => {
      //   tableRef.current.columns.adjust().draw(false);
      // }, 0);
    }
  }, [data]);

  const renderCell = (col: any, row: any, rowIdx: number, colIdx: number) => {
    if (typeof col.render === "function") {
      const meta = { row: rowIdx, col: colIdx, settings: {} } as any;
      return col.render(col.data ? row[col.data] : null, "display", row, meta);
    }
    if (col.data) return row[col.data];
    return col.defaultContent ?? null;
  };
  // return null;

  return (
    <div className="table-responsive p-0">
      <table id={id} className="table table-bordered table-striped">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody></tbody>
        {/* <tbody>
          {data && data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center">
                No records found
              </td>
            </tr>
          ) : (
            data.map((row: any, rowIdx: Key) => (
              <tr key={rowIdx}>
                {columns.map((col, colIdx) => (
                  <td key={colIdx}>
                    {renderCell(col, row, rowIdx as number, colIdx)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody> */}
        <tfoot>
          {data && data.length > 0 && (
            <tr>
              <td colSpan={columns.length}>
                <CustomPagination
                  page={page}
                  size={size}
                  totalElements={totalElements ?? 0}
                  onPageChange={onPageChange}
                  onPageSizeChange={onPageSizeChange}
                  pageSizeOptions={pageSizeOptions}
                />
              </td>
            </tr>
          )}
        </tfoot>
      </table>
    </div>
  );
};