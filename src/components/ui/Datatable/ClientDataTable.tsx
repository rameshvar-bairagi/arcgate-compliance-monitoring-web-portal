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
  data: string | null;   // field in row
  title: string;  // display heading
  orderable?: boolean;
  render?: (data: any, type: any, row: any) => string;
  className?: string;
}

interface ClientDataTableProps {
  id: string;
  columns: ColumnConfig[];
  data: any[]; // strongly type it
  onViewClick?: (id: string) => void;
  onEditClick?: (id: string) => void;
  onDeleteClick?: (id: string) => void;
  searching?: boolean;
  order?: number;
  columnDefs?: any[];
  exportButtons?: string[];
  domLayout?: string;
}

export const ClientDataTable: React.FC<ClientDataTableProps> = ({
  id,
  columns,
  data,
  onViewClick,
  onEditClick,
  onDeleteClick,
  searching = true,
  order = 0, // this is which column default desc order. pass prop 0, 1, 2, 3, 4 etc
  columnDefs = [{ orderable: false, targets: "_all" }], // default and specific disable { orderable: false, targets: [0, 2] }, 
  exportButtons = ["csv", "excel", "pdf", "print"], // {["csv", "excel", "pdf", "print"]}
  domLayout = "Bfrtip", // Bfrtip, Brtip
}) => {
  const initialized = useRef(false);

  // Init DataTable
  useEffect(() => {
    if (!initialized.current) {
      $(`#${id}`).DataTable({
        rowId: "_rowId",
        paging: true,   // disable DataTables UI paging
        info: true,     // optional: hides "Showing 1 of N"
        responsive: true,
        lengthChange: true,
        lengthMenu: [[-1, 10, 25, 50, 100], ["All", 10, 25, 50, 100]],
        pageLength: -1, // default to "All"
        autoWidth: false,
        processing: true,
        searching: searching,
        order: [[order, "desc"]],  // sort by column index (0-based)
        columnDefs: columnDefs,
        buttons: exportButtons,
        // dom: domLayout,
        columns: columns.map((col) => ({
            ...col,
            render: col.render
                ? (data: any, type: any, row: any) => col.render!(data, type, row) // use custom render if provided
                : (value: any) => {
                    if (value == null) return "";
                    if (col.data === "systemIps") {
                      if (!value || value.length === 0) {
                        return `<span class="badge badge-light m-1">All Systems</span>`;
                      }
                    }
                    if (Array.isArray(value)) {
                      return value
                        .map((v) => {
                          if (typeof v === "object" && v?.metricsName) {
                            return `<span class="badge badge-light m-1">${v.metricsName}</span>`;
                          }
                          if (typeof v === "object" && v?.name) {
                            return `<span class="badge badge-light m-1">${v.name}</span>`;
                          }
                          return `<span class="badge badge-light m-1">${
                            String(v).charAt(0).toUpperCase() +
                            String(v).slice(1).toLowerCase()
                          }</span>`;
                        })
                        .join(" ");
                    }

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
    if (initialized.current) {
      $(`#${id}`).off("click", ".view-link"); // avoid duplicates
      $(`#${id}`).off("click", ".edit-link");
      $(`#${id}`).off("click", ".delete-link");

      $(`#${id}`).on("click", ".view-link", function (e) {
        e.preventDefault();
        const viewId = $(this).data("id");
        if (onViewClick) onViewClick(String(viewId));
      });

      // Handle Edit
      $(`#${id}`).on("click", ".edit-link", function (e) {
        e.preventDefault();
        const editId = $(this).data("id");
        if (onEditClick) onEditClick(String(editId));
      });

      // Handle Delete
      $(`#${id}`).on("click", ".delete-link", function (e) {
        e.preventDefault();
        const deleteId = $(this).data("id");
        if (onDeleteClick) onDeleteClick(String(deleteId));
      });
    }
  }, [id, onViewClick, onEditClick, onDeleteClick]);

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
    </table>
  );
};