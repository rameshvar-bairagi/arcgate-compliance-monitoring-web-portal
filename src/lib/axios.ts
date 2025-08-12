import axios from 'axios';
import { store } from '@/store';
import { logout, login } from '@/store/slices/authSlice';
import { refreshToken } from '@/services/auth';
import { toast } from 'react-toastify';

const api = axios.create({
  // baseURL: API_BASE_URL,  // "http://192.168.0.238:8080/api/metrics";
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;
    if (status === 401 &&
      !originalRequest._retry &&
      typeof window !== 'undefined'
    ) {
      originalRequest._retry = true;
      try {
        const token = await refreshToken() || ''; // Use from auth.ts
        // if (!token) console.log('Failed to refresh token');
        if (!token) throw new Error('Failed to refresh token');

        store.dispatch(login({ token }));

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (err) {
        store.dispatch(logout());
        window.location.href = '/login';
        toast.error('Session expired. Please log in again.');
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;