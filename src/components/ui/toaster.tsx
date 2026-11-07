'use client';

import { useToast } from '@/hooks/use-toast';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider duration={3000}>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        titleClassName,
        descriptionClassName,
        closeClassName,
        ...props
      }) {
        return (
          <Toast key={id} {...props}>
            <div className="toast-wrapper grid gap-1">
              {title && <ToastTitle className={titleClassName}>{title}</ToastTitle>}
              {description && (
                <ToastDescription className={descriptionClassName}>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className={closeClassName} />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
