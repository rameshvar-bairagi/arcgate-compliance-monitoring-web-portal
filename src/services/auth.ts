import api from '@/lib/axios';
import { UserResponse } from '@/types/user';

type LoginPayload = {
  username: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
};

export const refreshToken = async (): Promise<string | null> => {
  try {
    const res = await api.post('/refresh-token', {});
    return res.data.token; // assuming response has: { token: "..." }
  } catch (err) {
    console.error('Token refresh failed', err);
    return null;
  }
};

export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await api.post('/authenticate', payload);
  return response.data;
};

export const logoutUser = async (): Promise<string | null> => {
  const response = await api.post('/logout');
  return response.data;
};

export const getUserProfile = async (): Promise<UserResponse> => {
  const response = await api.get('/user/profile');
  return response.data;
};