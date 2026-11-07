'use client';

import type { PropsWithChildren, ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { WhatsappLogo } from '@phosphor-icons/react';
import Logo from '@/components/icons/Logo';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { brand } from '@/config/brand';
import { useUpdateSettings } from '@/features/workspace/hooks';
import { useSettingsToasts } from '@/features/settings/hooks';
import {
  getWidgetChannels,
  getWidgetSettings,
  SETTINGS_FORM_ID,
  type WidgetChannels,
} from '@/features/settings/utils';
import SaveSettingsFooter from '@/features/settings/components/SaveSettingsFooter';
import type { ClinicSettings } from '@/lib/api/types';

const ICON_CLASS_NAME =
  'grid size-8 place-items-center rounded-full text-white transition-shadow group-hover:shadow-[0px_2px_6px_-2px_rgba(14,25,39,0.05),0px_4px_11px_-4px_rgba(14,25,39,0.15)] md:size-14';

const whatsAppIcon = (
  <div key="whatsapp" className={`${ICON_CLASS_NAME} bg-[#00D95F]`}>
    <WhatsappLogo className="size-4 md:size-9" />
  </div>
);

const liveChatIcon = (
  <div key="chat" className={`${ICON_CLASS_NAME} bg-[#182B23]`}>
    <Logo className="size-4 md:w-8" />
  </div>
);

const WIDGET_OPTIONS: { value: WidgetChannels; title: string; description: string; icons: ReactNode[] }[] = [
  {
    value: 'whatsapp',
    title: 'WhatsApp',
    description:
      'Show only the WhatsApp button, allowing visitors to start a conversation directly in WhatsApp.',
    icons: [whatsAppIcon],
  },
  {
    value: 'chat',
    title: 'Live chat',
    description: 'Enable real-time chat on your website for instant communication with visitors.',
    icons: [liveChatIcon],
  },
  {
    value: 'both',
    title: 'Both',
    description:
      'Offer both WhatsApp and live chat, giving clients the flexibility to choose how they connect.',
    icons: [whatsAppIcon, liveChatIcon],
  },
  {
    value: 'none',
    title: 'None',
    description: `Hide the widget from your website. ${brand.assistantName} can still be active in other channels.`,
    icons: [],
  },
];

interface FormValues {
  widget_channels: WidgetChannels;
}

interface Props extends PropsWithChildren {
  settings: ClinicSettings;
}

/**
 * Picks which channels the website widget shows. `children` render between the
 * options and the sticky footer, outside the <form> so their buttons never submit it.
 */
const WidgetChannelsForm = ({ settings, children }: Props) => {
  const form = useForm<FormValues>({ defaultValues: { widget_channels: getWidgetChannels(settings) } });
  const { mutateAsync } = useUpdateSettings();
  const { successToast, showSaveError } = useSettingsToasts();

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await mutateAsync(getWidgetSettings(values.widget_channels));
      successToast('The widget on your website has been updated');
      form.reset(values);
    } catch (error) {
      showSaveError(error);
    }
  });

  return (
    <>
      <div className="h-full overflow-auto">
        <h3 className="mb-4 text-lg font-semibold">Display {brand.assistantName} on your website</h3>
        <p className="mb-6 max-w-[464px]">
          Select which channels you want to make visible as a widget on your website.
        </p>
        <form id={SETTINGS_FORM_ID} onSubmit={onSubmit}>
          <Controller
            control={form.control}
            name="widget_channels"
            render={({ field }) => (
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="mb-12 block grid-cols-2 space-y-4 md:space-y-5 lg:grid lg:gap-6 lg:space-y-0"
              >
                {WIDGET_OPTIONS.map(({ value, title, description, icons }) => (
                  <Label
                    key={value}
                    htmlFor={`widget-channels-${value}`}
                    className="group mb-0 grid cursor-pointer grid-cols-[3fr_1fr] justify-end gap-x-6 rounded-lg border border-brand-300 p-5 transition-all hover:border-brand-400 has-[[data-state=checked]]:border-brand-500 has-[[data-state=checked]]:bg-brand-100 lg:mb-1 lg:grid-cols-[1.75fr_1fr] lg:p-6"
                  >
                    <div className="md:pb-9 lg:pb-11">
                      <h3 className="mb-4 flex items-center gap-x-4 font-bold text-basic">
                        <RadioGroupItem value={value} id={`widget-channels-${value}`} />
                        {title}
                      </h3>
                      <p className="text-sm">{description}</p>
                    </div>
                    <div className="relative flex pr-2 lg:pr-5">
                      <div className="absolute -bottom-2 right-0 size-[56px] rounded-tl-[56px] bg-white md:-bottom-3 md:size-[116px] md:rounded-tl-[116px]" />
                      <div className="relative ml-auto flex items-end justify-end gap-x-1 md:gap-x-2">
                        {icons}
                      </div>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            )}
          />
        </form>
        {children}
      </div>
      <SaveSettingsFooter onDiscard={() => form.reset()} isSaving={form.formState.isSubmitting} />
    </>
  );
};

export default WidgetChannelsForm;
