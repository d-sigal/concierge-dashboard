import type { Message } from '@/lib/api/types';
import { cn } from '@/lib/utils';
import { formatTime } from '@/features/chat/utils';
import MessageStatusIcon from '@/features/chat/components/conversation/MessageStatusIcon';

interface Props {
  message: Pick<Message, 'author' | 'body' | 'date_created_timestamp' | 'status'>;
}

const ChatMessage = ({ message: { author, body, date_created_timestamp, status } }: Props) => {
  const isOutgoing = author === 'system';

  return (
    <div
      className={cn(
        'flex max-w-[430px] flex-col whitespace-pre-wrap break-words rounded-xl bg-white px-5 py-3 font-medium',
        isOutgoing ? 'self-end' : 'self-start',
        isOutgoing && status === 'failed' && 'border border-red-300',
      )}
    >
      <span>{body}</span>
      <div className="mt-1 flex items-start justify-end text-[10px] text-primary-700">
        <span>{formatTime(date_created_timestamp)}</span>
        <span className="ml-px flex w-5 items-start justify-end">
          {isOutgoing && <MessageStatusIcon status={status} />}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
