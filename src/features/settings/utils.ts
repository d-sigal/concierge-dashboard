import { ApiError, getErrorMessage } from '@/lib/api/client';
import type { ClinicSettings } from '@/lib/api/types';

/** Shared by every settings form so the sticky footer's submit button can target it. */
export const SETTINGS_FORM_ID = 'settingsForm';

/** Client errors carry a useful detail from the backend; server errors get a generic message. */
export const getSaveErrorMessage = (error: unknown) =>
  error instanceof ApiError && error.status >= 500
    ? 'Something went wrong. Please try again.'
    : getErrorMessage(error);

export type AdditionalSettings = Record<string, unknown>;

/**
 * `additional_settings` is a free-form JSON string. Older backends wrote it
 * with Python-style single quotes, so normalize before parsing and never throw.
 */
export const parseAdditionalSettings = (raw: string | null | undefined): AdditionalSettings => {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw.replace(/'/g, '"'));
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as AdditionalSettings)
      : {};
  } catch {
    return {};
  }
};

export type WidgetChannels = 'whatsapp' | 'chat' | 'both' | 'none';

type WidgetSettings = Pick<ClinicSettings, 'whatsapp_chat_enabled' | 'live_chat_enabled'>;

export const getWidgetChannels = ({
  whatsapp_chat_enabled,
  live_chat_enabled,
}: WidgetSettings): WidgetChannels => {
  if (whatsapp_chat_enabled && live_chat_enabled) return 'both';
  if (whatsapp_chat_enabled) return 'whatsapp';
  if (live_chat_enabled) return 'chat';
  return 'none';
};

export const getWidgetSettings = (channels: WidgetChannels): WidgetSettings => ({
  whatsapp_chat_enabled: channels === 'whatsapp' || channels === 'both',
  live_chat_enabled: channels === 'chat' || channels === 'both',
});
