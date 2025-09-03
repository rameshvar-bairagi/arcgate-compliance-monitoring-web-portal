/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/lib/axios';
import { AlertsApiResponse, AlertsRequestBody, AlertsUpdateStatus } from '@/types/alerts';
import { PostGroupsRequestBody } from '@/types/groups';
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

export const CheckExistRules = async (name: number | string): Promise<{ data: any; status: number; statusText: string } | null> => {
  const res = await api.get(`/compliance-rules/exists`, {
    params: { name },
  });
  return { data: res.data, status: res.status, statusText: res.statusText };
};

export const postComplianceRules = async (body: PostRulesRequestBody): Promise<any | null> => {
  const res = await api.post('/compliance-rules', body); // adjust endpoint
  // if (process.env.NODE_ENV === 'development') console.error('fetchSystems', res.data);
  return res.data;
};

export const putComplianceRules = async (body: PostRulesRequestBody): Promise<any | null> => {
  const res = await api.put('/compliance-rules', body); // adjust endpoint
  // if (process.env.NODE_ENV === 'development') console.error('fetchSystems', res.data);
  return res.data;
};

export const deleteComplianceRule = async (id: number | string): Promise<{ data: any; status: number; statusText: string } | null> => {
  const res = await api.delete(`/compliance-rules`, {
    params: { id },
  });
  return { data: res.data, status: res.status, statusText: res.statusText };
};

export const getComplianceRuleById = async (id: number | string): Promise<any | null> => {
  const res = await api.get(`/compliance-rule`, {
    params: { id },
  });
  return res.data;
};

export const fetchClientGroupList = async (): Promise<any | null> => {
  const res = await api.get('/client-groups'); // adjust endpoint
  // if (process.env.NODE_ENV === 'development') console.error('fetchMetricsNameList', res.data);
  return res.data;
};

export const deleteClientGroup = async (id: number | string): Promise<{ data: any; status: number; statusText: string } | null> => {
  const res = await api.delete(`/client-group`, {
    params: { id },
  });
  return { data: res.data, status: res.status, statusText: res.statusText };
};

export const CheckExistGroups = async (name: number | string): Promise<{ data: any; status: number; statusText: string } | null> => {
  const res = await api.get(`/client-group/exists`, {
    params: { name },
  });
  return { data: res.data, status: res.status, statusText: res.statusText };
};

export const postClientGroups = async (body: PostGroupsRequestBody): Promise<any | null> => {
  const res = await api.post('/client-group', body); // adjust endpoint
  // if (process.env.NODE_ENV === 'development') console.error('fetchSystems', res.data);
  return res.data;
};

export const putClientGroups = async (body: PostGroupsRequestBody): Promise<any | null> => {
  if (!body?.id) throw new Error("ID is required for PUT request");

  const res = await api.put(`/client-group/${body.id}`, body);
  return res.data;
};

export const getClientRuleById = async (id: number | string): Promise<any | null> => {
  const res = await api.get(`/client-group`, {
    params: { id },
  });
  return res.data;
};

export const fetchAlerts = async (body: AlertsRequestBody): Promise<AlertsApiResponse> => {
  const res = await api.get(`/alerts`, {
    params: {
      date: body?.date,
      page: body?.page,
      size: body?.size,
    },
  });
  return res.data;
};

export const updateAlertStatus = async (body: AlertsUpdateStatus): Promise<{ data: any; status: number; statusText: string } | null> => {
  const res = await api.put(`/update-status`, body);
  return { data: res.data, status: res.status, statusText: res.statusText };
};