/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from '@tanstack/react-query';
import { postComplianceRules } from '@/services/allApiService';
import type { PostRulesRequestBody } from '@/types/rules';
import { AxiosError } from 'axios';

export const useRules = () => {
  const mutation = useMutation<any, Error, PostRulesRequestBody>({
    mutationFn: async (requestBody: PostRulesRequestBody) => {
      const apiData = await postComplianceRules(requestBody);
      return apiData;
    },
  });

  return {
    postRule: mutation.mutate,          // call this on submit
    postRuleAsync: mutation.mutateAsync, // if you want async/await
    postRulesData: mutation.data,
    postRulesLoading: mutation.isPending,
    postRulesError: mutation.error ?? null,
  };
};

// export const useRules = (requestBody: PostRulesRequestBody, enabled: boolean = true) => {
//   const { data, isLoading, error, refetch } = useQuery<any | null>({
//     queryKey: ['rulesPost', requestBody],
//     queryFn: async () => {
//       const apiData = await postComplianceRules(requestBody);
//       return apiData;
//     },
//     enabled,
//     // keepPreviousData: true, // smooth pagination / filtering
//     staleTime: 1000 * 60, // 1 min
//     retry: false, // Don't retry on error
//   });

//   return {
//     postRulesData: data,
//     postRulesLoading: isLoading,
//     postRulesError: error ?? null,
//     refetchSystems: refetch, // manually refetch alerts only
//     // refetchAll, // call both in parallel
//   };
// };
