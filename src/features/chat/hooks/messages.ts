'use client';

import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApi } from '@/lib/api/ApiProvider';
import { getErrorMessage } from '@/lib/api/client';
import type { Message, SendMessageInput } from '@/lib/api/types';
import { queryKeys } from '@/lib/query-keys';
import useNotificationsToasts from '@/hooks/useNotificationsToasts';

/** Messages of a conversation, newest first. */
export const useMessages = (leadId: string) => {
  const api = useApi();
  return useQuery({
    queryKey: queryKeys.conversations.messages(leadId),
    queryFn: () => api.conversations.messages(leadId),
  });
};

/**
 * Applies live message events to the cache. The subscription also keeps the
 * connection that `sendMessage` writes to open, so mount it alongside the composer.
 */
export const useMessagesRealtime = (leadId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  useEffect(
    () =>
      api.realtime.subscribeMessages(leadId, (event) => {
        queryClient.setQueryData<Message[]>(queryKeys.conversations.messages(leadId), (prev) => {
          if (!prev) return prev;

          if (event.type === 'new_message') {
            return prev.some((message) => message.id === event.payload.id) ? prev : [event.payload, ...prev];
          }

          const { message_id, status } = event.payload;
          return prev.map((message) => (message.id === message_id ? { ...message, status } : message));
        });
      }),
    [api, queryClient, leadId],
  );
};

export const useSendMessage = (leadId: string) => {
  const api = useApi();
  const { errorToast } = useNotificationsToasts();

  return useMutation({
    mutationFn: (input: SendMessageInput) => api.realtime.sendMessage(leadId, input),
    onError: (error) => errorToast(getErrorMessage(error)),
  });
};
