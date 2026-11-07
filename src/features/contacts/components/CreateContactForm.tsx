'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ReactPhoneInput } from '@/components/ui/phone-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useNotificationsToasts from '@/hooks/useNotificationsToasts';
import { useCreateContact } from '@/features/contacts/hooks';

export const CREATE_CONTACT_FORM_ID = 'create-contact-form';

const formSchema = z.object({
  phone_number: z.string().min(1, 'Phone number is required'),
  type: z.enum(['lead', 'client']),
  name: z.string(),
  surname: z.string(),
  email: z.string().email().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

const FieldError = ({ message }: { message?: string }) =>
  message ? <span className="text-sm font-medium text-red-700">{message}</span> : null;

interface Props {
  onSuccess: () => void;
  onDirtyChange: (isDirty: boolean) => void;
}

const CreateContactForm = ({ onSuccess, onDirtyChange }: Props) => {
  const { successToast } = useNotificationsToasts();
  const { mutate: createContact, isPending } = useCreateContact();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { type: 'lead', phone_number: '', name: '', surname: '', email: '' },
  });

  useEffect(() => onDirtyChange(isDirty), [isDirty, onDirtyChange]);

  const onSubmit = handleSubmit(({ name, surname, email, ...rest }) => {
    if (isPending) return;
    const fullName = [name.trim(), surname.trim()].filter(Boolean).join(' ');

    createContact(
      { ...rest, ...(fullName && { name: fullName }), ...(email && { email }) },
      {
        onSuccess: () => {
          onSuccess();
          successToast('New contact has been created.');
        },
      },
    );
  });

  return (
    <form onSubmit={onSubmit} id={CREATE_CONTACT_FORM_ID}>
      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <div className="gap-y-1">
          <Label htmlFor="phone_number">Phone number</Label>
          <Controller
            name="phone_number"
            control={control}
            render={({ field }) => (
              <ReactPhoneInput
                id="phone_number"
                className="mb-1"
                value={field.value}
                onChange={(value?: string) => field.onChange(value ?? '')}
                errorClassName={errors.phone_number ? 'error' : ''}
              />
            )}
          />
          <FieldError message={errors.phone_number?.message} />
        </div>
        <div className="gap-y-1">
          <Label htmlFor="type">Contact type</Label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-[8px_70px_1fr] items-center gap-x-2">
        <hr className="bg-gray-200" />
        <span className="text-[10px]">Optional fields</span>
        <hr className="bg-gray-200" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="gap-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Add name" {...register('name')} />
        </div>
        <div className="gap-y-1">
          <Label htmlFor="surname">Surname</Label>
          <Input id="surname" placeholder="Add surname" {...register('surname')} />
        </div>
        <div className="gap-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="Add email address" {...register('email')} />
          <FieldError message={errors.email?.message} />
        </div>
      </div>
    </form>
  );
};

export default CreateContactForm;
