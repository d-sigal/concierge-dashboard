/** The subset of the Facebook JavaScript SDK used for WhatsApp embedded signup. */
interface FacebookSdk {
  init(options: { appId: string; autoLogAppEvents: boolean; xfbml: boolean; version: string }): void;
  login(callback: (response: unknown) => void, options: Record<string, unknown>): void;
}

declare global {
  interface Window {
    FB?: FacebookSdk;
    fbAsyncInit?: () => void;
  }
}

const SDK_SCRIPT_ID = 'facebook-jssdk';
const SDK_VERSION = 'v21.0';

let sdkPromise: Promise<FacebookSdk> | null = null;

/** Load and initialize the SDK once per page, however many signup buttons are mounted. */
export const loadFacebookSdk = (appId: string): Promise<FacebookSdk> => {
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<FacebookSdk>((resolve, reject) => {
    const initialize = () => {
      if (!window.FB) return reject(new Error('Facebook SDK failed to initialize'));
      window.FB.init({ appId, autoLogAppEvents: true, xfbml: true, version: SDK_VERSION });
      resolve(window.FB);
    };

    if (window.FB) return initialize();
    window.fbAsyncInit = initialize;
    if (document.getElementById(SDK_SCRIPT_ID)) return;
    const script = document.createElement('script');
    script.id = SDK_SCRIPT_ID;
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.onerror = () => {
      sdkPromise = null;
      script.remove();
      reject(new Error('Facebook SDK failed to load'));
    };
    document.body.appendChild(script);
  });

  return sdkPromise;
};

/** Only trust messages posted by Facebook itself over HTTPS. */
export const isFacebookOrigin = (origin: string) => {
  try {
    const { protocol, hostname } = new URL(origin);
    return protocol === 'https:' && (hostname === 'facebook.com' || hostname.endsWith('.facebook.com'));
  } catch {
    return false;
  }
};

interface EmbeddedSignupFinish {
  type: 'WA_EMBEDDED_SIGNUP';
  event: 'FINISH' | 'FINISH_ONLY_WABA';
  data: { waba_id: string };
}

/** Parse a `message` event payload into a completed embedded signup, if it is one. */
export const parseEmbeddedSignupFinish = (payload: unknown): EmbeddedSignupFinish | null => {
  let data: unknown = payload;
  if (typeof payload === 'string') {
    try {
      data = JSON.parse(payload);
    } catch {
      return null;
    }
  }
  if (typeof data !== 'object' || data === null) return null;

  const message = data as Partial<Record<'type' | 'event' | 'data', unknown>>;
  if (message.type !== 'WA_EMBEDDED_SIGNUP') return null;
  if (message.event !== 'FINISH' && message.event !== 'FINISH_ONLY_WABA') return null;

  const details = message.data as { waba_id?: unknown } | undefined;
  if (typeof details?.waba_id !== 'string' || !details.waba_id) return null;

  return { type: 'WA_EMBEDDED_SIGNUP', event: message.event, data: { waba_id: details.waba_id } };
};
