'use client';

import { Controller, useForm } from 'react-hook-form';
import { ReactPhoneInput } from '@/components/ui/phone-input';
import { brand } from '@/config/brand';
import WhatsAppSignupButton from '@/features/onboarding/components/WhatsAppSignupButton';
import { useClinic, useSettings, useUpdateSettings, useWorkspace } from '@/features/workspace/hooks';
import { useSettingsToasts } from '@/features/settings/hooks';
import { SETTINGS_FORM_ID } from '@/features/settings/utils';
import SaveSettingsFooter from '@/features/settings/components/SaveSettingsFooter';
import SettingsQueryFallback from '@/features/settings/components/SettingsQueryFallback';
import type { Clinic, ClinicSettings } from '@/lib/api/types';

interface FormValues {
  phone_number: string;
}

interface Props {
  clinic: Clinic;
  settings: ClinicSettings;
  /** Number provisioned for the workspace's messaging channels, if any. */
  dedicatedNumber: string | null;
}

const WhatsAppSettingsForm = ({ clinic, settings, dedicatedNumber }: Props) => {
  const form = useForm<FormValues>({ defaultValues: { phone_number: settings.phone_number ?? '' } });
  const { mutateAsync } = useUpdateSettings();
  const { successToast, showSaveError } = useSettingsToasts();

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await mutateAsync({ phone_number: values.phone_number || null });
      successToast('Your business phone number has been updated');
      form.reset(values);
    } catch (error) {
      showSaveError(error);
    }
  });

  return (
    <>
      <div className="h-full overflow-auto">
        <div className="md:max-w-[464px]">
          {dedicatedNumber && (
            <div className="mb-12">
              <h3 className="mb-4 text-lg font-semibold">Your dedicated WhatsApp number</h3>
              <p className="mb-6 text-sm font-medium text-text-secondary">
                This phone number is assigned to your business when you sign up with {brand.name}.
              </p>
              <ReactPhoneInput
                id="dedicated_phone_number"
                value={dedicatedNumber}
                className="mb-1"
                disabled
              />
            </div>
          )}
          <div className="mb-12">
            <h3 className="mb-4 text-lg font-semibold">Customer call number</h3>
            <p className="mb-6 text-sm font-medium text-text-secondary">
              Add your business phone number for customer calls. This number cannot be used for any of{' '}
              {brand.name}&apos;s channels.
            </p>
            <form id={SETTINGS_FORM_ID} onSubmit={onSubmit}>
              <Controller
                name="phone_number"
                control={form.control}
                render={({ field }) => (
                  <ReactPhoneInput
                    id="phone_number"
                    className="mb-1"
                    value={field.value}
                    onChange={(value?: string) => field.onChange(value ?? '')}
                  />
                )}
              />
            </form>
          </div>
        </div>

        {!clinic.waba_active && (
          <div className="md:max-w-[464px]">
            <h3 className="mb-5 text-lg font-semibold">Activate WhatsApp for Business</h3>
            <p className="mb-4 text-gray-700">
              Log in with the personal Facebook account linked to your Meta business portfolio (if you have
              one).
            </p>
            <p>
              To activate WhatsApp for Business on {brand.name}, you must create a new WhatsApp Business
              Account (WABA).
            </p>
            <p className="mb-4">Existing accounts should not be used.</p>
            <WhatsAppSignupButton clinicName={clinic.name} phoneNumber={clinic.phone} />
          </div>
        )}
      </div>

      <SaveSettingsFooter onDiscard={() => form.reset()} isSaving={form.formState.isSubmitting} />
    </>
  );
};

const WhatsAppSettings = () => {
  const { data: clinic, ...clinicQuery } = useClinic();
  const { data: settings, ...settingsQuery } = useSettings();
  // The dedicated number is optional; don't block the page on it.
  const { data: workspace } = useWorkspace();

  if (!clinic || !settings) return <SettingsQueryFallback queries={[clinicQuery, settingsQuery]} />;

  return (
    <WhatsAppSettingsForm
      clinic={clinic}
      settings={settings}
      dedicatedNumber={workspace?.phone_number ?? null}
    />
  );
};

export default WhatsAppSettings;
