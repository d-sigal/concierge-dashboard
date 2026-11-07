'use client';

import { CaretRight } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogTitle } from '@/components/ui/dialog';
import { brand } from '@/config/brand';
import WhatsAppSignupButton from '@/features/onboarding/components/WhatsAppSignupButton';
import { useClinic } from '@/features/workspace/hooks';
import { cn } from '@/lib/utils';

interface Props {
  isGuidedSetup: boolean;
  onSkip: () => void;
  onConnected: () => void;
}

const WhatsAppSignupStep = ({ isGuidedSetup, onSkip, onConnected }: Props) => {
  const { data: clinic } = useClinic();

  return (
    <DialogContent
      className="p-6 md:max-w-[680px] md:p-8 lg:max-w-[680px]"
      closeIconClassName={cn(isGuidedSetup && 'hidden')}
      aria-describedby={undefined}
    >
      <div>
        <div className="mb-6 flex items-center justify-between">
          {isGuidedSetup && (
            <>
              <span className="text-sm font-medium text-gray-700">1/2</span>
              <Button
                variant="text"
                size="auto"
                onClick={onSkip}
                className="ml-auto h-auto text-sm text-gray-500"
              >
                Skip <CaretRight size={20} className="ml-2" />
              </Button>
            </>
          )}
        </div>
        <DialogTitle asChild>
          <h1 className="mb-3 text-xl font-bold">Activate WhatsApp for Business</h1>
        </DialogTitle>
        <p className="mb-4 text-sm font-medium">
          Log in with the personal Facebook account linked to your Meta business portfolio (if you have one).
        </p>
        <p className="mb-4 text-sm font-medium">
          To activate WhatsApp for Business on {brand.name}, you must create a new WhatsApp Business Account
          (WABA). Existing accounts should not be used.
        </p>
        <WhatsAppSignupButton
          clinicName={clinic?.name}
          phoneNumber={clinic?.phone}
          className="w-full lg:w-auto"
          onLogin={onConnected}
        />
      </div>
    </DialogContent>
  );
};

export default WhatsAppSignupStep;
