'use client';

import { BookOpenText } from '@phosphor-icons/react';
import Illustration from '@/components/common/Illustration';
import { DialogContent, DialogTitle } from '@/components/ui/dialog';
import { brand } from '@/config/brand';
import WebsiteForm from '@/features/settings/components/WebsiteForm';
import { useClinic } from '@/features/workspace/hooks';

const TrainAssistantStep = ({ onClose }: { onClose: () => void }) => {
  const { data: clinic } = useClinic();

  return (
    <DialogContent
      onEscapeKeyDown={(e) => e.preventDefault()}
      onInteractOutside={(e) => e.preventDefault()}
      className="p-6 md:max-w-[600px] lg:max-w-[840px] lg:p-8"
      aria-describedby={undefined}
    >
      <div className="grid-cols-[320px_1fr] gap-x-8 lg:grid">
        <Illustration icon={BookOpenText} className="hidden h-[320px] rounded-lg lg:flex" />
        <div className="flex flex-col lg:pr-8">
          <DialogTitle asChild>
            <h1 className="mb-3 text-xl font-bold">Train {brand.assistantName}</h1>
          </DialogTitle>
          <p className="mb-6 text-sm font-medium">
            Add your website so {brand.assistantName} can learn your service descriptions, team expertise, and
            brand voice, so it reflects your business perfectly.
          </p>
          <WebsiteForm
            url={clinic?.url}
            lastUpdated={clinic?.website_last_crawled_at}
            isOnboardingActive
            onSuccess={onClose}
          />
        </div>
      </div>
    </DialogContent>
  );
};

export default TrainAssistantStep;
