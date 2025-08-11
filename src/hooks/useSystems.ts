import { useQuery } from '@tanstack/react-query';
import { fetchSystems } from '@/services/systemsService';
import { transformApiToSystemsList } from '@/utils/systems';
import type { SystemsRequestBody, SystemsListData } from '@/types/systems';
import { AxiosError } from 'axios';

export const useSystems = (requestBody: SystemsRequestBody, enabled: boolean = true) => {
  const {
    data: systemsData,
    isLoading: systemsLoading,
    error: systemsError,
    refetch: refetchSystems, // custom alias
  } = useQuery<SystemsListData>({
    queryKey: ['systems', requestBody],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryFn: async () => {
      const apiData = await fetchSystems(requestBody);
      return transformApiToSystemsList(apiData);
    },
    enabled,
    staleTime: 1000 * 60,
    retry: false, // Don't retry on error
  });

  return {
    systemsData,
    systemsLoading,
    systemsError: systemsError as AxiosError | null,
    refetchSystems, // manually refetch alerts only
    // refetchAll, // call both in parallel
  };
};
