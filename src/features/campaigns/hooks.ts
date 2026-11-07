'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useNotificationsToasts from '@/hooks/useNotificationsToasts';
import { useApi } from '@/lib/api/ApiProvider';
import { getErrorMessage } from '@/lib/api/client';
import type { CreateCampaignInput } from '@/lib/api/types';
import { queryKeys } from '@/lib/query-keys';

export const useCampaigns = () => {
  const api = useApi();
  return useQuery({ queryKey: queryKeys.campaigns, queryFn: () => api.campaigns.list() });
};

export const useCreateCampaign = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { errorToast } = useNotificationsToasts();

  return useMutation({
    mutationFn: (input: CreateCampaignInput) => api.campaigns.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.campaigns }),
    onError: (error) => errorToast(getErrorMessage(error)),
  });
};
