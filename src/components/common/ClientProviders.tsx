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
import { ErrorDisplay } from '@/components/ErrorPages/ErrorDisplay';


const queryClient = new QueryClient();

function ProvidersWrapper({ children }: { children: ReactNode }) {
  const { loading, error } = useInitializeAuth();

  if (loading) {
    return null; // or show a spinner if needed
  }

  if (error && error?.response?.status) return <ErrorDisplay errorCode={error?.response?.status} />;

  return (
    <>
      <BodyThemeManager />
      <AdminScripts />
      {loading && <PreloaderManager />}
      <AuthGuard>{children}</AuthGuard>
      {/* Show devtools only in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      )}
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
