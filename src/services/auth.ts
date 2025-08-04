import api from '@/lib/axios';

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