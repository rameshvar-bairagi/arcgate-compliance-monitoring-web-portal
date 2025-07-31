import axios from 'axios';
import { API_BASE_URL } from '@/constants/api';
import { store } from '@/store'; // Access token from Redux if needed

// Fetch Alerts for Dashboard with Authorization
export const fetchDashboardAlerts = async () => {
  const state = store.getState();
  const token = state.auth.token;

  const res = await axios.get(`${API_BASE_URL}/api/metrics/alert`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Set Bearer token here
    },
    // withCredentials: true, // Optional: needed if backend sets cookies
  });
  console.log('fetchDashboardAlerts', res.data)
  return res.data;
};