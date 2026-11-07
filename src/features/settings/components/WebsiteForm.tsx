'use client';

import { useState, type KeyboardEvent } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle, X } from '@phosphor-icons/react';
import AlertIcon from '@/components/icons/AlertIcon';
import PendingIcon from '@/components/icons/PendingIcon';
import Spinner from '@/components/icons/Spinner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { brand } from '@/config/brand';
import { useUpdateClinic } from '@/features/workspace/hooks';
import { useSettingsToasts } from '@/features/settings/hooks';
import { cn } from '@/lib/utils';

interface Props {
  url: string | null | undefined;
  lastUpdated: string | null | undefined;
  className?: string;
  isOnboardingActive?: boolean;
  onSuccess?: () => void;
}

/**
 * Lets the business point the assistant at its website. The URL is locked
 * while it is being crawled (`url` set, `lastUpdated` empty) and can be
 * forgotten once crawled.
 */
const WebsiteForm = ({ url, lastUpdated, isOnboardingActive, onSuccess, className }: Props) => {
  const [isForgetDialogOpen, setIsForgetDialogOpen] = useState(false);
  const { mutate, isPending } = useUpdateClinic();
  const { successToast, showSaveError } = useSettingsToasts();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { url: url ?? '' } });

  const isCrawling = Boolean(url) && !lastUpdated;

  const train = handleSubmit((data) => {
    mutate(
      { url: data.url.trim() },
      {
        onSuccess: () => {
          successToast('URL saved successfully');
          onSuccess?.();
        },
        onError: showSaveError,
      },
    );
  });

  // This input may sit inside a parent settings form; Enter should train, not submit that form.
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    void train();
  };

  const forgetWebsite = () => {
    setIsForgetDialogOpen(false);
    mutate({ url: null }, { onSuccess: () => setValue('url', ''), onError: showSaveError });
  };

  return (
    <div className={cn(isOnboardingActive ? 'lg:mb-6' : 'mb-12', className)}>
      <div className="relative text-primary-800">
        <Label htmlFor="url" className="mb-2 block text-sm font-medium">
          Website address
        </Label>
        <div className="w-full items-center gap-x-2 text-primary-700">
          <div className={cn('relative w-full', !isOnboardingActive && 'md:max-w-[464px]')}>
            <Input
              {...register('url', {
                validate: (value) => value.trim().length > 0 || 'Enter your website address',
              })}
              placeholder="https://website.com"
              disabled={Boolean(url) || isPending}
              id="url"
              onKeyDown={onKeyDown}
              className={cn(
                'mb-4 bg-primary-100 text-basic focus:border-primary-650 focus:text-primary-700 focus:placeholder:text-primary-700 focus-visible:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0',
                (url || isPending) && 'pl-10',
                isCrawling && 'pr-10',
                errors.url && 'mb-1 border-red-400',
              )}
            />
            {errors.url && <p className="mb-4 text-sm text-red-700">{errors.url.message}</p>}
            {isCrawling && (
              <button
                type="button"
                aria-label="Forget website"
                className="absolute right-5 top-3"
                onClick={() => setIsForgetDialogOpen(true)}
              >
                <X size={14} />
              </button>
            )}
            {isPending ? (
              <Spinner className="absolute left-4 top-3 size-4" />
            ) : lastUpdated ? (
              <CheckCircle weight="fill" className="absolute left-4 top-3 size-[18px] text-green-800" />
            ) : (
              url && <PendingIcon className="absolute left-4 top-3 size-[18px]" />
            )}
          </div>
          {lastUpdated ? (
            <Button
              type="button"
              onClick={() => setIsForgetDialogOpen(true)}
              className="p-0 text-primary hover:bg-transparent"
              size="auto"
              variant="ghost"
            >
              Forget website
            </Button>
          ) : (
            !url && (
              <Button
                type="button"
                className={cn('w-full', isOnboardingActive ? 'lg:w-auto' : 'md:w-auto')}
                onClick={() => void train()}
                disabled={isPending}
              >
                Train {brand.assistantName}
              </Button>
            )
          )}
        </div>
      </div>
      <Dialog open={isForgetDialogOpen} onOpenChange={setIsForgetDialogOpen}>
        <DialogContent>
          <DialogTitle>
            <AlertIcon className="mb-5" />
            Forget this website?
          </DialogTitle>
          <DialogDescription>
            {brand.assistantName} will forget all the information it gathered from this site. You can retrain
            it by entering the site address again.
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" className="w-full" onClick={() => setIsForgetDialogOpen(false)}>
              Keep
            </Button>
            <Button className="w-full" onClick={forgetWebsite}>
              Forget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WebsiteForm;
