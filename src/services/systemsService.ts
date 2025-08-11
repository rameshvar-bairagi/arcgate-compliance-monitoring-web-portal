import api from '@/lib/axios';
import type { SystemsApiResponse } from '@/types/systems';
import type { SystemsRequestBody } from '@/types/systems';

export const fetchSystems = async (body: SystemsRequestBody): Promise<SystemsApiResponse> => {
  const res = await api.post('/system', body); // adjust endpoint
  // if (process.env.NODE_ENV === 'development') console.error('fetchSystems', res.data);
  return res.data;
};