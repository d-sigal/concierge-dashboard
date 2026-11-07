'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApi } from '@/lib/api/ApiProvider';
import type { CreateTemplateInput, TemplateListParams } from '@/lib/api/types';
import { queryKeys } from '@/lib/query-keys';

export const useTemplates = (params?: TemplateListParams) => {
  const api = useApi();
  return useQuery({ queryKey: queryKeys.templates.list(params), queryFn: () => api.templates.list(params) });
};

export const useCreateTemplate = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTemplateInput) => api.templates.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.templates.all }),
  });
};
