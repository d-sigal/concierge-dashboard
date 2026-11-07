'use client';

import { useState } from 'react';
import { List } from '@phosphor-icons/react';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import DashboardNav from '@/features/shell/components/DashboardNav';

const DashboardSidebarMobile = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="ml-4 lg:hidden" aria-label="Open navigation">
          <List className="size-8" />
        </button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <DashboardNav className="mt-8 md:hidden" onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
};

export default DashboardSidebarMobile;
