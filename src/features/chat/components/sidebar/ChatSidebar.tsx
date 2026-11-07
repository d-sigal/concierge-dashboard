'use client';

import Sidebar from '@/components/common/Sidebar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInboxTab, type InboxTab } from '@/features/chat/context';
import { useConversationMetrics } from '@/features/chat/hooks';
import InboxSearch from '@/features/chat/components/sidebar/InboxSearch';
import InboxTabContent from '@/features/chat/components/sidebar/InboxTabContent';
import NewChatDialog from '@/features/chat/components/new-chat/NewChatDialog';

const ChatSidebar = () => {
  const { activeTab, setActiveTab } = useInboxTab();
  const { data: metrics } = useConversationMetrics();
  const assistNeededCount = metrics?.assist_needed ?? 0;

  return (
    <Sidebar>
      <div className="bg-background sticky top-0 z-10 h-full px-4 sm:static sm:z-auto lg:-mx-4">
        <Tabs
          value={activeTab}
          onValueChange={(tab) => setActiveTab(tab as InboxTab)}
          className="flex h-full flex-col"
        >
          <div className="mb-2 flex items-center justify-between gap-x-2 border-b border-gray-100 px-4 pb-2">
            <h1 className="text-2xl font-bold text-basic">Inbox</h1>
            <NewChatDialog />
          </div>
          <TabsList className="grid grid-cols-2 gap-x-1 bg-transparent p-0 lg:px-4">
            <TabsTrigger value="all">All chats</TabsTrigger>
            <TabsTrigger value="assist-needed">
              Assist needed
              {assistNeededCount > 0 && (
                <div className="-mr-1.5 ml-2 grid h-[20px] min-w-[20px] place-items-center rounded-full bg-red p-0.5 text-sm leading-none text-white">
                  {assistNeededCount}
                </div>
              )}
            </TabsTrigger>
          </TabsList>
          <div className="mt-2 lg:px-4">
            <InboxSearch />
          </div>
          <InboxTabContent tab={activeTab} />
        </Tabs>
      </div>
    </Sidebar>
  );
};

export default ChatSidebar;
