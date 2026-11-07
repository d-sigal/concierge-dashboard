'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

import { cn } from '@/lib/utils';
import { Check } from '@phosphor-icons/react';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer size-4 shrink-0 rounded-sm border-[1.5px] border-brand-300 ring-offset-white transition-colors hover:border-brand-400 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed data-[state=checked]:border-brand-800 data-[state=checked]:bg-brand-800 data-[state=checked]:text-white data-[state=checked]:hover:border-brand-900 data-[state=checked]:hover:bg-brand-900',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
      <Check size={12} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
