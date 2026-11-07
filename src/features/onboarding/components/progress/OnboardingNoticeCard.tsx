import { ClockCountdown, WarningCircle } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { brand } from '@/config/brand';
import type { OnboardingNotice } from '@/features/onboarding/hooks';
import { cn } from '@/lib/utils';

const MESSAGES: Record<OnboardingNotice, string> = {
  skip: `${brand.assistantName} isn't active yet because no communication channels have been added.`,
  widgetActive: `Great job! The ${brand.name} widget has been successfully installed and is now ready to start assisting your customers.`,
  whatsAppActive: `${brand.assistantName} is now live on WhatsApp!`,
};

interface Props {
  notice: OnboardingNotice;
  onDismiss: () => void;
}

const OnboardingNoticeCard = ({ notice, onDismiss }: Props) => {
  const isWarning = notice === 'skip';

  return (
    <div
      className={cn(
        'mb-4 rounded-xl border bg-white p-3 shadow-[0_4px_11px_-4px_rgba(14,25,39,0.05),0_2px_6px_-2px_rgba(14,25,39,0.2)]',
        isWarning ? 'border-red-400' : 'border-green-400',
      )}
    >
      {isWarning ? (
        <WarningCircle weight="fill" className="mb-2 text-strokes-alert" size={20} />
      ) : (
        <ClockCountdown weight="fill" className="mb-2 text-icon-success" size={20} />
      )}
      <p className="mb-2 text-sm font-semibold">{MESSAGES[notice]}</p>
      <div className="border-t border-basic-blocks pt-3">
        <Button variant="text" size="auto" onClick={onDismiss}>
          Got it
        </Button>
      </div>
    </div>
  );
};

export default OnboardingNoticeCard;
