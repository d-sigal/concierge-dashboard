import type { ReactNode } from 'react';
import { FilePlus, PaperPlaneTilt, Plus } from '@phosphor-icons/react';
import Illustration from '@/components/common/Illustration';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const VARIANTS = {
  template: { illustration: FilePlus, ctaIcon: FilePlus, buttonVariant: 'secondary' },
  campaign: { illustration: PaperPlaneTilt, ctaIcon: Plus, buttonVariant: 'default' },
} as const;

interface Props {
  type: keyof typeof VARIANTS;
  title: string;
  description: ReactNode;
  ctaLabel: string;
  onClick: () => void;
  className?: string;
}

/** Call-to-action card shown at the bottom of the marketing pages. */
const StartingBanner = ({ type, title, description, ctaLabel, onClick, className }: Props) => {
  const { illustration, ctaIcon: CtaIcon, buttonVariant } = VARIANTS[type];

  return (
    <div
      className={cn(
        'grid-cols-[240px_1fr] gap-x-5 rounded-xl border border-gray-100 bg-white p-6 lg:grid',
        className,
      )}
    >
      <Illustration
        icon={illustration}
        className="mb-5 h-[64px] w-[120px] rounded-lg md:h-32 md:w-[240px] lg:mb-0 lg:w-full"
      />
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="mb-5 text-sm font-medium">{description}</p>
        <Button
          onClick={onClick}
          variant={buttonVariant}
          className="flex w-full items-start gap-x-2 md:w-auto"
        >
          {ctaLabel} <CtaIcon size={20} />
        </Button>
      </div>
    </div>
  );
};

export default StartingBanner;
