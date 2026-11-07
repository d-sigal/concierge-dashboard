import PageSpinner from '@/components/common/PageSpinner';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/api/client';

interface QueryState {
  isError: boolean;
  error: unknown;
  refetch: () => unknown;
}

/** Rendered while a settings page's data is missing: a spinner, or a retryable error. */
const SettingsQueryFallback = ({ queries }: { queries: QueryState[] }) => {
  const failed = queries.filter((query) => query.isError);

  if (failed.length === 0) return <PageSpinner />;

  return (
    <div className="flex flex-col items-start gap-y-4">
      <p className="font-medium text-gray-700">
        We couldn&apos;t load your settings. {getErrorMessage(failed[0].error)}
      </p>
      <Button variant="secondary" onClick={() => failed.forEach((query) => void query.refetch())}>
        Try again
      </Button>
    </div>
  );
};

export default SettingsQueryFallback;
