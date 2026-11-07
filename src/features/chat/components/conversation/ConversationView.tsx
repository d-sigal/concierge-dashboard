'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter } from '@/components/ui/drawer';
import { useConversation, useCurrentLeadId, useMessages, useMessagesRealtime } from '@/features/chat/hooks';
import ChatComposer from '@/features/chat/components/composer/ChatComposer';
import ChatHeader from '@/features/chat/components/conversation/ChatHeader';
import ChatMessages from '@/features/chat/components/conversation/ChatMessages';
import ChatSummary from '@/features/chat/components/conversation/ChatSummary';

const Conversation = ({ leadId }: { leadId: string }) => {
  const { data: conversation } = useConversation(leadId);
  const { data: messages = [], isLoading } = useMessages(leadId);
  useMessagesRealtime(leadId);

  return (
    <div className="fixed inset-0 z-50 flex h-full flex-col bg-primary-100 lg:static lg:pl-4">
      <Drawer>
        {isLoading ? (
          <Loader2 className="m-auto size-8 animate-spin" />
        ) : (
          <div className="flex h-full gap-x-4">
            <div className="flex h-full flex-1 flex-col">
              <ChatHeader leadId={leadId} conversation={conversation} />
              <div className="flex flex-1 flex-col rounded-md px-4 pb-5 lg:p-0">
                <div className="flex size-full flex-1 gap-x-4">
                  <ChatMessages messages={messages} />
                </div>
                {conversation && (
                  <ChatComposer leadId={leadId} conversation={conversation} messages={messages} />
                )}
              </div>
            </div>
            <ChatSummary leadId={leadId} className="hidden lg:flex" />
          </div>
        )}

        <DrawerContent>
          <ChatSummary leadId={leadId} isDrawer />
          <DrawerFooter>
            <DrawerClose asChild>
              <Button className="w-full bg-brand-800 text-white">Back to chat</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

/** The open conversation at `/conversations/[sid]`. Keyed by lead id so per-conversation state resets. */
const ConversationView = () => {
  const leadId = useCurrentLeadId();
  if (!leadId) return null;
  return <Conversation key={leadId} leadId={leadId} />;
};

export default ConversationView;
