'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SEARCH_PARAM, useConversationSearch, useInboxConversations } from '@/features/chat/hooks';

/** Below this width the inbox list is the page, so we don't jump into a conversation. */
const MOBILE_QUERY = '(max-width: 1140px)';

/** `/conversations`: on desktop, open the first conversation of the current tab. */
const InboxIndex = () => {
  const router = useRouter();
  const search = useConversationSearch();
  const { conversations } = useInboxConversations();
  const firstLeadId = conversations[0]?.lead_id;

  useEffect(() => {
    if (firstLeadId && !window.matchMedia(MOBILE_QUERY).matches) {
      const query = search ? `?${SEARCH_PARAM}=${encodeURIComponent(search)}` : '';
      router.replace(`/conversations/${firstLeadId}${query}`);
    }
  }, [firstLeadId, search, router]);

  return null;
};

export default InboxIndex;
