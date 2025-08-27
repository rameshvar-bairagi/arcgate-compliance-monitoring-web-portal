/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from '@tanstack/react-query';
import { postClientGroups, putClientGroups } from '@/services/allApiService';
import type { PostGroupsRequestBody } from '@/types/groups';
import { AxiosError } from 'axios';

export const useGroups = () => {
  const mutation = useMutation<any, Error, { requestBody: PostGroupsRequestBody; isEdit?: boolean }>({
    mutationFn: async ({ requestBody, isEdit }) => {
      if (isEdit) {
        // id must be inside requestBody
        if (!requestBody.id) throw new Error("Missing ID for update");
        return await putClientGroups(requestBody); // API expects id inside body
      } else {
        return await postClientGroups(requestBody);
      }
    },
  });

  return {
    saveGroup: mutation.mutate,
    saveGroupAsync: mutation.mutateAsync,
    saveGroupData: mutation.data,
    saveGroupLoading: mutation.isPending,
    saveGroupError: mutation.error ?? null,
  };
};