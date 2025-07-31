import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks/useRedux';
import { login, logout } from '@/store/slices/authSlice';
import { refreshToken } from '@/services/auth';

export const useInitializeAuth = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        const token = await refreshToken();
        if (token) {
          localStorage.setItem('token', token);
          dispatch(login({ token }));
        } else {
          dispatch(logout());
        }
      } catch {
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [dispatch]);

  return { loading };
};