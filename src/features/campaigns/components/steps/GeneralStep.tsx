'use client';

import { useFormContext } from 'react-hook-form';
import { DrawerTitle } from '@/components/ui/drawer';
import { FormField, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ReactPhoneInput } from '@/components/ui/phone-input';
import { brand } from '@/config/brand';
import { useWorkspace } from '@/features/workspace/hooks';
import type { CampaignFormValues } from '@/features/campaigns/form';

const GeneralStep = () => {
  const { control, formState, clearErrors } = useFormContext<CampaignFormValues>();
  const { data: workspace } = useWorkspace();

  return (
    <>
      <DrawerTitle className="mb-4 text-lg font-semibold">Compose campaign</DrawerTitle>
      <p className="mb-6 font-medium text-gray-700">Create your WhatsApp campaign the way you want.</p>

      <Label htmlFor="name">Campaign name</Label>
      <FormField
        control={control}
        name="name"
        rules={{ required: 'This field is required' }}
        render={({ field: { onChange, ...field } }) => (
          <>
            <Input
              id="name"
              placeholder="e.g. Summer Sale"
              hasError={!!formState.errors.name}
              {...field}
              onChange={(event) => {
                onChange(event);
                clearErrors('name');
              }}
            />
            <FormMessage />
          </>
        )}
      />
      <div className="my-4 h-px w-full bg-gray-100" />

      <ReactPhoneInput id="phone" value={workspace?.phone_number ?? ''} className="mb-1" disabled />
      <p className="text-[13px]">
        This is the phone number assigned to your business when you signed up to {brand.name} and cannot be
        changed.
      </p>
    </>
  );
};

export default GeneralStep;
