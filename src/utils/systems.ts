// src/utils/systems.ts
import type { ApiResponse, SystemsListData, TableRow } from '@/types/systems';

export const transformApiResponse = (res: ApiResponse): SystemsListData => {
  const content: TableRow[] = Object.values(res.data)
    .flat()
    .map((row, idx) => ({
      ...row,
      _rowId: `${row.ip}-${row.systemDate}-${idx}`,
      complianceStatus: row.nonComplianceServices.length === 0
    }));

  return {
    content,
    totalElements: res.totalElements,
    totalPages: res.totalPages
  };
};

// export function transformApiResponse(res: ApiResponse): {
//   content: TableRow[];
//   totalElements: number;
//   totalPages: number;
// } {
//   const content: TableRow[] = [];

//   Object.values(res.data).forEach((byDate) => {
//     Object.values(byDate).forEach((system) => {
//       content.push({
//         ip: system.ip,
//         systemDate: system.systemDate,
//         complianceServices: system.complianceServices,
//         nonComplianceServices: system.nonComplianceServices,
//         complianceStatus: system.nonComplianceServices.length === 0, // ✅ true if no nonCompliance
//       });
//     });
//   });

//   return {
//     content,
//     totalElements: res.totalElements,
//     totalPages: res.totalPages,
//   };
// }