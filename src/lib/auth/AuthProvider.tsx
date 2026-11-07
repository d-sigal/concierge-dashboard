'use client';

import { ClerkProvider, useAuth, useClerk, useUser } from '@clerk/nextjs';
import { useCallback, useMemo, type ReactNode } from 'react';
import { env, isClerkEnabled } from '@/config/env';
import { SessionProvider, type Session } from '@/lib/auth/session';

const demoSession: Session = {
  mode: 'demo',
  isLoaded: true,
  user: { id: 'demo-user', name: 'Demo User', email: 'demo@example.com' },
  getToken: async () => null,
  signOut: async () => {
    window.location.assign('/');
  },
};

const ClerkSessionBridge = ({ children }: { children: ReactNode }) => {
  const { getToken: clerkGetToken } = useAuth();
  const { user, isLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerk();

  const getToken = useCallback(
    () => clerkGetToken(env.clerkTokenTemplate ? { template: env.clerkTokenTemplate } : undefined),
    [clerkGetToken],
  );
  const signOut = useCallback(() => clerkSignOut({ redirectUrl: '/sign-in' }), [clerkSignOut]);

  const session = useMemo<Session>(
    () => ({
      mode: 'clerk',
      isLoaded,
      user: user
        ? {
            id: user.id,
            name: user.fullName ?? user.primaryEmailAddress?.emailAddress ?? '',
            email: user.primaryEmailAddress?.emailAddress ?? '',
            imageUrl: user.imageUrl,
          }
        : null,
      getToken,
      signOut,
    }),
    [isLoaded, user, getToken, signOut],
  );

  return <SessionProvider value={session}>{children}</SessionProvider>;
};

/**
 * Uses Clerk when NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set, otherwise a fixed demo user.
 * To plug in a different auth provider, add another bridge that produces a `Session`.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  if (!isClerkEnabled) return <SessionProvider value={demoSession}>{children}</SessionProvider>;

  return (
    <ClerkProvider publishableKey={env.clerkPublishableKey}>
      <ClerkSessionBridge>{children}</ClerkSessionBridge>
    </ClerkProvider>
  );
};
