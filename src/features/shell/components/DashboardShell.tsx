import type { ReactNode } from 'react';
import Link from 'next/link';
import Logo from '@/components/icons/Logo';
import { brand } from '@/config/brand';
import { isDemoMode } from '@/config/env';
import Onboarding from '@/features/onboarding/components/Onboarding';
import DashboardNav from '@/features/shell/components/DashboardNav';
import DashboardSidebarMobile from '@/features/shell/components/DashboardSidebarMobile';
import DemoModeBadge from '@/features/shell/components/DemoModeBadge';
import GlobalAlerts from '@/features/shell/components/GlobalAlerts';
import UserMenu from '@/features/shell/components/UserMenu';

const DashboardShell = ({ children }: { children: ReactNode }) => (
  <>
    <section className="dashboard-main-layout">
      <header className="col-span-2 flex h-16 items-center border-b border-b-primary-200 bg-white px-4">
        <Link href="/" className="flex items-center gap-x-2 text-primary">
          <Logo className="size-9" />
          <span className="font-secondary text-lg font-semibold">{brand.name}</span>
        </Link>
        {isDemoMode && <DemoModeBadge />}
        <div className="ml-auto flex items-center">
          <UserMenu />
          <DashboardSidebarMobile />
        </div>
      </header>
      <aside className="sidebar">
        <DashboardNav className="hidden md:flex" />
      </aside>
      <main className="flex h-full flex-col overflow-y-auto py-5 lg:py-4">
        <div className="h-full flex-grow border-primary">{children}</div>
      </main>
    </section>
    <GlobalAlerts />
    <Onboarding />
  </>
);

export default DashboardShell;
