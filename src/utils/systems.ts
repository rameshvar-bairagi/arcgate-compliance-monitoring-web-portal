// src/utils/systems.ts
import type { SystemsApiResponse, SystemsListData, SystemsItem } from '@/types/systems';

export function transformApiToSystemsList(apiData: SystemsApiResponse): SystemsListData {
  const result: SystemsListData = {};

  for (const [ip, dates] of Object.entries(apiData || {})) {
    const arr: SystemsItem[] = [];

    for (const [date, dayData] of Object.entries(dates || {})) {
      const complianceServices = Array.isArray(dayData.complianceServices) ? dayData.complianceServices : [];
      const nonComplianceServices = Array.isArray(dayData.nonComplianceServices) ? dayData.nonComplianceServices : [];

      const isCompliant = nonComplianceServices.length === 0;

      arr.push({
        ip,
        systemDate: date,
        complianceServices,
        nonComplianceServices,
        complianceStatus: isCompliant,
      });
    }

    // optionally sort dates descending
    arr.sort((a, b) => b.systemDate.localeCompare(a.systemDate));

    result[ip] = arr;
  }

  return result;
}