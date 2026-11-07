import type { ReactNode } from 'react';
import DashboardShell from '@/features/shell/components/DashboardShell';

export default function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <DashboardShell>{children}</DashboardShell>;
}
