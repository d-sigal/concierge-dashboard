'use client';

import AlertIcon from '@/components/icons/AlertIcon';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { brand } from '@/config/brand';
import { env } from '@/config/env';
import { toast } from '@/hooks/use-toast';

/** Blocking dialog for workspaces without an active plan. */
const NoActivePlanDialog = () => (
  <Dialog open>
    <DialogContent
      className="gap-0 !rounded-2xl bg-neutral-100 p-8 font-secondary md:max-w-[560px] lg:max-w-[560px]"
      closeIconClassName="hidden"
      onClickOverlay={() =>
        toast({
          className: 'md:max-w-[428px] ml-auto',
          description: (
            <>
              <AlertIcon className="mb-2 size-14" />
              Please choose a plan before moving on to the next step.
            </>
          ),
        })
      }
    >
      <DialogHeader>
        <DialogTitle className="mb-4 text-2xl font-semibold">No active plan</DialogTitle>
        <DialogDescription className="text-lg font-normal text-[#212121]">
          It looks like there&apos;s no active plan for your {brand.name} workspace. Once you subscribe,{' '}
          {brand.assistantName} will be back to support your customer engagement in no time.
        </DialogDescription>
      </DialogHeader>
      {env.billingUrl ? (
        <Button asChild className="mt-6 w-full lg:w-auto lg:self-start">
          <a href={env.billingUrl} target="_blank" rel="noopener noreferrer">
            Choose a plan
          </a>
        </Button>
      ) : (
        brand.supportEmail && (
          <p className="mt-6 text-base text-[#212121]">
            To reactivate your plan, email us at{' '}
            <a href={`mailto:${brand.supportEmail}`} className="font-semibold">
              {brand.supportEmail}
            </a>
            .
          </p>
        )
      )}
    </DialogContent>
  </Dialog>
);

export default NoActivePlanDialog;
