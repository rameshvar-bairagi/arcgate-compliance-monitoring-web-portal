// hooks/useSystemNameList.ts
import { useQuery } from '@tanstack/react-query';
import { fetchMetricsNameList } from '@/services/systemsService';
import { AxiosError } from 'axios';

export const useMetricsNameList = (enabled: boolean = true) => {
  const {
    data: metricsNameList,
    isLoading: metricsNameListLoading,
    error: metricsNameListError,
    refetch: refetchMetricsNameList,
  } = useQuery<string[]>({
    queryKey: ['metricsNameList'],
    queryFn: fetchMetricsNameList, // no transform needed
    enabled,
    staleTime: 1000 * 60,
    retry: false,
  });

  return {
    metricsNameList,
    metricsNameListLoading,
    metricsNameListError: metricsNameListError as AxiosError | null,
    refetchMetricsNameList,
  };
};
