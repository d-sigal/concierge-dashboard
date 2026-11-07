import { env } from '@/config/env';

/**
 * Everything user-facing that identifies the product lives here so the
 * dashboard can be white-labeled through environment variables alone.
 * Colors are themed separately through CSS variables in `src/app/globals.css`.
 */
const name = env.productName ?? 'Concierge';

export const brand = {
  name,
  /** How the AI assistant is referred to in the UI. */
  assistantName: `${name} AI`,
  supportEmail: env.supportEmail,
  termsUrl: env.termsUrl,
} as const;
