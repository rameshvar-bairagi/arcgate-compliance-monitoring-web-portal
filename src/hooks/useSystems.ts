import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchSystems } from '@/services/allApiService';
import { transformApiResponse } from '@/utils/systems';
import type { SystemsRequestBody, SystemsListData } from '@/types/systems';
import { AxiosError } from 'axios';

export const useSystems = (requestBody: SystemsRequestBody, enabled: boolean = true) => {
  const queryKey = [
    'systems',
    requestBody.date,
    requestBody.systemName,
    requestBody.complianceRule,
    requestBody.clientGroup,
    (requestBody.metricList ?? []).join(','),
    requestBody.page,
    requestBody.size,
    requestBody.sortBy ?? '',
    requestBody.sortDirection ?? '',
  ];

  const query = useQuery<SystemsListData>({
    queryKey,
    queryFn: async () => {
      const apiData = await fetchSystems(requestBody);
      return transformApiResponse(apiData);
    },
    enabled,
    // Replace keepPreviousData with placeholderData for v5 compatibility
    placeholderData: (prevData) => prevData ?? undefined,
    staleTime: 1000 * 60,
    retry: false,
  });

  return {
    systemsData: query?.data,
    systemsLoading: query?.isLoading,
    systemsError: query?.error ?? null,
    refetchSystems: query?.refetch, // manually refetch alerts only
    // refetchAll, // call both in parallel
  };
};
