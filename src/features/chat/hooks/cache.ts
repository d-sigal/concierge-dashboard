import type { InfiniteData, QueryClient, QueryKey } from '@tanstack/react-query';
import type { Conversation, Page } from '@/lib/api/types';
import { queryKeys } from '@/lib/query-keys';

export type ConversationListData = InfiniteData<Page<Conversation>, number>;

export interface ConversationListFilter {
  assistNeeded: boolean;
  search: string | null;
}

const getFilter = (queryKey: QueryKey): ConversationListFilter =>
  (queryKey[2] as ConversationListFilter | undefined) ?? { assistNeeded: false, search: null };

const findInList = (data: ConversationListData | undefined, leadId: string) => {
  for (const page of data?.pages ?? []) {
    const match = page.items.find((item) => item.lead_id === leadId);
    if (match) return match;
  }
  return undefined;
};

/** Latest known copy of a conversation from the detail cache or any cached list. */
export const findCachedConversation = (queryClient: QueryClient, leadId: string) => {
  const detail = queryClient.getQueryData<Conversation>(queryKeys.conversations.detail(leadId));
  if (detail) return detail;

  for (const [, data] of queryClient.getQueriesData<ConversationListData>({
    queryKey: queryKeys.conversations.lists,
  })) {
    const match = findInList(data, leadId);
    if (match) return match;
  }
  return undefined;
};

const withoutConversation = (data: ConversationListData, leadId: string): ConversationListData => ({
  ...data,
  pages: data.pages.map((page) => ({ ...page, items: page.items.filter((item) => item.lead_id !== leadId) })),
});

const prependToFirstPage = (
  data: ConversationListData,
  conversation: Conversation,
): ConversationListData => ({
  ...data,
  pages: data.pages.map((page, index) =>
    index === 0 ? { ...page, items: [conversation, ...page.items] } : page,
  ),
});

const replaceConversation = (
  data: ConversationListData,
  conversation: Conversation,
): ConversationListData => ({
  ...data,
  pages: data.pages.map((page) => ({
    ...page,
    items: page.items.map((item) => (item.lead_id === conversation.lead_id ? conversation : item)),
  })),
});

/**
 * Reflect an updated conversation in every cached inbox list:
 *  - lists it no longer belongs to (assist needed, but handed back to the AI) drop it;
 *  - a newer last message moves it to the top;
 *  - unknown conversations are added to the top of unfiltered lists (a search may not match them).
 */
export const syncConversationInLists = (queryClient: QueryClient, conversation: Conversation) => {
  for (const [queryKey, data] of queryClient.getQueriesData<ConversationListData>({
    queryKey: queryKeys.conversations.lists,
  })) {
    if (!data?.pages.length) continue;

    const filter = getFilter(queryKey);
    const existing = findInList(data, conversation.lead_id);
    const belongs = !filter.assistNeeded || conversation.transferred_to_human;

    let next: ConversationListData | undefined;
    if (!belongs) {
      next = existing ? withoutConversation(data, conversation.lead_id) : undefined;
    } else if (existing) {
      next =
        conversation.last_message_timestamp > existing.last_message_timestamp
          ? prependToFirstPage(withoutConversation(data, conversation.lead_id), conversation)
          : replaceConversation(data, conversation);
    } else if (!filter.search) {
      next = prependToFirstPage(data, conversation);
    }

    if (next) queryClient.setQueryData(queryKey, next);
  }
};
