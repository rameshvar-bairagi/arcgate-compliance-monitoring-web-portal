import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks/useRedux';
import { login, logout, setUserProfile } from '@/store/slices/authSlice';
import { getUserProfile, refreshToken } from '@/services/auth';
import { AxiosError } from 'axios';

export const useInitializeAuth = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      try {
        // const token = await refreshToken();
        // console.log(token,'tokentokentokentokentoken');
        const token = localStorage.getItem('token');
        if (token) {
          localStorage.setItem('token', token);
          dispatch(login({ token }));
          const user = await getUserProfile();
          dispatch(setUserProfile(user));
        } else {
          dispatch(logout());
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }  catch (err: any) {
        const axiosErr = err as AxiosError;
        const status = axiosErr?.response?.status;
        if ([402, 404, 500, 501, 502, 503, 504].includes(status ?? 0)) { // 401, 403
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