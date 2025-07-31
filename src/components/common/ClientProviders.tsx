// src/components/common/ClientProviders.tsx
'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import BodyThemeManager from './BodyThemeManager';
import AdminScripts from './AdminScripts';
import PreloaderManager from './PreloaderManager';
import AuthGuard from './AuthGuard';
import { useInitializeAuth } from '@/hooks/useInitializeAuth';

const queryClient = new QueryClient();

function ProvidersWrapper({ children }: { children: ReactNode }) {
  const { loading } = useInitializeAuth();
  if (loading) {
    return null; // or show a spinner if needed
  }

  return (
    <>
      <BodyThemeManager />
      <AdminScripts />
      <PreloaderManager />
      <AuthGuard>{children}</AuthGuard>
      <ReactQueryDevtools initialIsOpen={false} position="bottom" />
    </>
  );
}

export default function ClientProviders({ children }: { children: ReactNode }) {

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ProvidersWrapper>{children}</ProvidersWrapper>
      </QueryClientProvider>
    </Provider>
  );
}
