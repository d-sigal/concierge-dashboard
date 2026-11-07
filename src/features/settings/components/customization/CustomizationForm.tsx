'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { FormField } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import SearchSelect from '@/components/ui/search-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { brand } from '@/config/brand';
import { useClinic, useSettings, useUpdateClinic, useUpdateSettings } from '@/features/workspace/hooks';
import { useSettingsToasts } from '@/features/settings/hooks';
import { SETTINGS_FORM_ID } from '@/features/settings/utils';
import SaveSettingsFooter from '@/features/settings/components/SaveSettingsFooter';
import SettingsBlock from '@/features/settings/components/SettingsBlock';
import SettingsQueryFallback from '@/features/settings/components/SettingsQueryFallback';
import WebsiteForm from '@/features/settings/components/WebsiteForm';
import type { Clinic, ClinicSettings } from '@/lib/api/types';
import { BUSINESS_TYPES, LANGUAGES } from '@/lib/constants';

interface CustomizationFormValues {
  clinic_type: string;
  language: string;
}

interface Props {
  clinic: Clinic;
  settings: ClinicSettings;
}

const CustomizationFormContent = ({ clinic, settings }: Props) => {
  const form = useForm<CustomizationFormValues>({
    defaultValues: { clinic_type: settings.clinic_type ?? '', language: clinic.language ?? '' },
  });
  const updateSettings = useUpdateSettings();
  const updateClinic = useUpdateClinic();
  const { successToast, showSaveError } = useSettingsToasts();

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await Promise.all([
        updateSettings.mutateAsync({ clinic_type: values.clinic_type }),
        values.language ? updateClinic.mutateAsync({ language: values.language }) : undefined,
      ]);
      successToast('Your changes have been saved.');
      form.reset(values);
    } catch (error) {
      showSaveError(error);
    }
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} id={SETTINGS_FORM_ID} className="flex h-full flex-col">
        <div className="flex flex-col space-y-12 pb-12 md:max-w-[464px]">
          <SettingsBlock
            title="Business type"
            description={`Choose your industry to help ${brand.assistantName} deliver more accurate responses and tailored recommendations.`}
          >
            <FormField
              name="clinic_type"
              rules={{ required: { value: true, message: 'This field is required' } }}
              render={({ field, fieldState }) => (
                <>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <SelectTrigger hasError={Boolean(fieldState.error)}>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_TYPES.map(({ label, value }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-700">{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </SettingsBlock>
          <SettingsBlock
            title="Train on website content"
            description={`Add your website so ${brand.assistantName} can learn your service descriptions, practitioner expertise, and brand voice.`}
          >
            <WebsiteForm url={clinic.url} lastUpdated={clinic.website_last_crawled_at} className="mb-0" />
          </SettingsBlock>
          <SettingsBlock
            title="Choose your language"
            description={`Set the default language for ${brand.assistantName}.`}
          >
            <Label className="block">Default language</Label>
            <SearchSelect options={LANGUAGES} name="language" />
          </SettingsBlock>
        </div>
        <SaveSettingsFooter onDiscard={() => form.reset()} isSaving={form.formState.isSubmitting} />
      </form>
    </FormProvider>
  );
};

const CustomizationForm = () => {
  const { data: clinic, ...clinicQuery } = useClinic();
  const { data: settings, ...settingsQuery } = useSettings();

  if (!clinic || !settings) return <SettingsQueryFallback queries={[clinicQuery, settingsQuery]} />;

  return <CustomizationFormContent clinic={clinic} settings={settings} />;
};

export default CustomizationForm;
