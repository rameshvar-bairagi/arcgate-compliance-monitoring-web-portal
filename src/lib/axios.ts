import axios from 'axios';
import { store } from '@/store';
import { logout, login } from '@/store/slices/authSlice';
import { refreshToken } from '@/services/auth';
import { API_BASE_URL } from '@/constants/api';

const api = axios.create({
  baseURL: API_BASE_URL,  // "http://192.168.0.238:8080/api/metrics";
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      typeof window !== 'undefined'
    ) {
      originalRequest._retry = true;
      try {
        const token = await refreshToken() || ''; // Use from auth.ts
        if (!token) throw new Error('Failed to refresh token');

        store.dispatch(login({ token }));

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (err) {
        store.dispatch(logout());
        // window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;