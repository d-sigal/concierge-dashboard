'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { DrawerTrigger } from '@/components/ui/drawer';
import { Label } from '@/components/ui/label';
import { SwitchWithSpinner } from '@/components/ui/SwitchWithSpinner';
import { brand } from '@/config/brand';
import type { Conversation } from '@/lib/api/types';
import { useSetHandover } from '@/features/chat/hooks';
import { getConversationDetails } from '@/features/chat/utils';
import SwitchToManualChatModal from '@/features/chat/components/conversation/SwitchToManualChatModal';

interface Props {
  leadId: string;
  conversation: Conversation | undefined;
}

const ChatHeader = ({ leadId, conversation }: Props) => {
  const router = useRouter();
  const { mutate: setHandover, isPending } = useSetHandover();
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const isTransferredToHuman = Boolean(conversation?.transferred_to_human);
  const { userDisplayName, userInitials } = getConversationDetails(conversation);

  const switchToManual = () => {
    setConfirmOpen(false);
    setHandover({ leadId, toHuman: true });
  };

  const switchToAssistant = () => setHandover({ leadId, toHuman: false });

  return (
    <div className="items-center justify-between gap-2 rounded-bl-xl rounded-br-xl border border-[#EEF0EE] bg-white p-4 lg:flex lg:gap-4 lg:rounded-xl">
      <div className="flex items-center justify-between gap-x-2 border-b border-gray-300 pb-4 text-sm font-medium lg:justify-start lg:border-none lg:pb-0 lg:text-base">
        <ArrowLeft className="flex-shrink-0 lg:hidden" onClick={() => router.push('/conversations')} />
        <div className="hidden h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary-200 font-semibold lg:grid">
          {userInitials}
        </div>
        <div className="text-center lg:text-start">
          <span className="line-clamp-1 text-ellipsis break-all">{userDisplayName}</span>
          <span className="text-sm font-semibold text-primary-700">
            {conversation?.is_client ? 'Client' : 'Lead'}
          </span>
        </div>
        <DrawerTrigger className="lg:hidden">
          <Image src="/summary.svg" alt="Summary" width={20} height={20} />
        </DrawerTrigger>
      </div>
      <div className="flex items-center justify-between space-x-5 pt-5 tracking-tight lg:pt-0">
        <Label className="text-base font-medium">
          {brand.assistantName} is {isTransferredToHuman ? 'off' : 'on'}
          <span className="block whitespace-nowrap text-sm font-semibold text-neutral-400">
            Switch toggle to {isTransferredToHuman ? 'enable' : 'disable'} {brand.assistantName}
          </span>
        </Label>
        <SwitchWithSpinner
          checked={!isTransferredToHuman}
          onChange={isTransferredToHuman ? switchToAssistant : () => setConfirmOpen(true)}
          isLoading={isPending}
          disabled={!conversation}
        />
        <SwitchToManualChatModal
          open={isConfirmOpen}
          onOpenChange={setConfirmOpen}
          onConfirm={switchToManual}
        />
      </div>
    </div>
  );
};

export default ChatHeader;
