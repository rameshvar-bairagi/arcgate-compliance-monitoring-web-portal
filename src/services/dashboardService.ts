import axios from 'axios';
import { API_BASE_URL } from '@/constants/api';
import { store } from '@/store'; // Access token from Redux if needed
import { ComplianceRequestBody } from '@/types/dashboard';
import { QueryFunctionContext } from '@tanstack/react-query'

export const fetchDashboardAlerts = async () => {
  const state = store.getState();
  const token = state.auth.token;

  const res = await axios.get(`${API_BASE_URL}/alert`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Set Bearer token here
    },
    withCredentials: true, // Optional: needed if backend sets cookies
  });
  
  console.log('fetchDashboardAlerts', res.data)
  return res.data;
};

export const fetchDashboardCompliance = async (
  context: QueryFunctionContext<[string, ComplianceRequestBody]>
) => {
  const [, body] = context.queryKey;
  
  const state = store.getState();
  const token = state.auth.token;

  const res = await axios.post(`${API_BASE_URL}/dashboard`, body, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  console.log('fetchDashboardCompliance', res.data);
  return res.data;
};