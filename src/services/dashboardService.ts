import api from '@/lib/axios';
import { ComplianceRequestBody } from '@/types/dashboard';
import { QueryFunctionContext } from '@tanstack/react-query'

export const fetchDashboardAlerts = async (
  context: QueryFunctionContext<[string, ComplianceRequestBody]>
) => {
  const [, body] = context.queryKey;
  const requestBody = {
    // date: body.date,
    date: ``,
  };

  const res = await api.post('/alert', requestBody);
  // if (process.env.NODE_ENV === 'development') console.error('fetchDashboardAlerts', res.data);
  return res.data;
};

export const fetchDashboardCompliance = async (
  context: QueryFunctionContext<[string, ComplianceRequestBody]>
) => {
  const [, body] = context.queryKey;
  const res = await api.post('/dashboard', body);
  // if (process.env.NODE_ENV === 'development') console.error('fetchDashboardCompliance', res.data);
  return res.data;
};