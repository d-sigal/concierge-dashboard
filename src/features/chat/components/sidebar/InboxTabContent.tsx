'use client';

import type { ReactNode } from 'react';
import { MagnifyingGlass, Robot } from '@phosphor-icons/react';
import ChatBubble from '@/components/icons/ChatBubble';
import { InfiniteScrollLoader } from '@/components/common/InfiniteScrollLoader';
import { TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useWorkspace } from '@/features/workspace/hooks';
import type { InboxTab } from '@/features/chat/context';
import { useConversationSearch, useInboxConversations } from '@/features/chat/hooks';
import ConversationListItem from '@/features/chat/components/sidebar/ConversationListItem';
import ConversationListSkeleton from '@/features/chat/components/sidebar/ConversationListSkeleton';

const EmptyState = ({ className, children }: { className?: string; children: ReactNode }) => (
  <div className={cn('mx-auto text-center text-sm font-medium tracking-tight', className)}>{children}</div>
);

const WelcomeEmptyState = ({ title }: { title: string }) => (
  <EmptyState>
    <ChatBubble className="mx-auto mb-3 size-14" />
    <p>{title}</p>
    <p>Your client chats will appear here.</p>
  </EmptyState>
);

const InboxEmptyState = ({ tab }: { tab: InboxTab }) => {
  const { data: workspace } = useWorkspace();
  const search = useConversationSearch();

  if (!workspace?.active) return <WelcomeEmptyState title="Welcome aboard!" />;

  if (search) {
    return (
      <EmptyState>
        <MagnifyingGlass className="mx-auto mb-3 size-14 text-primary-600" />
        <p>
          Oops... No results found. <br />
          Try a different search term.
        </p>
      </EmptyState>
    );
  }

  if (tab === 'assist-needed') {
    return (
      <EmptyState className="max-w-[230px] lg:-mt-[150px]">
        <Robot className="mx-auto mb-3 size-14 text-primary-600" weight="fill" />
        <p>Hooray!</p>
        <p>No chat needs your assistance.</p>
      </EmptyState>
    );
  }

  return <WelcomeEmptyState title="No chats yet." />;
};

/** Conversation list of the selected inbox tab. */
const InboxTabContent = ({ tab }: { tab: InboxTab }) => {
  const { isLoading: isWorkspaceLoading } = useWorkspace();
  const list = useInboxConversations();
  const { conversations, hasNextPage, fetchNextPage, isFetchingNextPage } = list;
  const isLoading = isWorkspaceLoading || list.isLoading;
  const isEmpty = !isLoading && conversations.length === 0;

  return (
    <TabsContent
      value={tab}
      className={cn('overflow-auto pt-12 lg:px-4 lg:pt-0', isEmpty && 'grid h-full place-items-center')}
    >
      {isLoading && <ConversationListSkeleton />}
      {isEmpty && <InboxEmptyState tab={tab} />}
      {conversations.map((conversation) => (
        <ConversationListItem conversation={conversation} key={conversation.lead_id} />
      ))}
      <InfiniteScrollLoader
        hasMore={hasNextPage}
        fetchNextPage={fetchNextPage}
        isLoading={isFetchingNextPage}
      />
    </TabsContent>
  );
};

export default InboxTabContent;
