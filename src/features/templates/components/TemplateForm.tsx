'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useFormContext, useWatch } from 'react-hook-form';
import EmojiPicker from 'emoji-picker-react';
import { Info, Smiley, X } from '@phosphor-icons/react';
import AutoHeightTextArea from '@/components/common/AutoHeightTextArea';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import useNotificationsToasts from '@/hooks/useNotificationsToasts';
import { getErrorMessage } from '@/lib/api/client';
import { LANGUAGES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useCreateTemplate } from '@/features/templates/hooks';
import TemplatePreview from '@/features/templates/components/TemplatePreview';

export interface TemplateFormValues {
  name: string;
  category: 'marketing' | 'utility';
  language: string;
  message: string;
  auto_category: boolean;
}

const VARIABLES = [
  { label: 'Client - first name', value: '{{first_name}}' },
  { label: 'Client - last name', value: '{{last_name}}' },
];

const REQUIRED = { required: { value: true, message: 'This field is required' } };

const MESSAGE_INPUT_CLASS_NAME =
  'focus:border-primary-650 flex h-10 w-full rounded-md border border-primary-600 bg-transparent px-3 py-2 text-sm text-basic ring-offset-white placeholder:text-neutral-500 hover:border-primary-700 hover:text-primary-700 focus:text-primary-700 focus:placeholder:text-primary-700 focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50';

/** Live preview of the message currently typed in the template form. */
export const TemplateFormPreview = ({ className }: { className?: string }) => {
  const message = useWatch<TemplateFormValues, 'message'>({ name: 'message' });
  return <TemplatePreview message={message ?? ''} className={className} />;
};

interface Props {
  onClose: () => void;
}

const TemplateForm = ({ onClose }: Props) => {
  const form = useFormContext<TemplateFormValues>();
  const { errors } = form.formState;
  const { successToast, errorToast } = useNotificationsToasts();
  const { mutate: createTemplate, isPending } = useCreateTemplate();
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null);

  const insertIntoMessage = (text: string) => {
    const message = form.getValues('message') ?? '';
    const next = selection
      ? message.slice(0, selection.start) + text + message.slice(selection.end)
      : `${message}${text}`;
    form.setValue('message', next, { shouldDirty: true, shouldValidate: Boolean(errors.message) });
    setSelection(null);
  };

  const sendToReview = form.handleSubmit((values) =>
    createTemplate(
      { ...values, status: 'review' },
      {
        onSuccess: () => {
          successToast('Template has been sent to review.');
          onClose();
        },
        onError: (error) => errorToast(getErrorMessage(error)),
      },
    ),
  );

  return (
    <>
      <div className="overflow-auto">
        <div className="space-y-4">
          <div>
            <Label className="mb-1 block" htmlFor="template-name">
              Template name
            </Label>
            <FormField
              control={form.control}
              name="name"
              rules={REQUIRED}
              render={({ field }) => (
                <>
                  <Input
                    {...field}
                    id="template-name"
                    placeholder="Enter a name"
                    className={cn(errors.name && 'border-strokes-alert')}
                  />
                  <FormMessage />
                </>
              )}
            />
          </div>
          <div>
            <Label className="mb-1 block">Template category</Label>
            <FormField
              control={form.control}
              name="category"
              rules={REQUIRED}
              render={({ field }) => (
                <>
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="group">
                        <SelectValue placeholder="Utility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marketing">
                          Marketing
                          <p className="item text-primary-700">
                            Sending promos or info about a product / service / company
                          </p>
                        </SelectItem>
                        <SelectItem value="utility">
                          Utility
                          <p className="item text-primary-700">
                            Sending messages to an existing order or account
                          </p>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                  <FormMessage />
                </>
              )}
            />
          </div>
          <div>
            <Label className="mb-1 block">Language</Label>
            <FormField
              control={form.control}
              name="language"
              rules={REQUIRED}
              render={({ field }) => (
                <>
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={cn(errors.language && 'border-strokes-alert')}>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map(({ label, value }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                  <FormMessage />
                </>
              )}
            />
          </div>
          <div>
            <Label className="mb-1 block">Message</Label>
            <AutoHeightTextArea
              required
              className={cn(
                MESSAGE_INPUT_CLASS_NAME,
                'max-h-[115px] min-h-[40px]',
                errors.message && 'border-strokes-alert',
              )}
              onSelect={(event) => {
                const { selectionStart, selectionEnd } = event.currentTarget;
                setSelection({ start: selectionStart, end: selectionEnd });
              }}
            />
          </div>
          <div className="flex items-center gap-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="flex items-center gap-x-1 text-primary">
                  <Image alt="" src="/braces.svg" width={19} height={15} />
                  Insert variables
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {VARIABLES.map(({ value, label }) => (
                  <DropdownMenuItem key={value} onSelect={() => insertIntoMessage(value)}>
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className="flex items-center gap-x-1 text-primary">
                  <Smiley size={20} />
                  Emoji
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[348px] border-none p-0">
                <EmojiPicker onEmojiClick={({ emoji }) => insertIntoMessage(emoji)} />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-[1fr_34px] gap-x-5 rounded-xl bg-primary-200 p-4 md:grid-cols-[1fr_58px] md:gap-x-0">
            <div>
              <h2 className="mb-2 font-bold text-basic md:font-semibold">
                Automatically adjust template category
              </h2>
              <p className="text-sm text-primary-800">
                Allow the category to be automatically adjusted by Meta and avoid rejections of the template.
              </p>
            </div>
            <div className="grid md:place-items-center">
              <FormField
                control={form.control}
                name="auto_category"
                render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
              />
            </div>
          </div>
        </div>
        <div className="my-5 grid gap-x-3 border-t-[1px] border-strokes-blocks pt-6 text-primary-800 md:my-6 md:grid-cols-[20px_1fr] md:font-medium">
          <Info size={20} className="mb-2 text-warning md:mb-0" />
          <p>Once sent for review, the template can&apos;t be adjusted. Review may take up to 24 hours.</p>
        </div>
      </div>
      <DrawerFooter className="mt-auto flex-row flex-wrap items-center border-t border-gray-100 p-0 pt-4 md:flex-nowrap">
        <DrawerClose asChild>
          <Button variant="outline" className="w-[48.5%] md:order-none md:w-auto">
            Cancel
          </Button>
        </DrawerClose>
        <Button
          onClick={sendToReview}
          className="ml-auto hidden w-[48.5%] md:order-none md:ml-0 md:block md:w-auto"
          disabled={isPending}
        >
          Send to review
        </Button>

        <Drawer>
          <DrawerTrigger asChild>
            <Button type="button" className="ml-auto w-[48.5%] md:order-none md:ml-0 md:hidden md:w-auto">
              Send to review
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[calc(100%-40px)] p-6">
            <DrawerTitle className="mb-4 flex items-center justify-between">
              Send the template to review?
              <DrawerClose aria-label="Close">
                <X size={20} className="text-brand-600" />
              </DrawerClose>
            </DrawerTitle>
            <p>
              When validation is in progress your template will get the &ldquo;Review&rdquo; status until
              verification is completed.
            </p>
            <TemplateFormPreview className="mx-auto mt-6 block w-full bg-transparent" />

            <DrawerFooter className="p-0">
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">
                  Back to edit
                </Button>
              </DrawerClose>
              <Button onClick={sendToReview} className="w-full" disabled={isPending}>
                Send to review
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </DrawerFooter>
    </>
  );
};

export default TemplateForm;
