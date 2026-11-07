'use client';

import Image from 'next/image';
import ReactTimeAgo from 'react-time-ago';
import { Skeleton } from '@/components/ui/skeleton';
import { brand } from '@/config/brand';
import { cn } from '@/lib/utils';
import { useConversationSummary } from '@/features/chat/hooks';

interface Props {
  leadId: string;
  isDrawer?: boolean;
  className?: string;
}

const SummarySkeleton = () => (
  <div>
    {Array.from({ length: 4 }, (_, index) => (
      <div key={index}>
        <Skeleton className="mb-4 h-5 max-w-36" />
        <Skeleton className="mb-4 h-32" />
      </div>
    ))}
  </div>
);

const ChatSummary = ({ leadId, isDrawer = false, className }: Props) => {
  const { data, isLoading } = useConversationSummary(leadId);

  return (
    <div
      className={cn(
        'flex h-full max-h-full shrink-0 flex-col gap-2 border border-[#EEF0EE] bg-white px-6 pb-4 pt-6 text-primary-800',
        isDrawer ? 'w-full' : 'w-[328px] rounded-xl',
        className,
      )}
    >
      {isLoading ? (
        <SummarySkeleton />
      ) : data?.summary ? (
        <>
          <p className="scrollbar-custom max-h-full overflow-y-auto whitespace-pre-wrap text-sm">
            {data.summary}
          </p>
          <div className="-mx-6 mt-auto flex items-center justify-between border-t border-t-basic-blocks px-6 pt-4">
            {data.updated_at > 0 && (
              <span className="text-[13px] font-semibold text-text-description">
                Updated <ReactTimeAgo date={data.updated_at * 1000} />
              </span>
            )}
          </div>
        </>
      ) : (
        <div className="m-auto text-center">
          <Image src="/summaryEmpty.svg" alt="" className="mx-auto mb-2" width={200} height={200} />
          <h3 className="font-bold text-basic">Preparing to summarize...</h3>
          <p className="text-sm font-semibold text-text-secondary">
            As the conversation grows, {brand.assistantName} will provide all the details at a glance.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatSummary;
