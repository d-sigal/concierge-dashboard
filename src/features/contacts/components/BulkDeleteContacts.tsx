'use client';

import { useState } from 'react';
import { DotsThreeVertical, Trash } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useNotificationsToasts from '@/hooks/useNotificationsToasts';
import { useDeleteContacts } from '@/features/contacts/hooks';
import ConfirmDeleteDialog from '@/features/contacts/components/ConfirmDeleteDialog';

interface Props {
  ids: string[];
  onDeleted: () => void;
}

const BulkDeleteContacts = ({ ids, onDeleted }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { successToast } = useNotificationsToasts();
  const { mutate: deleteContacts, isPending } = useDeleteContacts();

  const onDelete = () =>
    deleteContacts(ids, {
      onSuccess: () => {
        setDialogOpen(false);
        onDeleted();
        successToast(`${ids.length} ${ids.length === 1 ? 'contact has' : 'contacts have'} been deleted.`);
      },
    });

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            type="button"
            className="ml-auto flex size-8 items-center gap-x-1 p-0 md:w-fit md:pl-4 md:pr-3"
          >
            <span className="hidden md:block">Actions</span> <DotsThreeVertical size={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 md:w-52" side="bottom" align="end">
          <DropdownMenuItem className="font-medium" onSelect={() => setDialogOpen(true)}>
            Delete
            <DropdownMenuShortcut className="text-red focus:text-red group-hover:text-red">
              <Trash size={20} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDeleteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Delete selected contacts?"
        onConfirm={onDelete}
        isPending={isPending}
      />
    </>
  );
};

export default BulkDeleteContacts;
