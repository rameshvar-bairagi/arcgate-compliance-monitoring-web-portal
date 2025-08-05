import api from '@/lib/axios';
import { ComplianceRequestBody } from '@/types/dashboard';
import { QueryFunctionContext } from '@tanstack/react-query'

export const fetchDashboardAlerts = async (
  context: QueryFunctionContext<[string, ComplianceRequestBody]>
) => {
  const [, body] = context.queryKey;
  const requestBody = {
    date: body.date,
  };

  const res = await api.post('/alert', requestBody);
  console.log('fetchDashboardAlerts', res.data)
  return res.data;
};

export const fetchDashboardCompliance = async (
  context: QueryFunctionContext<[string, ComplianceRequestBody]>
) => {
  const [, body] = context.queryKey;
  const res = await api.post('/dashboard', body);
  console.log('fetchDashboardCompliance', res.data);
  return res.data;
};