"use client";

import { useEffect, useRef } from 'react';
import $ from 'jquery';
import 'datatables.net-bs4';
import 'datatables.net-responsive-bs4';
import 'datatables.net-buttons-bs4';
import 'datatables.net-buttons/js/buttons.html5.min';
import 'datatables.net-buttons/js/buttons.print.min';
import 'datatables.net-buttons/js/buttons.colVis.min';

import jszip from 'jszip';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

declare global {
  interface Window {
    JSZip: typeof jszip;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(pdfMake as any).vfs = (pdfFonts as any).vfs;
window.JSZip = jszip;

interface Props {
  id: string;
}

export const DataTableWrapper: React.FC<Props> = ({ id }) => {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      $(`#${id}`).DataTable({
        responsive: true,
        lengthChange: false,
        autoWidth: false,
        // buttons: ['copy', 'csv', 'excel', 'pdf', 'print', 'colvis'],
        buttons: ['csv', 'excel', 'pdf', 'print'],
        dom: 'Bfrtip',  // Brtip if remove default search then remove 'f' in Bfrtip
      });

      initialized.current = true;
    }
  }, [id]);

  return null;
};
