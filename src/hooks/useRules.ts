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