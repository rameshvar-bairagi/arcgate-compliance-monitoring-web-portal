// src/components/common/AuthGuard.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { useEffect } from 'react';
import AdminLayout from '../layout/AdminLayout';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === '/login';

  useEffect(() => {
    if (!isAuthenticated && !isLoginPage) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoginPage, router]);

  if (!isAuthenticated && !isLoginPage) {
    return null;
  }

  return isAuthenticated && !isLoginPage ? (
    <AdminLayout>{children}</AdminLayout>
  ) : (
    <>{children}</>
  );
}