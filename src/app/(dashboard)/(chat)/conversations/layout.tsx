import { Suspense, type ReactNode } from 'react';
import PageSpinner from '@/components/common/PageSpinner';
import ChatLayout from '@/features/chat/components/ChatLayout';

export default function ConversationsLayout({ children }: { children: ReactNode }) {
  return (
    // The inbox reads `?search=` through useSearchParams, which needs a Suspense boundary.
    <Suspense fallback={<PageSpinner />}>
      <ChatLayout>{children}</ChatLayout>
    </Suspense>
  );
}
