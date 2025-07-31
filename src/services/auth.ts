import axios from 'axios';
import { API_BASE_URL } from '@/constants/api';

type LoginPayload = {
  username: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
};

export const refreshToken = async (): Promise<string | null> => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/refresh-token`, // Third-party API endpoint
      {},
      {
        withCredentials: true, // Send secure cookie
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return res.data.token; // assuming response has: { token: "..." }
  } catch (err) {
    console.error('Token refresh failed', err);
    return null;
  }
};

export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await axios.post(`${API_BASE_URL}/authenticate`, payload, {
    withCredentials: true, // for refresh token cookie
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};