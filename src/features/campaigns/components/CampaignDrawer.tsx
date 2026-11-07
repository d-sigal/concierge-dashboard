'use client';

import { X } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import type { CampaignPrefill } from '@/features/campaigns/form';
import CampaignWizard from '@/features/campaigns/components/CampaignWizard';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefill?: CampaignPrefill;
}

/** Right-hand drawer with the multi-step "create campaign" wizard. */
const CampaignDrawer = ({ open, onOpenChange, prefill }: Props) => (
  <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
    <DrawerContent className="ml-auto h-full max-w-[992px] rounded-tr-none">
      <div className="relative flex h-full">
        <Button
          variant="icon"
          size="icon"
          onClick={() => onOpenChange(false)}
          className="absolute right-[calc(100%+16px)] top-4"
          aria-label="Close"
        >
          <X size={20} />
        </Button>
        <CampaignWizard prefill={prefill} onDone={() => onOpenChange(false)} />
      </div>
    </DrawerContent>
  </Drawer>
);

export default CampaignDrawer;
