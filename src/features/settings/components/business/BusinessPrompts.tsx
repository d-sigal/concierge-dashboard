'use client';

import { brand } from '@/config/brand';
import { useUpdateClinic } from '@/features/workspace/hooks';
import { useSettingsToasts } from '@/features/settings/hooks';
import SettingsPromptBanner from '@/features/settings/components/business/SettingsPromptBanner';
import { LANGUAGES } from '@/lib/constants';

export const DefaultLanguagePrompt = ({ language }: { language: string }) => {
  const { mutate, isPending } = useUpdateClinic();
  const { successToast, showSaveError } = useSettingsToasts();
  const languageLabel = LANGUAGES.find(({ value }) => value === language)?.label ?? language;

  return (
    <SettingsPromptBanner
      promptKey="shouldSetDefaultLanguage"
      message={`Set this language as default for ${brand.assistantName}?`}
      actionLabel="Set"
      dialogTitle={`Save ${languageLabel} as the default language for ${brand.assistantName}?`}
      dialogDescription={`Set the default language ${brand.assistantName} uses to communicate with your contacts.`}
      isConfirming={isPending}
      onConfirm={(done) =>
        mutate(
          { language },
          {
            onSuccess: () => {
              successToast('Default language has been updated.');
              done();
            },
            onError: showSaveError,
          },
        )
      }
    />
  );
};

export const TrainOnWebsitePrompt = ({ website }: { website: string }) => {
  const { mutate, isPending } = useUpdateClinic();
  const { successToast, showSaveError } = useSettingsToasts();

  return (
    <SettingsPromptBanner
      promptKey="shouldTrainConcierge"
      message={`Train ${brand.assistantName} on your website content?`}
      actionLabel="Train"
      dialogTitle={`Train ${brand.assistantName}?`}
      dialogDescription={`Let ${brand.assistantName} learn your service descriptions, practitioner expertise, and brand voice so it reflects your business perfectly.`}
      isConfirming={isPending}
      onConfirm={(done) =>
        mutate(
          { url: website },
          {
            onSuccess: () => {
              successToast(
                `${brand.assistantName} is now learning your site content. We'll notify you by email once it's ready.`,
              );
              done();
            },
            onError: showSaveError,
          },
        )
      }
    />
  );
};
