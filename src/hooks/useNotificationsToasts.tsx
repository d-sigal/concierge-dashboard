import React from 'react';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { useToast } from '@/hooks/use-toast';
import { WarningCircle } from '@phosphor-icons/react';

const useNotificationsToasts = () => {
  const { toast, dismiss } = useToast();

  const successToast = (title: string, onClickDismiss?: () => void, ctaLabel = 'Got it') => {
    toast({
      className: 'border border-text-success bg:white w-fit p-3 ml-auto mb-0 [&>button:last-child]:hidden',
      title: (
        <div className="flex gap-3">
          <CheckIcon />
          <h2 className="w-full text-sm font-semibold text-basic">{title}</h2>
          <div
            className="min-w-fit border-l border-basic-blocks pl-3"
            onClick={() => {
              dismiss();
              onClickDismiss?.();
            }}
          >
            {ctaLabel}
          </div>
        </div>
      ),
    });
  };

  const errorToast = (title: string) => {
    toast({
      className: 'border border-red-400 bg:white w-fit p-3 ml-auto mb-0 [&>button:last-child]:hidden',
      title: (
        <div className="flex items-center gap-3">
          <WarningCircle weight="fill" size={20} className="text-red-600" />
          <h2 className="w-full text-sm font-semibold text-basic">{title}</h2>
        </div>
      ),
    });
  };

  return {
    successToast,
    errorToast,
  };
};

export default useNotificationsToasts;
