import { ChatCircleDots } from '@phosphor-icons/react';
import Illustration from '@/components/common/Illustration';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogTitle } from '@/components/ui/dialog';
import { brand } from '@/config/brand';
import { env } from '@/config/env';
import WidgetInstallationSteps from '@/features/onboarding/components/WidgetInstallationSteps';
import { cn } from '@/lib/utils';

interface Props {
  isGuidedSetup: boolean;
  onNotNow: () => void;
  /** Called when the user finished installing the widget or booked a setup call. */
  onDone: () => void;
}

const LiveChatStep = ({ isGuidedSetup, onNotNow, onDone }: Props) => (
  <DialogContent
    closeIconClassName={cn(isGuidedSetup && 'hidden')}
    className="p-6 md:max-w-[680px] lg:max-w-[920px] lg:p-8"
    aria-describedby={undefined}
  >
    <div className="grid-cols-[320px_1fr] gap-x-8 lg:grid">
      <Illustration icon={ChatCircleDots} className="hidden h-[333px] rounded-lg lg:flex" />
      <div>
        <div className="mb-4 flex items-center justify-between">
          {isGuidedSetup && (
            <>
              <span className="text-sm">2/2</span>
              <Button variant="text" size="auto" onClick={onNotNow} className="h-auto text-sm text-gray-500">
                Not now
              </Button>
            </>
          )}
        </div>
        <div className="scrollbar-custom flex max-h-[720px] max-w-full flex-col overflow-y-auto">
          <DialogTitle asChild>
            <h1 className="mb-3 text-xl font-bold">Add the {brand.name} widget to your website</h1>
          </DialogTitle>
          {env.onboardingCallUrl ? (
            <>
              <p className="mb-6 text-sm font-medium">
                We recommend letting our team handle the setup for you, but if you&apos;d like to do it
                yourself, it&apos;s easy and quick!
              </p>
              <div className="mb-4 border-b border-b-slate-200 pb-4">
                <div className="mb-4">
                  <strong>Option 1.</strong> <span className="pl-2 text-sm">Let us install it for you</span>{' '}
                  <Badge variant="recommended" className="ml-2">
                    Recommended
                  </Badge>
                </div>
                <div className="rounded-2xl bg-white">
                  <h3 className="mb-4 font-medium">Schedule a 15 minute onboarding call with our team</h3>
                  <Button asChild className="w-full lg:w-auto">
                    <a
                      href={env.onboardingCallUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onDone}
                    >
                      Schedule now
                    </a>
                  </Button>
                </div>
              </div>
              <p className="mb-4">
                <strong>Option 2.</strong> <span className="text-sm">Quick and easy self-install</span>
              </p>
            </>
          ) : (
            <p className="mb-6 text-sm font-medium">
              It only takes a few minutes to add the widget yourself.
            </p>
          )}
          <WidgetInstallationSteps isOnboardingActive onClickSelfInstall={onDone} />
        </div>
      </div>
    </div>
  </DialogContent>
);

export default LiveChatStep;
