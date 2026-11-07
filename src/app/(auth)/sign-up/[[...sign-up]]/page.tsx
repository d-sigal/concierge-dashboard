import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SignUp } from '@clerk/nextjs';
import { isClerkEnabled } from '@/config/env';
import { clerkAppearance } from '@/features/shell/clerk-appearance';

export const metadata: Metadata = { title: 'Sign up' };

export default function SignUpPage() {
  if (!isClerkEnabled) redirect('/');
  return <SignUp path="/sign-up" appearance={clerkAppearance} />;
}
