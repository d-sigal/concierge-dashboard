'use client';

import { useSettings, useUpdateSettings } from '@/features/workspace/hooks';
import useNotificationsToasts from '@/hooks/useNotificationsToasts';
import { getSaveErrorMessage, parseAdditionalSettings } from '@/features/settings/utils';

/** Toast helpers with the settings-specific error message mapping. */
export const useSettingsToasts = () => {
  const { successToast, errorToast } = useNotificationsToasts();
  return {
    successToast,
    showSaveError: (error: unknown) => errorToast(getSaveErrorMessage(error)),
  };
};

/**
 * One-off prompts (e.g. "train on your website?") are remembered as `false`
 * flags inside `additional_settings` once the user acts on or dismisses them.
 */
export const useSettingsPrompt = (key: string) => {
  const { data: settings } = useSettings();
  const { mutate } = useUpdateSettings();
  const additionalSettings = parseAdditionalSettings(settings?.additional_settings);

  const dismiss = () => {
    if (!settings) return;
    mutate({ additional_settings: JSON.stringify({ ...additionalSettings, [key]: false }) });
  };

  return {
    isVisible: Boolean(settings) && !Object.hasOwn(additionalSettings, key),
    dismiss,
  };
};
