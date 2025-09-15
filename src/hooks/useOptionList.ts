/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useOptionList.ts
import { useFetchList } from '@/hooks/useFetchList';
import { fetchSystemNameList, fetchMetricsNameList, fetchComplianceRulesList, fetchAllComplianceRulesList, fetchClientGroupList, fetchScheduledReportsList } from '@/services/allApiService';

// export const useSystemNameList = (enabled = true) =>
//   useFetchList<any>(['systemNameList'], fetchSystemNameList, enabled);

export function useSystemNameList(date: string) {
  return useFetchList<any>(
    ['systemNameList', date],        // include date in query key for caching
    () => fetchSystemNameList(date), // lazy function, not executed yet
    !!date                           // only run when date exists
  );
}

export const useMetricsNameList = (enabled = true) =>
  useFetchList<any>(['metricsNameList'], fetchMetricsNameList, enabled);

export const useComplianceRulesList = (enabled = true) =>
  useFetchList<any>(['complianceRulesList'], fetchComplianceRulesList, enabled);

export const useAllComplianceRulesList = (enabled = true) =>
  useFetchList<any>(['allComplianceRulesList'], fetchAllComplianceRulesList, enabled);

export const useClientGroupList = (enabled = true) =>
  useFetchList<any>(['clientGroupList'], fetchClientGroupList, enabled);

export const useScheduledReportsList = (enabled = true) =>
  useFetchList<any>(['scheduledReportsList'], fetchScheduledReportsList, enabled);
