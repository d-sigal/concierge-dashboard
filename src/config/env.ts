/**
 * Typed access to public runtime configuration.
 *
 * Next.js only inlines `NEXT_PUBLIC_*` variables when they are referenced
 * statically, so every variable is read explicitly here and nowhere else.
 */

const trim = (value: string | undefined) => (value && value.trim().length > 0 ? value.trim() : undefined);

export const env = {
  /** Base URL of the backend REST API. When unset the app runs in demo mode with an in-memory mock API. */
  apiUrl: trim(process.env.NEXT_PUBLIC_API_URL),
  /** Base URL of the backend WebSocket server (e.g. wss://api.example.com/ws). */
  wsUrl: trim(process.env.NEXT_PUBLIC_WS_URL),

  clerkPublishableKey: trim(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY),
  /** Optional Clerk JWT template used when requesting tokens for the backend. */
  clerkTokenTemplate: trim(process.env.NEXT_PUBLIC_CLERK_TOKEN_TEMPLATE),

  facebookAppId: trim(process.env.NEXT_PUBLIC_FACEBOOK_APP_ID),
  facebookConfigId: trim(process.env.NEXT_PUBLIC_FACEBOOK_CONFIG_ID),

  /** Script tag source for the embeddable website chat widget. */
  widgetScriptUrl: trim(process.env.NEXT_PUBLIC_WIDGET_SCRIPT_URL),
  /** Where users manage or upgrade their subscription. Billing links are hidden when unset. */
  billingUrl: trim(process.env.NEXT_PUBLIC_BILLING_URL),
  /** Booking link for a guided setup call. The "book a call" option is hidden when unset. */
  onboardingCallUrl: trim(process.env.NEXT_PUBLIC_ONBOARDING_CALL_URL),

  productName: trim(process.env.NEXT_PUBLIC_PRODUCT_NAME),
  supportEmail: trim(process.env.NEXT_PUBLIC_SUPPORT_EMAIL),
  termsUrl: trim(process.env.NEXT_PUBLIC_TERMS_URL),
} as const;

export const isDemoMode = !env.apiUrl;
export const isClerkEnabled = Boolean(env.clerkPublishableKey);
export const isWhatsAppSignupEnabled = Boolean(env.facebookAppId && env.facebookConfigId);
