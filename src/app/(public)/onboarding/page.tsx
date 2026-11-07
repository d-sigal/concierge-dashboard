import type { Metadata } from 'next';
import GettingStarted from '@/features/onboarding/components/GettingStarted';

export const metadata: Metadata = { title: 'Getting started' };

export default function GettingStartedPage() {
  return <GettingStarted />;
}
