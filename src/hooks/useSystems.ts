import { useQuery } from '@tanstack/react-query';
import { fetchSystems } from '@/services/systemsService';
import { transformApiResponse } from '@/utils/systems';
import type { SystemsRequestBody, SystemsListData } from '@/types/systems';
import { AxiosError } from 'axios';

export const useSystems = (requestBody: SystemsRequestBody, enabled: boolean = true) => {
  const { data, isLoading, error, refetch } = useQuery<SystemsListData>({
    queryKey: ['systems', requestBody],
    // queryKey: [
    //   'systems',
    //   // requestBody.date,
    //   // requestBody.systemName || null,
    //   // requestBody.metricList?.join(',') || null
    // ],
    queryFn: async () => {
      const apiData = await fetchSystems(requestBody);
      return transformApiResponse(apiData);
    },
    enabled,
    // keepPreviousData: true, // smooth pagination / filtering
    staleTime: 1000 * 60, // 1 min
    retry: false, // Don't retry on error
  });

  return {
    systemsData: data,
    systemsLoading: isLoading,
    systemsError: error ?? null,
    refetchSystems: refetch, // manually refetch alerts only
    // refetchAll, // call both in parallel
  };
};
