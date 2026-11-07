'use client';

import { useState } from 'react';
import { DotsThreeVertical, Eye, PencilSimpleLine } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Campaign } from '@/lib/api/types';
import CampaignDetailsDrawer from '@/features/campaigns/components/CampaignDetailsDrawer';
import CampaignDrawer from '@/features/campaigns/components/CampaignDrawer';

const CampaignActions = ({ campaign }: { campaign: Campaign }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [duplicateOpen, setDuplicateOpen] = useState(false);

  const duplicatePrefill = {
    name: `${campaign.name} (Copy)`,
    templateId: campaign.template_id,
    lead_ids: campaign.leads.map(({ id }) => id),
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="icon" className="mx-auto size-8 p-0" aria-label="Campaign actions">
            <DotsThreeVertical size={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" side="bottom" align="end">
          <DropdownMenuItem className="font-medium" onSelect={() => setDetailsOpen(true)}>
            View
            <DropdownMenuShortcut>
              <Eye size={20} className="text-icon-light group-hover:text-brand-800" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="font-medium" onSelect={() => setDuplicateOpen(true)}>
            Duplicate to edit
            <DropdownMenuShortcut className="font-medium">
              <PencilSimpleLine size={20} className="text-icon-light group-hover:text-brand-800" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CampaignDetailsDrawer
        campaign={campaign}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onDuplicate={() => {
          setDetailsOpen(false);
          setDuplicateOpen(true);
        }}
      />
      <CampaignDrawer open={duplicateOpen} onOpenChange={setDuplicateOpen} prefill={duplicatePrefill} />
    </>
  );
};

export default CampaignActions;
