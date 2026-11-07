'use client';

import { Dialog } from '@/components/ui/dialog';
import OnboardingProgress from '@/features/onboarding/components/progress/OnboardingProgress';
import ChannelsStep from '@/features/onboarding/components/steps/ChannelsStep';
import IntroStep from '@/features/onboarding/components/steps/IntroStep';
import LiveChatStep from '@/features/onboarding/components/steps/LiveChatStep';
import TrainAssistantStep from '@/features/onboarding/components/steps/TrainAssistantStep';
import WhatsAppConnectedStep from '@/features/onboarding/components/steps/WhatsAppConnectedStep';
import WhatsAppSignupStep from '@/features/onboarding/components/steps/WhatsAppSignupStep';
import { useOnboardingFlow } from '@/features/onboarding/hooks';

const OnboardingFlow = () => {
  const {
    isRestored,
    step,
    isGuidedSetup,
    notice,
    setNotice,
    openStep,
    close,
    dismiss,
    confirmWhatsAppConnected,
  } = useOnboardingFlow();

  if (!isRestored) return null;

  if (step === null) return <OnboardingProgress notice={notice} setNotice={setNotice} openStep={openStep} />;

  const renderStep = () => {
    switch (step) {
      case 'intro':
        return <IntroStep onStart={() => openStep('channels')} />;
      case 'channels':
        return (
          <ChannelsStep
            onNotNow={dismiss}
            onSelectWhatsApp={() => openStep('whatsapp')}
            onSelectLiveChat={() => openStep('liveChat')}
          />
        );
      case 'whatsapp':
        return (
          <WhatsAppSignupStep
            isGuidedSetup={isGuidedSetup}
            onSkip={dismiss}
            onConnected={() => openStep('whatsappConnected')}
          />
        );
      case 'whatsappConnected':
        return <WhatsAppConnectedStep onConfirm={confirmWhatsAppConnected} />;
      case 'liveChat':
        return <LiveChatStep isGuidedSetup={isGuidedSetup} onNotNow={dismiss} onDone={close} />;
      case 'train':
        return <TrainAssistantStep onClose={close} />;
    }
  };

  return (
    // Closing via overlay, Escape or the close icon counts as "not now", except for
    // the training step, which simply returns to the checklist.
    <Dialog open onOpenChange={(open) => !open && (step === 'train' ? close() : dismiss())}>
      {renderStep()}
    </Dialog>
  );
};

export default OnboardingFlow;
