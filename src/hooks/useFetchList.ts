// hooks/useFetchList.ts
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useFetchList = <T>(
  queryKey: string[],
  queryFn: () => Promise<T[]>,
  enabled: boolean = true
) => {
  const { data, isLoading, error, refetch } = useQuery<T[]>({
    queryKey,
    queryFn,
    enabled,
    staleTime: 1000 * 60,
    retry: false,
  });

  return {
    list: data,
    loading: isLoading,
    error: error as AxiosError | null,
    refetch,
  };
};