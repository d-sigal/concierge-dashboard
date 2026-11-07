'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import InputFile from '@/components/ui/input-file';
import { Label } from '@/components/ui/label';
import SearchSelect from '@/components/ui/search-select';
import { useSettings, useUpdateSettings, useUploadLogo } from '@/features/workspace/hooks';
import { useSettingsToasts } from '@/features/settings/hooks';
import { SETTINGS_FORM_ID } from '@/features/settings/utils';
import SaveSettingsFooter from '@/features/settings/components/SaveSettingsFooter';
import SettingsQueryFallback from '@/features/settings/components/SettingsQueryFallback';
import {
  DefaultLanguagePrompt,
  TrainOnWebsitePrompt,
} from '@/features/settings/components/business/BusinessPrompts';
import type { ClinicSettings } from '@/lib/api/types';
import { CURRENCIES, LANGUAGES, TIME_ZONES } from '@/lib/constants';

interface BusinessFormValues {
  business_name: string;
  /** The current logo URL, or a newly picked file waiting to be uploaded. */
  logo: string | File;
  default_language: string;
  default_currency: string;
  timezone: string;
  website: string;
  email: string;
}

const toFormValues = (settings: ClinicSettings): BusinessFormValues => ({
  business_name: settings.business_name ?? '',
  logo: settings.logo ?? '',
  default_language: settings.default_language ?? '',
  default_currency: settings.default_currency ?? '',
  timezone: settings.timezone ?? '',
  website: settings.website ?? '',
  email: settings.email ?? '',
});

const BusinessSettingsForm = ({ settings }: { settings: ClinicSettings }) => {
  const form = useForm<BusinessFormValues>({ defaultValues: toFormValues(settings) });
  const updateSettings = useUpdateSettings();
  const uploadLogo = useUploadLogo();
  const { successToast, showSaveError } = useSettingsToasts();

  const onSubmit = form.handleSubmit(async ({ logo, ...rest }) => {
    try {
      await updateSettings.mutateAsync({
        ...rest,
        timezone: rest.timezone || null,
        default_currency: rest.default_currency || null,
        website: rest.website || null,
        email: rest.email || null,
      });
      const savedLogo = logo instanceof File ? (await uploadLogo.mutateAsync(logo)).logo : logo;
      successToast('Your information is being updated. Logo change may take a few minutes.');
      form.reset({ ...rest, logo: savedLogo });
    } catch (error) {
      showSaveError(error);
    }
  });

  const language = form.watch('default_language');
  const website = form.watch('website');

  return (
    <FormProvider {...form}>
      <form id={SETTINGS_FORM_ID} className="flex h-full flex-col" onSubmit={onSubmit}>
        <div className="space-y-6 lg:max-w-[464px]">
          <div>
            <Label className="block">Business name</Label>
            <FormField
              name="business_name"
              rules={{ required: { value: true, message: 'This field is required' } }}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    placeholder="Enter a name"
                    className={fieldState.error && 'border-red-400'}
                  />
                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-700">{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>
          <div>
            <Label className="block">Logo</Label>
            <InputFile maxSize={10} name="logo" id="logo" />
          </div>
          <div>
            <Label className="block">Default language</Label>
            <SearchSelect className="mb-1" options={LANGUAGES} name="default_language" />
            {language && <DefaultLanguagePrompt language={language} />}
          </div>
          <div>
            <Label className="block">Default currency</Label>
            <SearchSelect options={CURRENCIES} name="default_currency" />
          </div>
          <div>
            <Label className="block">Time zone</Label>
            <SearchSelect options={TIME_ZONES} name="timezone" />
          </div>
          <div>
            <Label className="block">Website address</Label>
            <FormField
              name="website"
              render={({ field }) => <Input {...field} className="mb-1" placeholder="https://website.com" />}
            />
            {website && <TrainOnWebsitePrompt website={website} />}
          </div>
          <div>
            <Label className="block">Business email</Label>
            <FormField
              name="email"
              render={({ field }) => <Input {...field} type="email" placeholder="Add business email" />}
            />
          </div>
        </div>
        <SaveSettingsFooter onDiscard={() => form.reset()} isSaving={form.formState.isSubmitting} />
      </form>
    </FormProvider>
  );
};

const BusinessSettings = () => {
  const { data: settings, ...query } = useSettings();

  return (
    <div className="flex h-full flex-col">
      <h3 className="mb-6 text-lg font-semibold">Core information</h3>
      {settings ? <BusinessSettingsForm settings={settings} /> : <SettingsQueryFallback queries={[query]} />}
    </div>
  );
};

export default BusinessSettings;
