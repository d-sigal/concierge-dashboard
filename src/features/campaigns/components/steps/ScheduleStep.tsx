'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { format, startOfDay } from 'date-fns';
import { CalendarCheck, CalendarDots, Clock, PaperPlaneTilt } from '@phosphor-icons/react';
import SelectableArea from '@/components/common/SelectableArea';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { DrawerTitle } from '@/components/ui/drawer';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup } from '@/components/ui/radio-group';
import { brand } from '@/config/brand';
import type { CampaignFormValues } from '@/features/campaigns/form';

const REQUIRED = { required: 'This field is required' };

const DateTimeFields = () => {
  const { control, formState, clearErrors } = useFormContext<CampaignFormValues>();

  return (
    <div className="grid grid-cols-2 gap-x-4">
      <FormField
        control={control}
        name="date"
        rules={REQUIRED}
        render={({ field }) => (
          <FormItem className="flex flex-col space-y-0">
            <FormLabel>Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <div className="relative">
                    <CalendarDots
                      className="absolute left-[18px] top-1/2 size-4 -translate-y-1/2 transform text-brand-600"
                      size={20}
                    />
                    <Input
                      value={field.value ? format(field.value, 'PPP') : ''}
                      placeholder="Pick a date"
                      readOnly
                      className="!pl-11"
                      hasError={!!formState.errors.date}
                    />
                  </div>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    field.onChange(date);
                    clearErrors(['date', 'time']);
                  }}
                  disabled={(day) => day < startOfDay(new Date())}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="time"
        rules={REQUIRED}
        render={({ field: { onChange, ...field } }) => (
          <FormItem className="space-y-0">
            <FormLabel>Time</FormLabel>
            <div className="relative">
              <Clock
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 transform text-brand-600"
              />
              <FormControl>
                <Input
                  type="time"
                  {...field}
                  onChange={(event) => {
                    onChange(event);
                    clearErrors('time');
                  }}
                  className="pl-11"
                  hasError={!!formState.errors.time}
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const ScheduleStep = () => {
  const { control, clearErrors } = useFormContext<CampaignFormValues>();
  const [start, leadIds] = useWatch({ control, name: ['start', 'lead_ids'] });

  return (
    <>
      <DrawerTitle className="mb-4 text-lg font-semibold">
        Send campaign to {leadIds.length} contacts
      </DrawerTitle>
      <p className="mb-6">
        Choose whether you want to send this campaign immediately or schedule it for a later date.
      </p>

      <FormField
        control={control}
        name="start"
        render={({ field }) => (
          <RadioGroup onValueChange={field.onChange} value={field.value} className="mb-6">
            <SelectableArea
              id="now"
              value="now"
              icon={<PaperPlaneTilt size={20} className="text-brand-600" />}
              title="Send immediately"
              description="If you want to send your campaign right now."
              isActive={start === 'now'}
            />
            <SelectableArea
              id="scheduled"
              value="scheduled"
              icon={<CalendarCheck size={20} className="text-brand-600" />}
              title="Select time"
              description="Plan your campaign for a later date."
              isActive={start === 'scheduled'}
            >
              {start === 'scheduled' && <DateTimeFields />}
            </SelectableArea>
          </RadioGroup>
        )}
      />
      <div className="mb-6 h-px bg-gray-100" />

      <div>
        <h3 className="mb-6 font-bold">Opt-in statement</h3>
        <FormField
          control={control}
          name="accept_terms"
          rules={{ required: true }}
          render={({ field: { value, onChange, ...field } }) => (
            <FormLabel htmlFor="accept_terms" className="flex gap-x-3">
              <Checkbox
                id="accept_terms"
                {...field}
                checked={value}
                onCheckedChange={(checked) => {
                  onChange(checked === true);
                  if (checked) clearErrors('accept_terms');
                }}
                className="mt-1.5"
              />
              <div>
                By sending the message, I confirm that I have taken note of the{' '}
                {brand.termsUrl ? (
                  <a
                    href={brand.termsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-brand-800"
                  >
                    Terms and Conditions
                  </a>
                ) : (
                  'terms and conditions'
                )}{' '}
                for sending messages via the WhatsApp Business API.
              </div>
            </FormLabel>
          )}
        />
      </div>
    </>
  );
};

export default ScheduleStep;
