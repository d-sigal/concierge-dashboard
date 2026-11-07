'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChatCircleDots, DotsThreeVertical, Trash } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useNotificationsToasts from '@/hooks/useNotificationsToasts';
import type { Contact } from '@/lib/api/types';
import { useDeleteContact } from '@/features/contacts/hooks';
import ConfirmDeleteDialog from '@/features/contacts/components/ConfirmDeleteDialog';

const ContactRowActions = ({ contact }: { contact: Contact }) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { successToast } = useNotificationsToasts();
  const { mutate: deleteContact, isPending } = useDeleteContact();
  const displayName = contact.full_name || contact.phone_number;

  const onDelete = () =>
    deleteContact(contact.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        successToast(`${displayName} has been deleted.`);
      },
    });

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="icon" className="mx-auto size-8 p-0" aria-label="Contact actions">
            <DotsThreeVertical size={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52" side="bottom" align="end">
          <DropdownMenuItem className="font-medium" asChild>
            <Link href={`/conversations/${contact.id}`}>
              Send message
              <DropdownMenuShortcut>
                <ChatCircleDots size={20} />
              </DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="font-medium" onSelect={() => setDeleteOpen(true)}>
            Delete
            <DropdownMenuShortcut className="text-red focus:text-red group-hover:text-red">
              <Trash size={20} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete ${displayName}?`}
        onConfirm={onDelete}
        isPending={isPending}
      />
    </>
  );
};

export default ContactRowActions;
