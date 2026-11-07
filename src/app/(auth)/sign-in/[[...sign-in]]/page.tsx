import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SignIn } from '@clerk/nextjs';
import { isClerkEnabled } from '@/config/env';
import { clerkAppearance } from '@/features/shell/clerk-appearance';

export const metadata: Metadata = { title: 'Sign in' };

export default function SignInPage() {
  if (!isClerkEnabled) redirect('/');
  return <SignIn path="/sign-in" appearance={clerkAppearance} />;
}
