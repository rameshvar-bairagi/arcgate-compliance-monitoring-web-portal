import { useQuery } from '@tanstack/react-query';
import { fetchAlerts } from '@/services/allApiService';
import type { AlertsRequestBody, AlertsApiResponse } from '@/types/alerts';
import { AxiosError } from 'axios';

export const useAlerts = (requestBody: AlertsRequestBody, enabled: boolean = true) => {
  const { data, isLoading, error, refetch } = useQuery<AlertsApiResponse>({
    queryKey: ['systems', requestBody],
    queryFn: async () => {
      const apiData = await fetchAlerts(requestBody);
      return apiData;
    },
    enabled,
    // keepPreviousData: true, // smooth pagination / filtering
    staleTime: 1000 * 60, // 1 min
    retry: false, // Don't retry on error
  });

  return {
    alertsData: data,
    alertsLoading: isLoading,
    alertsError: error ?? null,
    refetchAlerts: refetch, // manually refetch alerts only
    // refetchAll, // call both in parallel
  };
};
