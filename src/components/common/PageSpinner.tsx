import { Loader2 } from 'lucide-react';
import { FC } from 'react';
import { cn } from '@/lib/utils';

const PageSpinner: FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('fixed inset-0 z-50 flex h-full flex-col bg-primary-100 pl-4 md:static', className)}>
      <Loader2 className="m-auto size-8 animate-spin" />
    </div>
  );
};

export default PageSpinner;
