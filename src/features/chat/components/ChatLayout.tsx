'use client';

import type { ReactNode } from 'react';
import { BigScreensContainer } from '@/components/ui/BigScreensContainer';
import { Skeleton } from '@/components/ui/skeleton';
import { useWorkspace } from '@/features/workspace/hooks';
import { InboxTabProvider } from '@/features/chat/context';
import { useConversationsRealtime } from '@/features/chat/hooks';
import ChatSidebar from '@/features/chat/components/sidebar/ChatSidebar';

const PLACEHOLDER_CLASS = 'rounded-lg border border-primary-400 bg-[#e7e8e6]';

/** Shown in place of the conversation while the workspace is still being provisioned. */
const InactiveConversationPlaceholder = () => (
  <div className="flex w-full flex-col pl-24 pr-20">
    <div className="mb-10 flex gap-x-4">
      <Skeleton className={`mb-4 h-16 w-16 ${PLACEHOLDER_CLASS}`} />
      <div>
        <Skeleton className={`mb-1 h-6 w-48 ${PLACEHOLDER_CLASS}`} />
        <Skeleton className={`h-5 w-28 ${PLACEHOLDER_CLASS}`} />
      </div>
    </div>
    <Skeleton className={`mb-3 h-24 w-[392px] ${PLACEHOLDER_CLASS}`} />
    <Skeleton className={`mb-10 h-14 w-80 ${PLACEHOLDER_CLASS}`} />
    <Skeleton className={`mb-4 ml-auto h-24 w-80 ${PLACEHOLDER_CLASS}`} />
    <Skeleton className={`mb-4 mt-auto h-12 w-full ${PLACEHOLDER_CLASS}`} />
  </div>
);

const ChatLayout = ({ children }: { children: ReactNode }) => {
  const { data: workspace } = useWorkspace();
  useConversationsRealtime();

  return (
    <InboxTabProvider>
      <BigScreensContainer className="flex h-full flex-col lg:flex-row lg:pr-4">
        <ChatSidebar />
        {workspace && !workspace.active ? (
          <InactiveConversationPlaceholder />
        ) : (
          <div className="flex h-full w-full flex-col">
            <div className="flex h-full flex-grow flex-col space-y-3.5 bg-primary-100">{children}</div>
          </div>
        )}
      </BigScreensContainer>
    </InboxTabProvider>
  );
};

export default ChatLayout;
