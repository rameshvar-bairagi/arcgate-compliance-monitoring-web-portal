import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks/useRedux';
import { login, logout } from '@/store/slices/authSlice';
import { refreshToken } from '@/services/auth';
import { AxiosError } from 'axios';

export const useInitializeAuth = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        // const token = await refreshToken();
        const token = localStorage.getItem('token');
        if (token) {
          localStorage.setItem('token', token);
          dispatch(login({ token }));
        } else {
          dispatch(logout());
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }  catch (err: any) {
        const axiosErr = err as AxiosError;
        const status = axiosErr?.response?.status;
        if ([403, 404, 500].includes(status ?? 0)) {
          setError(axiosErr);
        }
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [dispatch]);

  return { loading, error };
};