import api from '@/lib/axios';
import type { SystemsApiResponse } from '@/types/systems';
import type { SystemsRequestBody } from '@/types/systems';

export const fetchSystems = async (body: SystemsRequestBody): Promise<SystemsApiResponse> => {
  const res = await api.post('/system', body); // adjust endpoint
  // if (process.env.NODE_ENV === 'development') console.error('fetchSystems', res.data);
  return res.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchSystemNameList = async (): Promise<any | null> => {
  const res = await api.get('/systemNameList'); // adjust endpoint
  // if (process.env.NODE_ENV === 'development') console.error('fetchSystemNameList', res.data);
  return res.data;
};