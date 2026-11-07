'use client';

import { useState } from 'react';
import { Info } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { brand } from '@/config/brand';
import { cn } from '@/lib/utils';
import CreateContactForm, { CREATE_CONTACT_FORM_ID } from '@/features/contacts/components/CreateContactForm';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateContactDialog = ({ open, onOpenChange }: Props) => {
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const close = () => {
    setConfirmDiscardOpen(false);
    setIsDirty(false);
    onOpenChange(false);
  };

  const requestClose = () => {
    if (isDirty) setConfirmDiscardOpen(true);
    else close();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : requestClose())}>
        <DialogContent className={cn('md:max-w-[675px] lg:max-w-[680px]', confirmDiscardOpen && 'hidden')}>
          <DialogTitle asChild>
            <h2 className="mb-2 flex items-center gap-x-2 leading-6">
              Create contact
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="cursor-pointer text-blue-600" size={18} />
                </TooltipTrigger>
                <TooltipContent className="border-basic bg-basic text-white">
                  <p>This contact will only be saved to your {brand.name} contacts.</p>
                </TooltipContent>
              </Tooltip>
            </h2>
          </DialogTitle>
          <CreateContactForm onDirtyChange={setIsDirty} onSuccess={close} />
          <DialogFooter className="sm:justify-between md:flex-row">
            <Button variant="outline" className="font-semibold" onClick={requestClose}>
              Cancel
            </Button>
            <Button className="font-semibold lg:ml-auto" type="submit" form={CREATE_CONTACT_FORM_ID}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDiscardOpen} onOpenChange={setConfirmDiscardOpen}>
        <DialogContent className="lg:max-w-[428px]">
          <DialogTitle asChild>
            <h2 className="mb-2 flex items-center gap-x-2 leading-6">Discard changes?</h2>
          </DialogTitle>
          <div className="font-medium text-gray-600">
            Closing this window now will interrupt contact creation and discard all changes.
          </div>
          <DialogFooter className="mt-2 sm:justify-between">
            <Button variant="outline" className="mt-4 w-full font-semibold lg:mt-0" onClick={close}>
              Discard and close
            </Button>
            <Button className="ml-auto w-full font-semibold" onClick={() => setConfirmDiscardOpen(false)}>
              Keep editing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateContactDialog;
