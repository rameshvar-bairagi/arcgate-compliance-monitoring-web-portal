// hooks/useSystemNameList.ts
import { useQuery } from '@tanstack/react-query';
import { fetchSystemNameList } from '@/services/systemsService';
import { AxiosError } from 'axios';

export const useSystemNameList = (enabled: boolean = true) => {
  const {
    data: systemNameList,
    isLoading: systemNameListLoading,
    error: systemNameListError,
    refetch: refetchSystemNameList,
  } = useQuery<string[]>({
    queryKey: ['systemNameList'],
    queryFn: fetchSystemNameList, // no transform needed
    enabled,
    staleTime: 1000 * 60,
    retry: false,
  });

  return {
    systemNameList,
    systemNameListLoading,
    systemNameListError: systemNameListError as AxiosError | null,
    refetchSystemNameList,
  };
};
