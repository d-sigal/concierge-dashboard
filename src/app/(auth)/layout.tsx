import type { ReactNode } from 'react';
import AuthPageLayout from '@/features/shell/components/AuthPageLayout';

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex h-screen items-center justify-center">
      <AuthPageLayout>{children}</AuthPageLayout>
    </div>
  );
}
