'use client';

import Link from 'next/link';
import Flag from '@/components/icons/Flag';
import TextHighlighter from '@/components/common/TextHighlighter';
import type { Conversation } from '@/lib/api/types';
import { cn } from '@/lib/utils';
import { SEARCH_PARAM, useConversationSearch, useCurrentLeadId } from '@/features/chat/hooks';
import { formatConversationTimestamp, getConversationDetails } from '@/features/chat/utils';

interface Props {
  conversation: Conversation;
}

const ConversationListItem = ({ conversation }: Props) => {
  const search = useConversationSearch();
  const isActive = useCurrentLeadId() === conversation.lead_id;
  const { userDisplayName, userInitials } = getConversationDetails(conversation);
  const href = `/conversations/${conversation.lead_id}${search ? `?${SEARCH_PARAM}=${encodeURIComponent(search)}` : ''}`;

  return (
    <Link
      href={href}
      className={cn(
        'group block rounded-lg px-2 pb-2 pt-5 text-left text-sm hover:bg-primary-200 lg:-mx-2',
        'border-b border-b-primary-100 [&:last-of-type]:border-none',
        isActive && 'bg-primary-400',
      )}
    >
      <div className="grid grid-cols-[40px_1fr_50px] gap-x-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary-200 text-base font-semibold transition-colors group-hover:bg-white">
          {userInitials}
        </div>
        <div>
          <div className="line-clamp-1 text-ellipsis break-all font-bold">
            <TextHighlighter text={userDisplayName} highlight={search} />
          </div>
          {conversation.last_message_content && (
            <div className="text-muted-foreground col-start-2 row-span-2 row-start-2 flex items-center gap-x-2">
              <div className="line-clamp-1 text-ellipsis text-sm font-medium">
                <TextHighlighter text={conversation.last_message_content} highlight={search} />
              </div>
            </div>
          )}
        </div>
        {conversation.transferred_to_human && <Flag className="ml-auto text-red" />}
      </div>
      <div className="text-right text-[10px] leading-none text-primary-700">
        {conversation.last_message_timestamp > 0 &&
          formatConversationTimestamp(conversation.last_message_timestamp)}
      </div>
    </Link>
  );
};

export default ConversationListItem;
