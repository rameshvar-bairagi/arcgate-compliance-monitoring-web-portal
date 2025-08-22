/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useOptionList.ts
import { useFetchList } from '@/hooks/useFetchList';
import { fetchSystemNameList, fetchMetricsNameList, fetchComplianceRulesList, fetchAllComplianceRulesList, fetchClientGroupList } from '@/services/allApiService';

export const useSystemNameList = (enabled = true) =>
  useFetchList<any>(['systemNameList'], fetchSystemNameList, enabled);

export const useMetricsNameList = (enabled = true) =>
  useFetchList<any>(['metricsNameList'], fetchMetricsNameList, enabled);

export const useComplianceRulesList = (enabled = true) =>
  useFetchList<any>(['complianceRulesList'], fetchComplianceRulesList, enabled);

export const useAllComplianceRulesList = (enabled = true) =>
  useFetchList<any>(['allComplianceRulesList'], fetchAllComplianceRulesList, enabled);

export const useClientGroupList = (enabled = true) =>
  useFetchList<any>(['clientGroupList'], fetchClientGroupList, enabled);
