/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useOptionList.ts
import { useFetchList } from '@/hooks/useFetchList';
import { fetchSystemNameList, fetchMetricsNameList, fetchComplianceRulesList, fetchClientGroupList } from '@/services/systemsService';

export const useSystemNameList = (enabled = true) =>
  useFetchList<any>(['systemNameList'], fetchSystemNameList, enabled);

export const useMetricsNameList = (enabled = true) =>
  useFetchList<any>(['metricsNameList'], fetchMetricsNameList, enabled);

export const useComplianceRulesList = (enabled = true) =>
  useFetchList<any>(['complianceRulesList'], fetchComplianceRulesList, enabled);

export const useClientGroupList = (enabled = true) =>
  useFetchList<any>(['clientGroupList'], fetchClientGroupList, enabled);
