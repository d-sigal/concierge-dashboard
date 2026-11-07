'use client';

import { useState } from 'react';
import { UserPlus } from '@phosphor-icons/react';
import ChatPlusIcon from '@/components/icons/ChatPlusIcon';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import NewChatContacts from '@/features/chat/components/new-chat/NewChatContacts';
import CreateContactDialog from '@/features/contacts/components/CreateContactDialog';

const NewChatDialog = () => {
  const [open, setOpen] = useState(false);
  const [createContactOpen, setCreateContactOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" className="h-8 gap-x-2">
            New chat <ChatPlusIcon className="size-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[680px] overflow-auto lg:max-w-[680px]" closeIconClassName="hidden">
          <div className="flex items-center justify-between gap-x-4">
            <DialogTitle className="leading-6 text-basic">
              Select contact to start a WhatsApp chat
            </DialogTitle>
            <Button variant="secondary" className="gap-x-2" onClick={() => setCreateContactOpen(true)}>
              Create contact <UserPlus size={20} />
            </Button>
          </div>
          <div className="max-h-[450px] overflow-y-auto text-base leading-6 text-primary-800">
            <NewChatContacts onSelect={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
      <CreateContactDialog open={createContactOpen} onOpenChange={setCreateContactOpen} />
    </>
  );
};

export default NewChatDialog;
