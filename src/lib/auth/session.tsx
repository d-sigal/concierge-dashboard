'use client';

import { createContext, useContext, type ReactNode } from 'react';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
}

export interface Session {
  mode: 'clerk' | 'demo';
  isLoaded: boolean;
  user: SessionUser | null;
  /** Bearer token for the backend, or null when unauthenticated / in demo mode. */
  getToken: () => Promise<string | null>;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<Session | null>(null);

export const SessionProvider = ({ value, children }: { value: Session; children: ReactNode }) => (
  <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
);

/** Auth-provider-agnostic access to the current user. Never import Clerk hooks in feature code. */
export const useSession = () => {
  const session = useContext(SessionContext);
  if (!session) throw new Error('useSession must be used inside <AuthProvider>');
  return session;
};
