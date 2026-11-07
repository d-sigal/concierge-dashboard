'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { ApiProvider } from '@/lib/api/ApiProvider';
import { AuthProvider } from '@/lib/auth/AuthProvider';

TimeAgo.addDefaultLocale(en);

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: 1 } },
      }),
  );

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ApiProvider>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </ApiProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
