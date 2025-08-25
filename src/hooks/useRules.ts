/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from '@tanstack/react-query';
import { postComplianceRules, putComplianceRules } from '@/services/allApiService';
import type { PostRulesRequestBody } from '@/types/rules';
import { AxiosError } from 'axios';

export const useRules = () => {
  const mutation = useMutation<any, Error, { requestBody: PostRulesRequestBody; isEdit?: boolean }>({
    mutationFn: async ({ requestBody, isEdit }) => {
      if (isEdit) {
        // id must be inside requestBody
        if (!requestBody.id) throw new Error("Missing ID for update");
        return await putComplianceRules(requestBody); // API expects id inside body
      } else {
        return await postComplianceRules(requestBody);
      }
    },
  });

  return {
    saveRule: mutation.mutate,
    saveRuleAsync: mutation.mutateAsync,
    saveRuleData: mutation.data,
    saveRuleLoading: mutation.isPending,
    saveRuleError: mutation.error ?? null,
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
