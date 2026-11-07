'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PaperPlaneTilt, Plus } from '@phosphor-icons/react';
import PageSpinner from '@/components/common/PageSpinner';
import PageTitle from '@/components/common/PageTitle';
import { Button } from '@/components/ui/button';
import CreateTemplateBanner from '@/features/templates/components/CreateTemplateBanner';
import TemplateDialog from '@/features/templates/components/TemplateDialog';
import { useCampaigns } from '@/features/campaigns/hooks';
import CampaignDrawer from '@/features/campaigns/components/CampaignDrawer';
import CampaignsTable from '@/features/campaigns/components/CampaignsTable';
import StartingBanner from '@/features/campaigns/components/StartingBanner';

const CampaignsPage = () => {
  const [createCampaignOpen, setCreateCampaignOpen] = useState(false);
  const [createTemplateOpen, setCreateTemplateOpen] = useState(false);
  const { data, isLoading } = useCampaigns();

  if (isLoading) return <PageSpinner />;

  const campaigns = data?.campaigns ?? [];

  return (
    <div className="flex h-full flex-col">
      {campaigns.length === 0 ? (
        <>
          <PageTitle>WhatsApp campaigns</PageTitle>
          <section className="mb-7 rounded-xl bg-gradient-to-b from-white to-primary-200 p-5 md:mb-0">
            <div className="relative">
              <Image src="/campaginBg.png" alt="" fill />
              <div className="relative mx-auto w-full max-w-[400px] text-center">
                <PaperPlaneTilt weight="fill" className="mx-auto mb-3 text-brand-400" size={60} />
                <h3 className="mb-2 font-bold">Launch a new campaign</h3>
                <p className="mb-3 text-sm font-medium">
                  Create a WhatsApp campaign to connect with leads or engage existing clients effectively.
                  Reach your audience where they are.
                </p>
                <Button className="w-full gap-x-2 lg:w-auto" onClick={() => setCreateCampaignOpen(true)}>
                  Create campaign <Plus size={20} />
                </Button>
              </div>
            </div>
          </section>
          <CreateTemplateBanner onClick={() => setCreateTemplateOpen(true)} />
        </>
      ) : (
        <>
          <CampaignsTable data={campaigns} onClickCreate={() => setCreateCampaignOpen(true)} />
          <StartingBanner
            type="campaign"
            onClick={() => setCreateCampaignOpen(true)}
            ctaLabel="Create campaign"
            className="-mb-6 mt-auto"
            title="Drive engagement with WhatsApp"
            description={
              <>
                Start your next campaign and stay connected with your customers.
                <br /> Click to begin.
              </>
            }
          />
        </>
      )}
      <CampaignDrawer open={createCampaignOpen} onOpenChange={setCreateCampaignOpen} />
      <TemplateDialog open={createTemplateOpen} onOpenChange={setCreateTemplateOpen} />
    </div>
  );
};

export default CampaignsPage;
