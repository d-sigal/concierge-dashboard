'use client';

import { useEffect, useState } from 'react';
import Confetti from 'react-dom-confetti';
import { Confetti as ConfettiIcon } from '@phosphor-icons/react';
import Illustration from '@/components/common/Illustration';
import { Button } from '@/components/ui/button';
import { brand } from '@/config/brand';
import { useUpdateClinic } from '@/features/workspace/hooks';

const CONFETTI_CONFIG = {
  angle: 90,
  spread: 130,
  startVelocity: 24,
  elementCount: 100,
  dragFriction: 0.07,
  duration: 4000,
  stagger: 3,
  width: '10px',
  height: '10px',
  colors: ['#A8F5BFE5', '#5BD27BD9', '#59E88459', '#59E88499', '#7DDE9A'],
};

const OnboardingCompleted = () => {
  const [isConfettiActive, setIsConfettiActive] = useState(false);
  const { mutate: updateClinic } = useUpdateClinic();

  // Confetti only fires on an inactive -> active transition, so flip it after mount.
  useEffect(() => setIsConfettiActive(true), []);

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[344px]">
      <div className="rounded-xl border border-basic-blocks bg-white px-5 py-6 text-center shadow-[0_4px_6px_-2px_rgba(14,25,39,0.05),0_6px_14px_-1px_rgba(14,25,39,0.2)] transition-all">
        <Illustration icon={ConfettiIcon} className="mx-auto mb-8 size-[120px] rounded-full" />
        <Confetti active={isConfettiActive} config={CONFETTI_CONFIG} />
        <h3 className="mb-2 text-lg font-semibold">Setup completed!</h3>
        <p className="mb-8 text-sm font-medium text-gray-700">
          You&apos;re all set. {brand.assistantName} is ready to help your customers.
        </p>
        <Button className="min-w-[160px]" onClick={() => updateClinic({ is_onboarded: true })}>
          Great
        </Button>
      </div>
    </div>
  );
};

export default OnboardingCompleted;
