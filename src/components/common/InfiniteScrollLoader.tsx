import InfiniteScroll from '@/components/ui/infinite-scroll';
import { Loader2 } from 'lucide-react';

interface Props {
  hasMore: boolean;
  isLoading: boolean;
  fetchNextPage: () => unknown;
}

export const InfiniteScrollLoader = ({ hasMore, isLoading, fetchNextPage }: Props) => (
  <InfiniteScroll hasMore={hasMore} isLoading={isLoading} next={fetchNextPage} threshold={1}>
    {hasMore && <Loader2 className="mx-auto my-4 h-8 w-8 animate-spin" />}
  </InfiniteScroll>
);
