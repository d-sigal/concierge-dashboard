'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { brand } from '@/config/brand';
import { useAcceptTerms } from '@/features/workspace/hooks';
import useNotificationsToasts from '@/hooks/useNotificationsToasts';

/** Blocking dialog shown until the workspace has accepted the terms and conditions. */
const TermsDialog = () => {
  const { mutate: acceptTerms, isPending } = useAcceptTerms();
  const { errorToast } = useNotificationsToasts();
  const form = useForm({ defaultValues: { terms: false }, mode: 'onChange' });

  const onSubmit = () =>
    acceptTerms(undefined, {
      onError: () =>
        errorToast(
          'We were unable to save your acceptance of the terms and conditions. Please check your connection and try again.',
        ),
    });

  return (
    <Dialog open>
      <DialogContent className="max-w-prose" closeIconClassName="hidden" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle asChild>
            <h2 className="mb-6 text-center text-2xl font-bold">Terms and Conditions</h2>
          </DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} id="terms-form">
              <FormField
                control={form.control}
                name="terms"
                rules={{ required: 'This field is required' }}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-x-2">
                        <Checkbox onCheckedChange={onChange} checked={value} id="terms" />
                        <label
                          htmlFor="terms"
                          className="cursor-pointer text-sm font-medium leading-none text-slate-800"
                        >
                          By checking this box, you acknowledge and agree to our{' '}
                          {brand.termsUrl ? (
                            <a
                              href={brand.termsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline"
                            >
                              Terms and Conditions
                            </a>
                          ) : (
                            'Terms and Conditions'
                          )}
                          .
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <DialogFooter className="gap-x-3 pt-6">
            <Button form="terms-form" type="submit" disabled={isPending}>
              Accept
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default TermsDialog;
