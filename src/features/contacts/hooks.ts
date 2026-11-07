'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useNotificationsToasts from '@/hooks/useNotificationsToasts';
import { useApi } from '@/lib/api/ApiProvider';
import { getErrorMessage } from '@/lib/api/client';
import type { CreateContactInput } from '@/lib/api/types';
import { queryKeys } from '@/lib/query-keys';

export const useContacts = () => {
  const api = useApi();
  return useQuery({ queryKey: queryKeys.contacts, queryFn: () => api.contacts.list() });
};

export const useCreateContact = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { errorToast } = useNotificationsToasts();

  return useMutation({
    mutationFn: (input: CreateContactInput) => api.contacts.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.contacts }),
    onError: (error) => errorToast(getErrorMessage(error)),
  });
};

export const useDeleteContact = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { errorToast } = useNotificationsToasts();

  return useMutation({
    mutationFn: (id: string) => api.contacts.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.contacts }),
    onError: (error) => errorToast(getErrorMessage(error)),
  });
};

export const useDeleteContacts = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { errorToast } = useNotificationsToasts();

  return useMutation({
    mutationFn: (ids: string[]) => api.contacts.removeMany(ids),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.contacts }),
    onError: (error) => errorToast(getErrorMessage(error)),
  });
};
