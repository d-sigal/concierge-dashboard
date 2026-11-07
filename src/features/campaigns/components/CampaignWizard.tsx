'use client';

import { useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { CalendarPlus, Check } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { DrawerClose, DrawerFooter } from '@/components/ui/drawer';
import useNotificationsToasts from '@/hooks/useNotificationsToasts';
import { cn, combineDateTime } from '@/lib/utils';
import { useTemplates } from '@/features/templates/hooks';
import TemplatePreview from '@/features/templates/components/TemplatePreview';
import { useCreateCampaign } from '@/features/campaigns/hooks';
import {
  type CampaignFormValues,
  type CampaignPrefill,
  getCampaignFormDefaults,
} from '@/features/campaigns/form';
import ContactsStep from '@/features/campaigns/components/steps/ContactsStep';
import GeneralStep from '@/features/campaigns/components/steps/GeneralStep';
import ScheduleStep from '@/features/campaigns/components/steps/ScheduleStep';
import TemplateStep from '@/features/campaigns/components/steps/TemplateStep';

const STEPS = ['General', 'Template', 'Contacts', 'Send campaign'] as const;
const LAST_STEP = STEPS.length - 1;

interface Props {
  prefill?: CampaignPrefill;
  onDone: () => void;
}

const CampaignWizard = ({ prefill, onDone }: Props) => {
  const [step, setStep] = useState(0);
  const { errorToast, successToast } = useNotificationsToasts();
  const { data: templates = [] } = useTemplates({ status: 'approved' });
  const { mutate: createCampaign, isPending } = useCreateCampaign();

  const form = useForm<CampaignFormValues>({ defaultValues: getCampaignFormDefaults(prefill) });
  const templateId = useWatch({ control: form.control, name: 'templateId' });
  const selectedTemplate = templates.find(({ id }) => id === templateId);

  const validateStep = async () => {
    const values = form.getValues();

    switch (step) {
      case 0:
        return form.trigger('name');
      case 1:
        if (values.templateId) return true;
        void form.trigger('templateId');
        errorToast('Choose a template to proceed.');
        return false;
      case 2:
        if (values.lead_ids.length > 0) return true;
        errorToast('Choose at least one contact to proceed.');
        return false;
      default: {
        if (values.start === 'scheduled') {
          if (!(await form.trigger(['date', 'time']))) return false;
          if (
            values.date &&
            new Date(combineDateTime(values.date.toISOString(), values.time)) <= new Date()
          ) {
            form.setError('time', { message: 'Choose a time in the future.' });
            return false;
          }
        }
        if (!values.accept_terms) {
          errorToast('You must accept the terms and conditions to continue.');
          return false;
        }
        return true;
      }
    }
  };

  const submit = () => {
    const { templateId, lead_ids, name, start, date, time } = form.getValues();

    createCampaign(
      {
        name,
        template_id: templateId,
        lead_ids,
        scheduled_time: start === 'scheduled' && date ? combineDateTime(date.toISOString(), time) : null,
      },
      {
        onSuccess: () => {
          successToast('Campaign has been created successfully.');
          onDone();
        },
      },
    );
  };

  const onNext = async () => {
    if (!(await validateStep())) return;
    if (step === LAST_STEP) submit();
    else setStep(step + 1);
  };

  return (
    <>
      <div className="flex w-full flex-col p-6">
        <div className="mb-12 flex items-center gap-x-2">
          {STEPS.map((label, index) => (
            <div key={label} className="flex w-full items-center gap-x-2 text-[13px]">
              <div
                className={cn(
                  'grid size-4 shrink-0 place-items-center rounded-full text-xs font-medium',
                  index <= step ? 'bg-brand-800 text-white' : 'bg-gray-50 text-gray-600',
                )}
              >
                {index < step ? <Check size={14} /> : index + 1}
              </div>
              <span className="whitespace-nowrap">{label}</span>
              {index < LAST_STEP && <div className="h-px w-full bg-gray-200" />}
            </div>
          ))}
        </div>
        <FormProvider {...form}>
          {step === 0 && <GeneralStep />}
          {step === 1 && <TemplateStep templates={templates} />}
          {step === 2 && <ContactsStep />}
          {step === 3 && <ScheduleStep />}
        </FormProvider>
        <DrawerFooter className="mt-auto flex flex-row items-center justify-between border-t border-t-gray-100 p-0 pt-4">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button type="button" className="font-semibold" onClick={onNext} disabled={isPending}>
            {step === LAST_STEP ? (
              <>
                Schedule <CalendarPlus size={20} className="ml-2.5" />
              </>
            ) : (
              'Next'
            )}
          </Button>
        </DrawerFooter>
      </div>
      <TemplatePreview message={selectedTemplate?.message ?? ''} />
    </>
  );
};

export default CampaignWizard;
