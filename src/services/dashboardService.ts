import api from '@/lib/axios';
import { store } from '@/store'; // Access token from Redux if needed
import { ComplianceRequestBody } from '@/types/dashboard';
import { QueryFunctionContext } from '@tanstack/react-query'

export const fetchDashboardAlerts = async () => {
  // const state = store.getState();
  // const token = state.auth.token;
  const res = await api.post('/alert', {});
  
  console.log('fetchDashboardAlerts', res.data)
  return res.data;
};

export const fetchDashboardCompliance = async (
  context: QueryFunctionContext<[string, ComplianceRequestBody]>
) => {
  const [, body] = context.queryKey;
  // const state = store.getState();
  // const token = state.auth.token;
  const res = await api.post('/dashboard', body);

  console.log('fetchDashboardCompliance', res.data);
  return res.data;
};