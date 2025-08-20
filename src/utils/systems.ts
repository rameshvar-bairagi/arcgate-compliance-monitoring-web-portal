// src/utils/systems.ts
import type { ApiResponse, TableRow } from '@/types/systems';

export function transformApiResponse(res: ApiResponse): {
  content: TableRow[];
  totalElements: number;
  totalPages: number;
} {
  const content: TableRow[] = [];

  Object.values(res.data).forEach((byDate) => {
    Object.values(byDate).forEach((system) => {
      content.push({
        ip: system.ip,
        systemDate: system.systemDate,
        complianceServices: system.complianceServices,
        nonComplianceServices: system.nonComplianceServices,
        complianceStatus: system.nonComplianceServices.length === 0, // ✅ true if no nonCompliance
      });
    });
  });

  return {
    content,
    totalElements: res.totalElements,
    totalPages: res.totalPages,
  };
}