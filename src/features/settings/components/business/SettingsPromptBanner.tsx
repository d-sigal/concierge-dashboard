'use client';

import { useState, type ReactNode } from 'react';
import Image from 'next/image';
import InfoBanner from '@/components/common/InfoBanner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { useSettingsPrompt } from '@/features/settings/hooks';

interface Props {
  /** `additional_settings` key that remembers the prompt was handled. */
  promptKey: string;
  message: string;
  actionLabel: string;
  dialogTitle: string;
  dialogDescription: ReactNode;
  isConfirming: boolean;
  /** Runs the action; call `done` once it succeeded so the prompt stops showing. */
  onConfirm: (done: () => void) => void;
}

/** Inline suggestion under a field that opens a confirmation dialog and can be dismissed for good. */
const SettingsPromptBanner = ({
  promptKey,
  message,
  actionLabel,
  dialogTitle,
  dialogDescription,
  isConfirming,
  onConfirm,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isVisible, dismiss } = useSettingsPrompt(promptKey);

  if (!isVisible) return null;

  const done = () => {
    setIsOpen(false);
    dismiss();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <InfoBanner onClose={dismiss}>
        <p>
          {message}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="mt-2 inline-block font-bold text-brand-800 lg:mt-0 lg:pl-3"
          >
            {actionLabel}
          </button>
        </p>
      </InfoBanner>
      <DialogContent className="max-w-[428px]">
        <DialogTitle>
          <Image src="/robotPurple.svg" alt="" width={56} height={56} className="mb-5" />
          <span className="leading-6">{dialogTitle}</span>
        </DialogTitle>
        <DialogDescription>{dialogDescription}</DialogDescription>
        <DialogFooter>
          <Button variant="outline" className="w-full font-semibold" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button className="w-full font-semibold" disabled={isConfirming} onClick={() => onConfirm(done)}>
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsPromptBanner;
