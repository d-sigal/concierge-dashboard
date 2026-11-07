'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useInstalledChannels } from '@/features/workspace/hooks';
import { readLocalStorage, writeLocalStorage } from '@/lib/utils';

export const ONBOARDING_STEPS = [
  'intro',
  'channels',
  'whatsapp',
  'whatsappConnected',
  'liveChat',
  'train',
] as const;
export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

/** Status message shown above the setup checklist after a dialog closes. */
export type OnboardingNotice = 'skip' | 'whatsAppActive' | 'widgetActive';

const STEP_STORAGE_KEY = 'onboarding.step';
/** Stored when the dialog is closed and only the setup checklist is visible. */
const CLOSED = 'closed';

const isOnboardingStep = (value: string | null): value is OnboardingStep =>
  ONBOARDING_STEPS.some((step) => step === value);

/**
 * State machine for the onboarding dialogs. `step === null` means no dialog is
 * open and the setup checklist is shown instead. The current step survives reloads.
 */
export const useOnboardingFlow = () => {
  const { installedCount, isWhatsAppInstalled, isWidgetInstalled } = useInstalledChannels();
  const [isRestored, setIsRestored] = useState(false);
  const [step, setStep] = useState<OnboardingStep | null>('intro');
  /** True while walking through WhatsApp then the widget in one go ("1/2", "2/2"). */
  const [isGuidedSetup, setIsGuidedSetup] = useState(false);
  const [notice, setNotice] = useState<OnboardingNotice | null>(null);

  // Storage is read after mount so server and client render the same markup.
  useEffect(() => {
    const stored = readLocalStorage(STEP_STORAGE_KEY);
    if (stored === CLOSED) setStep(null);
    else if (isOnboardingStep(stored)) setStep(stored);
    setIsRestored(true);
  }, []);

  const goTo = useCallback((next: OnboardingStep | null) => {
    writeLocalStorage(STEP_STORAGE_KEY, next ?? CLOSED);
    setStep(next);
  }, []);

  const openStep = (next: OnboardingStep) => {
    if (next === 'whatsapp' && !isWidgetInstalled) setIsGuidedSetup(true);
    goTo(next);
  };

  /** Close the dialog and show the checklist. */
  const close = () => {
    setIsGuidedSetup(false);
    goTo(null);
  };

  /** "Not now": close and tell the user where things stand. */
  const dismiss = () => {
    close();
    if (installedCount === 0) setNotice('skip');
    else if (isWhatsAppInstalled) setNotice('whatsAppActive');
  };

  const confirmWhatsAppConnected = () => {
    if (isGuidedSetup) goTo('liveChat');
    else close();
  };

  return {
    isRestored,
    step,
    isGuidedSetup,
    notice,
    setNotice,
    openStep,
    close,
    dismiss,
    confirmWhatsAppConnected,
  };
};

/** Copy text and flag which item was copied for a short moment. */
export const useCopyToClipboard = <Key extends string>() => {
  const [copiedKey, setCopiedKey] = useState<Key | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timeout.current), []);

  const copy = (key: Key, text: string) => {
    void navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  return { copiedKey, copy };
};
