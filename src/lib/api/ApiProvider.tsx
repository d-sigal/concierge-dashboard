'use client';

import { createContext, useContext, useRef, type ReactNode } from 'react';
import { env, isDemoMode } from '@/config/env';
import type { ApiClient } from '@/lib/api/client';
import { createHttpClient } from '@/lib/api/http-client';
import { createMockClient } from '@/lib/api/mock/mock-client';
import { useSession } from '@/lib/auth/session';

const ApiContext = createContext<ApiClient | null>(null);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const { getToken } = useSession();

  // Keep the latest token getter without recreating the client (and its sockets) on every render.
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  const clientRef = useRef<ApiClient | null>(null);
  if (!clientRef.current) {
    clientRef.current =
      isDemoMode || !env.apiUrl
        ? createMockClient()
        : createHttpClient({ baseUrl: env.apiUrl, wsUrl: env.wsUrl, getToken: () => getTokenRef.current() });
  }

  return <ApiContext.Provider value={clientRef.current}>{children}</ApiContext.Provider>;
};

export const useApi = () => {
  const client = useContext(ApiContext);
  if (!client) throw new Error('useApi must be used inside <ApiProvider>');
  return client;
};
