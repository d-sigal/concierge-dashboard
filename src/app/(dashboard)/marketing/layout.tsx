import type { ReactNode } from 'react';
import { BigScreensContainer } from '@/components/ui/BigScreensContainer';
import MarketingSidebar from '@/features/campaigns/components/MarketingSidebar';

export default function MarketingLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <BigScreensContainer className="-mt-2.5 flex h-full flex-col px-4 md:mt-0 md:flex-row md:gap-x-5 md:pl-0 md:pr-6 lg:gap-x-6">
      <MarketingSidebar />
      <div className="flex w-full flex-col overflow-auto py-6">{children}</div>
    </BigScreensContainer>
  );
}
