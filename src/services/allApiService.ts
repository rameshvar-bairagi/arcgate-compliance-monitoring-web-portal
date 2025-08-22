/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/lib/axios';
import { PostRulesRequestBody } from '@/types/rules';
import type { SystemsApiResponse, SystemsRequestBody } from '@/types/systems';

export const fetchSystems = async (body: SystemsRequestBody): Promise<SystemsApiResponse> => {
  const res = await api.post('/system', body); // adjust endpoint
  // if (process.env.NODE_ENV === 'development') console.error('fetchSystems', res.data);
  return res.data;
};

export const fetchSystemNameList = async (): Promise<any | null> => {
  const res = await api.get('/systemNameList'); // adjust endpoint
  // if (process.env.NODE_ENV === 'development') console.error('fetchSystemNameList', res.data);
  return res.data;
};

export const fetchMetricsNameList = async (): Promise<any | null> => {
  const res = await api.get('/metricsList'); // adjust endpoint
  // if (process.env.NODE_ENV === 'development') console.error('fetchMetricsNameList', res.data);
  return res.data;
};

export const fetchComplianceRulesList = async (): Promise<any | null> => {
  const res = await api.get('/compliance-rules'); // adjust endpoint
  // if (process.env.NODE_ENV === 'development') console.error('fetchMetricsNameList', res.data);
  return res.data;
};

export const fetchAllComplianceRulesList = async (): Promise<any | null> => {
  const res = await api.get('/all-compliance-rules'); // adjust endpoint
  // if (process.env.NODE_ENV === 'development') console.error('fetchMetricsNameList', res.data);
  return res.data;
};

export const postComplianceRules = async (body: PostRulesRequestBody): Promise<any | null> => {
  const res = await api.post('/compliance-rules', body); // adjust endpoint
  // if (process.env.NODE_ENV === 'development') console.error('fetchSystems', res.data);
  return res.data;
};

export const fetchClientGroupList = async (): Promise<any | null> => {
  const res = await api.get('/client-groups'); // adjust endpoint
  // if (process.env.NODE_ENV === 'development') console.error('fetchMetricsNameList', res.data);
  return res.data;
};