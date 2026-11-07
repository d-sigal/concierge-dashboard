'use client';

import { useEffect, useRef, useState } from 'react';
import Spinner from '@/components/icons/Spinner';
import { env, isDemoMode, isWhatsAppSignupEnabled } from '@/config/env';
import {
  isFacebookOrigin,
  loadFacebookSdk,
  parseEmbeddedSignupFinish,
} from '@/features/onboarding/facebook-sdk';
import { useConnectWhatsApp } from '@/features/workspace/hooks';
import useNotificationsToasts from '@/hooks/useNotificationsToasts';
import { getErrorMessage } from '@/lib/api/client';
import { cn } from '@/lib/utils';

interface Props {
  clinicName?: string;
  phoneNumber?: string;
  onLogin?: (phoneNumber: string) => void;
  className?: string;
}

const buttonClassName =
  'flex h-10 cursor-pointer items-center justify-center gap-x-2 rounded border-0 bg-[#1877f2] px-6 font-sans text-base font-bold text-white disabled:cursor-not-allowed disabled:opacity-50';

/**
 * Connects a WhatsApp Business Account through Meta's embedded signup. The
 * resulting WABA id is handed to the backend, which provisions the sender
 * server-side. In demo mode without Facebook credentials the signup is simulated.
 */
const WhatsAppSignupButton = ({ clinicName, phoneNumber, onLogin, className }: Props) => {
  const { mutate, isPending } = useConnectWhatsApp();
  const { errorToast } = useNotificationsToasts();
  const [isSdkReady, setIsSdkReady] = useState(false);
  const isSignupOpen = useRef(false);

  const connect = (wabaId: string) => {
    if (!phoneNumber) return;
    mutate(
      { waba_id: wabaId, phone_number: phoneNumber, display_name: clinicName ?? '' },
      {
        onSuccess: () => onLogin?.(phoneNumber),
        onError: (error) => errorToast(getErrorMessage(error)),
      },
    );
  };

  // The message listener is registered once; it must always call the latest `connect`.
  const connectRef = useRef(connect);
  useEffect(() => {
    connectRef.current = connect;
  });

  useEffect(() => {
    if (!isWhatsAppSignupEnabled || !env.facebookAppId) return;

    let isMounted = true;
    loadFacebookSdk(env.facebookAppId).then(
      () => isMounted && setIsSdkReady(true),
      () => isMounted && errorToast('Could not load Facebook. Check your connection and reload the page.'),
    );

    const onMessage = (event: MessageEvent) => {
      if (!isSignupOpen.current || !isFacebookOrigin(event.origin)) return;
      const finish = parseEmbeddedSignupFinish(event.data);
      if (!finish) return;
      isSignupOpen.current = false;
      connectRef.current(finish.data.waba_id);
    };

    window.addEventListener('message', onMessage);
    return () => {
      isMounted = false;
      window.removeEventListener('message', onMessage);
    };
    // The toast helper is recreated on every render; loading the SDK once is intended.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const launchSignup = () => {
    if (!isWhatsAppSignupEnabled) {
      connect(`demo-waba-${Date.now()}`);
      return;
    }
    if (!window.FB) return;

    isSignupOpen.current = true;
    window.FB.login(() => undefined, {
      config_id: env.facebookConfigId,
      auth_type: 'rerequest',
      response_type: 'code',
      override_default_response_type: true,
      extras: { sessionInfoVersion: 2, featureType: 'only_waba_sharing' },
    });
  };

  if (!isWhatsAppSignupEnabled && !isDemoMode) {
    return (
      <div className="space-y-2">
        <button type="button" disabled className={cn(buttonClassName, className)}>
          Log in with Facebook
        </button>
        <p className="text-sm text-gray-500">
          WhatsApp signup is not configured. Set NEXT_PUBLIC_FACEBOOK_APP_ID and
          NEXT_PUBLIC_FACEBOOK_CONFIG_ID to enable it.
        </p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={launchSignup}
      disabled={isPending || !phoneNumber || (isWhatsAppSignupEnabled && !isSdkReady)}
      className={cn(buttonClassName, className)}
    >
      {isPending && <Spinner className="size-4" />}
      Log in with Facebook
    </button>
  );
};

export default WhatsAppSignupButton;
