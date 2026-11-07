'use client';

import { useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApi } from '@/lib/api/ApiProvider';
import type { Conversation } from '@/lib/api/types';
import { queryKeys } from '@/lib/query-keys';
import { useWorkspace } from '@/features/workspace/hooks';
import useNotificationsToasts from '@/hooks/useNotificationsToasts';
import { useInboxTab } from '@/features/chat/context';
import {
  findCachedConversation,
  syncConversationInLists,
  type ConversationListFilter,
} from '@/features/chat/hooks/cache';

export const CONVERSATIONS_PAGE_SIZE = 15;
export const SEARCH_PARAM = 'search';

/** Lead id of the open conversation (`/conversations/[sid]`), if any. */
export const useCurrentLeadId = () => {
  const params = useParams<{ sid?: string }>();
  return params?.sid ?? null;
};

/** The committed inbox search term from the `?search=` URL param. */
export const useConversationSearch = () => {
  const searchParams = useSearchParams();
  return searchParams.get(SEARCH_PARAM) || null;
};

export const useConversationList = (filter: ConversationListFilter) => {
  const api = useApi();
  const { data: workspace } = useWorkspace();

  const query = useInfiniteQuery({
    queryKey: queryKeys.conversations.list(filter),
    queryFn: ({ pageParam }) =>
      api.conversations.list({
        page: pageParam,
        size: CONVERSATIONS_PAGE_SIZE,
        assistNeeded: filter.assistNeeded,
        search: filter.search,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.pages > lastPage.page ? lastPage.page + 1 : undefined),
    enabled: Boolean(workspace?.active),
  });

  // Realtime inserts can duplicate a conversation that also arrives on a later page.
  const conversations = useMemo(() => {
    const seen = new Set<string>();
    return (query.data?.pages ?? [])
      .flatMap((page) => page.items)
      .filter((conversation) => {
        if (seen.has(conversation.lead_id)) return false;
        seen.add(conversation.lead_id);
        return true;
      });
  }, [query.data]);

  return { ...query, conversations };
};

/** The list for the selected inbox tab and the current search. */
export const useInboxConversations = () => {
  const { activeTab } = useInboxTab();
  const search = useConversationSearch();
  return useConversationList({ assistNeeded: activeTab === 'assist-needed', search });
};

export const useConversation = (leadId: string | null) => {
  const api = useApi();
  return useQuery({
    queryKey: queryKeys.conversations.detail(leadId ?? ''),
    queryFn: () => api.conversations.get(leadId as string),
    enabled: Boolean(leadId),
  });
};

export const useConversationMetrics = () => {
  const api = useApi();
  return useQuery({ queryKey: queryKeys.conversations.metrics, queryFn: () => api.conversations.metrics() });
};

export const useConversationSummary = (leadId: string) => {
  const api = useApi();
  return useQuery({
    queryKey: queryKeys.conversations.summary(leadId),
    queryFn: () => api.conversations.getSummary(leadId),
  });
};

/** Hand a conversation over to a human (`toHuman: true`) or back to the AI assistant. */
export const useSetHandover = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { errorToast } = useNotificationsToasts();

  return useMutation({
    mutationFn: ({ leadId, toHuman }: { leadId: string; toHuman: boolean }) =>
      api.conversations.setHandover(leadId, toHuman),
    onSuccess: (_, { leadId, toHuman }) => {
      const cached = findCachedConversation(queryClient, leadId);
      if (cached) {
        const updated: Conversation = { ...cached, transferred_to_human: toHuman };
        queryClient.setQueryData(queryKeys.conversations.detail(leadId), updated);
        syncConversationInLists(queryClient, updated);
      } else {
        void queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all });
      }
      void queryClient.invalidateQueries({ queryKey: queryKeys.conversations.metrics });
    },
    onError: () => errorToast('Oops! Something went wrong. Please try again.'),
  });
};

/** Keep inbox lists, conversation details and metrics in sync with live conversation updates. */
export const useConversationsRealtime = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  useEffect(
    () =>
      api.realtime.subscribeConversations((conversation) => {
        const previous = findCachedConversation(queryClient, conversation.lead_id);

        syncConversationInLists(queryClient, conversation);
        if (queryClient.getQueryData(queryKeys.conversations.detail(conversation.lead_id))) {
          queryClient.setQueryData(queryKeys.conversations.detail(conversation.lead_id), conversation);
        }

        if (Boolean(previous?.transferred_to_human) !== conversation.transferred_to_human) {
          void queryClient.invalidateQueries({ queryKey: queryKeys.conversations.metrics });
        }
      }),
    [api, queryClient],
  );
};
