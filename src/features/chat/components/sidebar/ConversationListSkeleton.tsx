import { Skeleton } from '@/components/ui/skeleton';
import { CONVERSATIONS_PAGE_SIZE } from '@/features/chat/hooks';

const ConversationListSkeleton = () =>
  Array.from({ length: CONVERSATIONS_PAGE_SIZE }, (_, index) => (
    <Skeleton className="mb-1 h-[57px]" key={index} />
  ));

export default ConversationListSkeleton;
