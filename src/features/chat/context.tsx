'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

export type InboxTab = 'all' | 'assist-needed';

interface InboxTabState {
  activeTab: InboxTab;
  setActiveTab: (tab: InboxTab) => void;
}

const InboxTabContext = createContext<InboxTabState | null>(null);

/** Keeps the selected inbox tab while navigating between conversations. */
export const InboxTabProvider = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState<InboxTab>('all');

  return <InboxTabContext.Provider value={{ activeTab, setActiveTab }}>{children}</InboxTabContext.Provider>;
};

export const useInboxTab = () => {
  const context = useContext(InboxTabContext);
  if (!context) throw new Error('useInboxTab must be used inside <InboxTabProvider>');
  return context;
};
