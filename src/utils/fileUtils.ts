/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/fileUtils.ts
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Papa from "papaparse";

export const downloadTemplate = (type: "xlsx" | "csv") => {
  const headers = [["System IP"]];
  const data = [...headers];

  if (type === "xlsx") {
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "system_ips_template.xlsx");
  } else {
    const csv = Papa.unparse({ fields: ["System IP"], data: [] });
    saveAs(new Blob([csv], { type: "text/csv;charset=utf-8;" }), "system_ips_template.csv");
  }
};

export const parseFile = (file: File): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    if (file.name.endsWith(".csv")) {
      Papa.parse(file, {
        complete: (results) => {
          const ips = results.data.slice(1).map((row: any) => row[0]).filter(Boolean);
          resolve(ips);
        },
        error: reject,
      });
    } else if (file.name.endsWith(".xlsx")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wb = XLSX.read(e.target?.result, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(ws, { header: 1 });
        const ips = (json as any[][]).slice(1).map((row) => row[0]).filter(Boolean);
        resolve(ips);
      };
      reader.onerror = reject;
      reader.readAsBinaryString(file);
    } else {
      reject(new Error("Unsupported file type"));
    }
  });
};