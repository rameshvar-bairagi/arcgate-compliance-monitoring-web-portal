/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
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
import { TableRow } from "@/types/systems";
import { CustomPagination } from "../Pagination/CustomPagination";

declare global {
  interface Window {
    JSZip: typeof jszip;
    __prevPage?: number;
    __prevSize?: number;
  }
}

(pdfMake as any).vfs = (pdfFonts as any).vfs;
window.JSZip = jszip;

interface ColumnConfig {
  data: string;   // field in row
  title: string;  // display heading
}

interface ServerDataTableProps {
  id: string;
  columns: ColumnConfig[];
  data: TableRow[]; // strongly type it
  onViewClick?: (id: string) => void;
  page: number;
  size: number;
  totalElements: number;
  onPageChange: (newPage: number) => void;
  searching?: boolean;
  order?: number;
  columnDefs?: any[];
  exportButtons?: string[];
  // domLayout?: string;
}

export const ServerDataTable: React.FC<ServerDataTableProps> = ({
  id,
  columns,
  data,
  onViewClick,
  page,
  size,
  totalElements,
  onPageChange,
  searching = true,
  order = 0, // this is which column default desc order. pass prop 0, 1, 2, 3, 4 etc
  columnDefs = [{ orderable: false, targets: "_all" }], // default and specific disable { orderable: false, targets: [0, 2] }, 
  exportButtons = ["csv", "excel", "pdf", "print"], // {["csv", "excel", "pdf", "print"]}
  // domLayout = "Bfrtip", // Bfrtip, Brtip
}) => {
  const initialized = useRef(false);

  // Init DataTable
  useEffect(() => {
    if (!initialized.current) {
      $(`#${id}`).DataTable({
        rowId: "_rowId",
        paging: false,   // disable DataTables UI paging
        info: false,     // optional: hides "Showing 1 of N"
        responsive: true,
        lengthChange: false,
        autoWidth: false,
        processing: true,
        searching: searching,
        order: [[order, "desc"]],  // sort by column index (0-based)
        columnDefs: columnDefs,
        buttons: exportButtons,
        // dom: domLayout,
        columns: columns.map((col) => ({
          data: col.data,
          render: (value: any) => {
              if (value == null) return "";

              // Handle IP column as clickable link
              if (col.data.toLowerCase() === "ip") {
                // return `<a href="http://${value}" target="_blank" rel="noopener noreferrer">${value}</a>`;
                return `<a href="#" class="text-primary view-link" data-id="${value}">${value}</a>`;
              }

              if (typeof value === "boolean") return value ? "<span class='text-success'>Compliant</span>" : "<span class='text-danger'>Non-Compliant</span>";

              // Arrays joined with commas
              // if (Array.isArray(value)) {
              //   return value.map((v) => String(v).charAt(0).toUpperCase() + String(v).slice(1).toLowerCase()).join(", ");
              // }
              if (Array.isArray(value)) {
                return value
                  .map(
                    (v) =>
                      `<span class="badge badge-light m-1">
                        ${String(v).charAt(0).toUpperCase() + String(v).slice(1).toLowerCase()}
                      </span>`
                  )
                  .join(" ");
              }

              // Capitalize string values
              if (typeof value === "string") {
                return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
              }
              return value ?? "";
            },
        })),
      });

      initialized.current = true;
    }
  }, [id, columns, data]);

  // Update rows when new data arrives
  useEffect(() => {
    if (initialized.current) {
      const table = $(`#${id}`).DataTable();
      table.clear();
      table.rows.add(data || []);
      table.draw(false);
    }
  }, [data, id, columns]);
  
  useEffect(() => {
    if (initialized.current && onViewClick) {
      $(`#${id}`).off("click", ".view-link"); // avoid duplicates
      $(`#${id}`).on("click", ".view-link", function (e) {
        e.preventDefault();
        const viewId = $(this).data("id");
        onViewClick(String(viewId));
      });
    }
  }, [id, onViewClick]);

  // console.log(data, 'data table');
  // console.log(columns, 'columns table');

  // return null;

  return (
    <table id={id} className="table table-bordered table-striped">
      <thead>
        <tr>
          {columns.map((col, idx) => (
            <th key={idx}>{col.title}</th>
          ))}
        </tr>
      </thead>
      <tbody />
      <tfoot>
        <tr>
          <td colSpan={columns.length}>
            <CustomPagination
              page={page}
              size={size}
              totalElements={totalElements ?? 0}
              onPageChange={onPageChange}
            />
          </td>
        </tr>
      </tfoot>
    </table>
  );
};