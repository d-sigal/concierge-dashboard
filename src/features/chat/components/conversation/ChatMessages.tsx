import { Fragment } from 'react';
import type { Message } from '@/lib/api/types';
import { getMessageDay } from '@/features/chat/utils';
import ChatMessage from '@/features/chat/components/conversation/ChatMessage';
import DateAndChannelIndicator from '@/features/chat/components/conversation/DateAndChannelIndicator';

interface Props {
  /** Newest first. */
  messages: Message[];
}

/**
 * The list is laid out with `flex-col-reverse` so it stays scrolled to the newest
 * message. Each message renders, in DOM order: the day separator for the newer
 * message after it (when the day changes), the message, then the indicator that
 * sits visually above it (on a channel switch, or for the oldest message).
 */
const ChatMessages = ({ messages }: Props) => (
  <div className="relative flex flex-1 flex-col overflow-y-hidden">
    <div className="flex h-40 w-full flex-grow flex-col-reverse justify-start gap-4 overflow-y-auto py-2">
      {messages.map((message, index) => {
        if (!message.date_created) return null;

        const newer = index > 0 ? messages[index - 1] : undefined;
        const showNewerDaySeparator =
          newer?.date_created &&
          !newer.is_channel_updated &&
          getMessageDay(newer.date_created) !== getMessageDay(message.date_created);
        const showOwnIndicator = message.is_channel_updated || index === messages.length - 1;

        return (
          <Fragment key={message.id}>
            {showNewerDaySeparator && newer && (
              <DateAndChannelIndicator channel={newer.channel} dateCreated={newer.date_created} />
            )}
            <ChatMessage message={message} />
            {showOwnIndicator && (
              <DateAndChannelIndicator channel={message.channel} dateCreated={message.date_created} />
            )}
          </Fragment>
        );
      })}
    </div>
  </div>
);

export default ChatMessages;
